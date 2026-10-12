import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const message = result.array().map((e) => e.msg).join(', ');
    return next(new AppError(message, 400));
  }
  next();
};

export default validate;
