/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../entities/httpException';

export default function (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errStatus = err.status || 500;
  const errMsg = err.message;
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg
  });
}
