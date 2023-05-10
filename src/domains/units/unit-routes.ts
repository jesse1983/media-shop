import express from 'express';
import { UnitController } from './controllers';
import { PrismaClient } from '@prisma/client';
import { UnitService } from './services';

/**
 * @swagger
 * tags:
 *   name: Units
 *   description: Routes to manage your units.
 * components:
 *   schemas:
 *     UnitResult:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total of units
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Unit'
 *     Unit:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the unit.
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
 *           description: The firstName of your unit.
 *         lastName:
 *           type: string
 *           description: The lastName of your unit.
 *         email:
 *           type: string
 *           description: The email of your unit.
 *         archived:
 *           type: boolean
 *           description: Unit has been archived
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
  const routes = express.Router({ mergeParams: true });
  const service = new UnitService(connector);

  routes
    /**
     * @swagger
     * /units:
     *   get:
     *     summary: Lists all the units
     *     tags: [Units]
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
     *         description: The list of units.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/UnitResult'
     */
    .get('/', (req, res, next) =>
      new UnitController(service).getAll({ req, res, next })
    )
    /**
     * @swagger
     * /units:
     *   post:
     *     summary: Create a unit
     *     tags: [Units]
     *     requestBody:
     *       description: Create a unit
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Unit'
     *           example:
     *             firstName: Callie
     *             lastName: Stewart
     *             email: vel2@protonmail.edu
     *     responses:
     *       "201":
     *         description: Create a unit.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Unit'
     */
    .post('/', (req, res, next) =>
      new UnitController(service).create({ req, res, next })
    )
    /**
     * @swagger
     * /units/{id}:
     *   get:
     *     summary: Show a single unit
     *     tags: [Units]
     *     parameters:
     *       - name: id
     *         description: Unit id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Show a single unit.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Unit'
     */
    .get('/:id', (req, res, next) =>
      new UnitController(service).getOne({ req, res, next })
    )
    /**
     * @swagger
     * /units/{id}:
     *   put:
     *     summary: Update a unit
     *     tags: [Units]
     *     parameters:
     *       - name: id
     *         description: Unit id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Update a unit
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Unit'
     *           example:
     *             firstName: Callie
     *             lastName: Stewart
     *             email: vel2@protonmail.edu
     *     responses:
     *       "201":
     *         description: Update a unit.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Unit'
     */
    .put('/:id', (req, res, next) =>
      new UnitController(service).update({ req, res, next })
    )
    /**
     * @swagger
     * /units/{id}:
     *   delete:
     *     summary: Archive a single unit
     *     tags: [Units]
     *     parameters:
     *       - name: id
     *         description: Unit id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "204":
     *         description: Archive a single unit.
     */
    .delete('/:id', (req, res, next) =>
      new UnitController(service).destroy({ req, res, next })
    );

  return routes;
}
