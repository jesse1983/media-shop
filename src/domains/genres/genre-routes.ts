import express from 'express';
import { GenreController } from './controllers';
import { PrismaClient } from '@prisma/client';
import { GenreService } from './services';

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Routes to manage your genres.
 * components:
 *   schemas:
 *     GenreResult:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total of genres
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Genre'
 *     Genre:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the genre.
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           description: The creation date
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           description: The last update date
 *           readOnly: true
 *         title:
 *           type: string
 *           description: The title of your genre.
 *       example:
 *          id: 1
 *          createdAt: '2023-05-07T19:51:11.706Z'
 *          updatedAt: '2023-05-07T19:51:11.706Z'
 *          title: Romance
 */

export default function (connector: PrismaClient) {
  const routes = express.Router();
  const service = new GenreService(connector);

  routes
    /**
     * @swagger
     * /genres:
     *   get:
     *     summary: Lists all the genres
     *     tags: [Genres]
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
     *     responses:
     *       "200":
     *         description: The list of genres.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/GenreResult'
     */
    .get('/', (req, res, next) =>
      new GenreController(service).getAll({ req, res, next })
    )
    /**
     * @swagger
     * /genres:
     *   post:
     *     summary: Create a genre
     *     tags: [Genres]
     *     requestBody:
     *       description: Create a genre
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Genre'
     *           example:
     *             title: Romance
     *     responses:
     *       "201":
     *         description: Create a genre.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Genre'
     */
    .post('/', (req, res, next) =>
      new GenreController(service).create({ req, res, next })
    )
    /**
     * @swagger
     * /genres/{id}:
     *   get:
     *     summary: Show a single genre
     *     tags: [Genres]
     *     parameters:
     *       - name: id
     *         description: Genre id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Show a single genre.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Genre'
     */
    .get('/:id', (req, res, next) =>
      new GenreController(service).getOne({ req, res, next })
    )
    /**
     * @swagger
     * /genres/{id}:
     *   put:
     *     summary: Update a genre
     *     tags: [Genres]
     *     parameters:
     *       - name: id
     *         description: Genre id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Update a genre
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Genre'
     *           example:
     *             title: Romance
     *     responses:
     *       "201":
     *         description: Update a genre.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Genre'
     */
    .put('/:id', (req, res, next) =>
      new GenreController(service).update({ req, res, next })
    )
    /**
     * @swagger
     * /genres/{id}:
     *   delete:
     *     summary: Archive a single genre
     *     tags: [Genres]
     *     parameters:
     *       - name: id
     *         description: Genre id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "204":
     *         description: Archive a single genre.
     */
    .delete('/:id', (req, res, next) =>
      new GenreController(service).destroy({ req, res, next })
    );

  return routes;
}
