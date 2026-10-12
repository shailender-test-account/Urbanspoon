# Urban Spoon – MERN Restaurant App

React + Redux Toolkit (Vite, Tailwind) client · Express (MVC) API · MongoDB (Mongoose)

```
urban-spoon/
├── server/                 # Express API  → deploy to Render
│   └── src/
│       ├── config/         # db connection
│       ├── models/         # User, Booking, MenuItem
│       ├── controllers/    # auth, booking, menu, chat
│       ├── routes/         # route definitions + validation
│       ├── middleware/     # auth (JWT + RBAC), error, validate
│       ├── services/       # ai, whatsapp, token
│       ├── app.js · server.js · seed.js
├── client/                 # React SPA    → deploy to Vercel
│   └── src/ (api, store, features/*Slice, components, pages)
└── render.yaml
```

## Features
- **Auth**: JWT in httpOnly cookie (+ Bearer fallback), bcrypt, rate-limited.
- **RBAC**: roles `user` / `admin`. API enforces via `protect` + `authorize('admin')`; client guards via `ProtectedRoute`.
- **Table booking** (Redux): logged-in users book, view and cancel; admin views, filters, searches, paginates, updates status, deletes.
- **Chatbot + AI**: `/api/chat` uses Claude (Anthropic API) with your live menu as context; falls back to rules if no key / API error. `/api/menu/recommend` powers the "AI Food Finder" on the home page.
- **WhatsApp**: floating click-to-chat button (`wa.me`), plus WhatsApp Cloud API notifications: admin alerted on new booking, customer notified on status change.

## Local setup
```bash
# API
cd server && cp .env.example .env   # fill MONGO_URI, JWT_SECRET
npm install
npm run seed                        # menu + admin (admin@urbanspoon.com / Admin@12345 — change it!)
npm run dev                         # http://localhost:5000

# Client
cd client && cp .env.example .env   # leave VITE_API_URL empty in dev (Vite proxies /api)
npm install
npm run dev                         # http://localhost:5173
```

## Deploy API → Render
1. Push repo to GitHub. Render → New → Blueprint (uses `render.yaml`) or Web Service with **Root Directory `server`**, build `npm install`, start `npm start`.
2. Env vars: `NODE_ENV=production`, `MONGO_URI` (Atlas; allow Render IPs / 0.0.0.0/0), `JWT_SECRET`, `CLIENT_URL=https://your-app.vercel.app` (comma-separate multiple origins, no trailing slash), optional `ANTHROPIC_API_KEY`, `WHATSAPP_*`.
3. Run the seed once from the Render shell: `npm run seed`.
4. Free plan sleeps after inactivity — first request may take ~30s.

## Deploy client → Vercel
1. Vercel → New Project → **Root Directory `client`** (framework: Vite auto-detected).
2. Env vars: `VITE_API_URL=https://<your-render-service>.onrender.com`, `VITE_WHATSAPP_NUMBER=<digits>`.
3. `vercel.json` already rewrites all routes to `index.html` for React Router.

## WhatsApp Cloud API
Create a Meta app → WhatsApp → get a permanent token + phone number ID. Free-form messages only deliver inside the 24h window; for production notifications to new customers, create approved **message templates** and switch `sendWhatsAppText` to a template payload.

## Production checklist
- Change the seeded admin password immediately; promote more admins by editing `role` in MongoDB.
- Rotate `JWT_SECRET`; never commit `.env`.
- Add a custom domain on both so cookies are first-party if possible (Safari blocks third-party cookies; the Bearer fallback already covers this).
- Reservation images use Unsplash hotlinks — replace with your own assets/CDN.
