import { NextFunction, Request, Response } from 'express';

interface HttpException extends Error {
  status: number;
  message: string;
}

export type Controller = (req: Request, res: Response) => void;

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export type ErrorHandler =
  (err: HttpException, req: Request, res: Response, next: NextFunction) => void;
