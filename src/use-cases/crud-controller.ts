import { Request, Response, NextFunction } from 'express';

export type RouteParams = {
  req: Request;
  res: Response;
  next: NextFunction;
};

export interface CrudController {
  getAll(params: RouteParams): Promise<void>;
  getOne(params: RouteParams): Promise<void>;
  create(params: RouteParams): Promise<void>;
  update(params: RouteParams): Promise<void>;
  destroy(params: RouteParams): Promise<void>;
}
