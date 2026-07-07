import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

export interface AppError extends Error {
  statusCode?: number;
  code?: number; // for mongo error codes
  keyValue?: any; // for duplicate key errors
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found / Invalid ID format';
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate field value entered for ${field}`;
  }

  console.error(`[ERROR] ${statusCode} - ${message}\nStack: ${err.stack}`);

  sendError(res, statusCode, message, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
