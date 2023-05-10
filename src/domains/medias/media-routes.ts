import express from 'express';
import { MediaController } from './controllers';
import { PrismaClient } from '@prisma/client';
import { MediaService } from './services';
import { unitRoutes } from '../units';

/**
 * @swagger
 * tags:
 *   name: Medias
 *   description: Routes to manage your medias.
 * components:
 *   schemas:
 *     MediaResult:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total of medias
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 *     Media:
 *       type: object
 *       required:
 *         - title
 *         - releaseYear
 *         - mediaType
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the media.
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
 *           description: The title of your media.
 *         subtitle:
 *           type: string
 *           description: The subtitle of your media.
 *         authorName:
 *           type: string
 *           description: The authorName of your media.
 *         description:
 *           type: string
 *           description: The description of your media.
 *         releaseYear:
 *           type: int
 *           description: The releaseYear of your media.
 *         mediaType:
 *           type: string
 *           description: The mediaType of your media.
 *           enum:
 *             - MOVIE
 *             - SERIE
 *             - BOOK
 *         archived:
 *           type: boolean
 *           description: Media has been archived
 *           readOnly: true
 *       example:
 *          id: 1
 *          createdAt: '2023-05-07T19:51:11.706Z'
 *          updatedAt: '2023-05-07T19:51:11.706Z'
 *          archived: false
 *          firstName: Callie
 *          lastName: Stewart
 *          email: vel@protonmail.edu
 */

export default function (connector: PrismaClient) {
  const routes = express.Router();
  const service = new MediaService(connector);

  routes
    /**
     * @swagger
     * /medias:
     *   get:
     *     summary: Lists all the medias
     *     tags: [Medias]
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
     *         description: The list of medias.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/MediaResult'
     */
    .get('/', (req, res, next) =>
      new MediaController(service).getAll({ req, res, next })
    )
    /**
     * @swagger
     * /medias:
     *   post:
     *     summary: Create a media
     *     tags: [Medias]
     *     requestBody:
     *       description: Create a media
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Media'
     *           example:
     *             firstName: Callie
     *             lastName: Stewart
     *             email: vel2@protonmail.edu
     *     responses:
     *       "201":
     *         description: Create a media.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Media'
     */
    .post('/', (req, res, next) =>
      new MediaController(service).create({ req, res, next })
    )
    /**
     * @swagger
     * /medias/{id}:
     *   get:
     *     summary: Show a single media
     *     tags: [Medias]
     *     parameters:
     *       - name: id
     *         description: Media id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Show a single media.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Media'
     */
    .get('/:id', (req, res, next) =>
      new MediaController(service).getOne({ req, res, next })
    )
    /**
     * @swagger
     * /medias/{id}:
     *   put:
     *     summary: Update a media
     *     tags: [Medias]
     *     parameters:
     *       - name: id
     *         description: Media id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Update a media
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Media'
     *           example:
     *             firstName: Callie
     *             lastName: Stewart
     *             email: vel2@protonmail.edu
     *     responses:
     *       "201":
     *         description: Update a media.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Media'
     */
    .put('/:id', (req, res, next) =>
      new MediaController(service).update({ req, res, next })
    )
    /**
     * @swagger
     * /medias/{id}:
     *   delete:
     *     summary: Archive a single media
     *     tags: [Medias]
     *     parameters:
     *       - name: id
     *         description: Media id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "204":
     *         description: Archive a single media.
     */
    .delete('/:id', (req, res, next) =>
      new MediaController(service).destroy({ req, res, next })
    );

  routes.use('/:mediaId/units', unitRoutes(connector));
  return routes;
}
