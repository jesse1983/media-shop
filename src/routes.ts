import express from 'express';
import { PrismaClient } from '@prisma/client';
import { customerRoutes } from './domains/customers';
import { mediaRoutes } from './domains/medias';
import { genreRoutes } from './domains/genres';
import { negotiationRoutes } from './domains/negotiations';
import { searchRoutes } from './domains/search';

export default function (connector: PrismaClient) {
  const routes = express.Router();

  routes.get('/health', (req, res) => res.send('Running'));
  routes.use('/customers', customerRoutes(connector));
  routes.use('/medias', mediaRoutes(connector));
  routes.use('/genres', genreRoutes(connector));
  routes.use('/negotiations', negotiationRoutes(connector));
  routes.use('/search', searchRoutes(connector));

  return routes;
}
