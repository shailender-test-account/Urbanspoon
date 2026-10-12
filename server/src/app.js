import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import menuRoutes from './routes/menu.routes.js';
import chatRoutes from './routes/chat.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// Render sits behind a proxy; needed for correct IPs (rate limiting) and secure cookies
app.set('trust proxy', 1);

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173']
  .filter(Boolean)
  .map((o) => o.trim().replace(/\/$/, ''));

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked for origin ${origin}`));
    },
    credentials: true,
  })
);
app.use(compression());
// keep the raw body: needed to verify Meta's HMAC signature on inbound webhooks
app.use(
  express.json({
    limit: '100kb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());
app.use(mongoSanitize());
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
// stricter limiter for credential endpoints
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }));

app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/whatsapp', whatsappRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
