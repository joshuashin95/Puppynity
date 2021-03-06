import { NextFunction, Request, Response } from 'express';

const { validationResult } = require('express-validator');

export const validation = (req: Request, res: Response, next: NextFunction) => {
  console.log('vlidation middleware ✅');
  const error = validationResult(req);
  console.log('validation error: ', error.array()[0]);
  if (!error.isEmpty()) {
    return res.status(400).json({ message: error.array()[0].msg });
  }

  next();
};
