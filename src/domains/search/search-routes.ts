import express from 'express';
import { SearchController } from './controllers';
import { PrismaClient } from '@prisma/client';
import { SearchService } from './services';

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Routes to manage your results.
 * components:
 *   schemas:
 *     SearchResult:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total of results
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SearchItem'
 *     SearchItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the customer.
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           description: The creation date
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           description: The last update date
 *           readOnly: true
 *         firstName:
 *           type: string
 *           description: The firstName of your customer.
 *         lastName:
 *           type: string
 *           description: The lastName of your customer.
 *         email:
 *           type: string
 *           description: The email of your customer.
 *         archived:
 *           type: boolean
 *           description: Customer has been archived
 *           readOnly: true
 *       example:
 *         id: 1
 *         createdAt: '2023-05-08T18:17:57.700Z'
 *         updatedAt: '2023-05-08T18:17:57.700Z'
 *         archived: false
 *         title: Star Wars V
 *         subtitle: Empire Strikes Back
 *         authorName: George Lucas
 *         description: The sequel to Star Wars (1977), it is the second film in the Star Wars
 *           film series and the fifth chronological chapter of the "Skywalker Saga"
 *         releaseYear: 1980
 *         mediaType: MOVIE
 *         units:
 *         - id: 3
 *           createdAt: '2023-05-08T18:17:57.700Z'
 *           updatedAt: '2023-05-08T18:17:57.700Z'
 *           archived: false
 *           mediaId: 1
 *           available: true
 *           availableFor:
 *           - RENT
 *           salePrice: 0
 *           rentalPrice: 10
 *         genrers:
 *         - id: 1
 *           createdAt: '2023-05-08T18:17:57.660Z'
 *           updatedAt: '2023-05-08T18:17:57.660Z'
 *           title: Science fiction
 */

export default function (connector: PrismaClient) {
  const routes = express.Router();
  const service = new SearchService(connector);

  routes
    /**
     * @swagger
     * /search:
     *   get:
     *     summary: Lists all the results
     *     tags: [Search]
     *     parameters:
     *       - name: offset
     *         description: Offset pagination
     *         in: query
     *         required: false
     *         schema:
     *           type: integer
     *           default: 0
     *       - name: limit
     *         description: Limit pagination
     *         in: query
     *         required: false
     *         schema:
     *           type: integer
     *           default: 10
     *       - name: title
     *         description: Title of media
     *         in: query
     *         required: false
     *         schema:
     *           type: string
     *       - name: mediaType
     *         description: Media type
     *         in: query
     *         required: false
     *         schema:
     *           type: string
     *           enum:
     *             - MOVIE
     *             - SERIE
     *             - BOOK
     *       - name: availableFor
     *         description: Sale or rent
     *         in: query
     *         required: false
     *         schema:
     *           type: string
     *           enum:
     *             - RENT
     *             - SALE
     *     responses:
     *       "200":
     *         description: The list of results.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/SearchResult'
     */
    .get('/', (req, res, next) =>
      new SearchController(service).search({ req, res, next })
    );
  return routes;
}
