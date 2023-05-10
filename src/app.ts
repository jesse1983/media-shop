import express from 'express';
import routes from './routes';
import { PrismaClient } from '@prisma/client';
import errorHandler from './config/errorHandler';
import { url, serve, setup } from './config/openapi';

export default function (connection: PrismaClient) {
  const app = express();

  app.use(express.json());
  app.use(url, serve, setup);
  app.use('/', routes(connection));
  app.use(errorHandler);

  return app;
}
