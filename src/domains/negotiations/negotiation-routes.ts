import express from 'express';
import { NegotiationController } from './controllers';
import { PrismaClient } from '@prisma/client';
import { NegotiationService } from './services';

/**
 * @swagger
 * tags:
 *   name: Negotiations
 *   description: Routes to manage your negotiations.
 * components:
 *   schemas:
 *     NegotiationResult:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total of negotiations
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Negotiation'
 *     Negotiation:
 *       type: object
 *       required:
 *         - negotiationType
 *         - customerId
 *         - units
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the negotiation.
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           description: The creation date
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           description: The last update date
 *           readOnly: true
 *         negotiationType:
 *           type: string
 *           description: Rent or Sale
 *           enum:
 *             - RENT
 *             - SALE
 *         customerId:
 *           type: integer
 *           writeOnly: true
 *         units:
 *           type: array
 *           writeOnly: true
 *           items:
 *             type: integer
 *         totalPrice:
 *           type: integer
 *           default: 0
 *         scheduledDeliveryAt:
 *           type: string
 *         deliveredAt:
 *           type: string
 *         archived:
 *           type: boolean
 *           description: Negotiation has been archived
 *           readOnly: true
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *           readOnly: true
 *       example:
 *         id: 1
 *         createdAt: '2023-05-09T20:20:52.902Z'
 *         updatedAt: '2023-05-09T20:20:52.902Z'
 *         archived: false
 *         negotiationType: RENT
 *         totalPrice: 400
 *         customerId: 1
 *         scheduledDeliveryAt: '2023-05-12T20:20:52.900Z'
 *         deliveredAt: '2023-05-12T20:20:52.900Z'
 *         customer:
 *           id: 1
 *           createdAt: '2023-05-09T20:20:52.902Z'
 *           updatedAt: '2023-05-09T20:20:52.902Z'
 *           archived: false
 *           firstName: Callie
 *           lastName: Stewart
 *           email: vel@protonmail.edu
 *         units:
 *         - id: 1
 *           createdAt: '2023-05-09T20:20:52.854Z'
 *           updatedAt: '2023-05-09T20:20:52.854Z'
 *           archived: false
 *           mediaId: 1
 *           available: true
 *           availableFor:
 *           - RENT
 *           salePrice: 0
 *           rentalPrice: 10
 */

export default function (connector: PrismaClient) {
  const routes = express.Router();
  const service = new NegotiationService(connector);

  routes
    /**
     * @swagger
     * /negotiations:
     *   get:
     *     summary: Lists all the negotiations
     *     tags: [Negotiations]
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
     *         description: The list of negotiations.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/NegotiationResult'
     */
    .get('/', (req, res, next) =>
      new NegotiationController(service).getAll({ req, res, next })
    )
    /**
     * @swagger
     * /negotiations:
     *   post:
     *     summary: Create a negotiation
     *     tags: [Negotiations]
     *     requestBody:
     *       description: Create a negotiation
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Negotiation'
     *           example:
     *             negotiationType: 'RENT'
     *             totalPrice: 2700
     *             customerId: 2
     *             scheduledDeliveryAt: '2023-05-12T15:25:44.215Z'
     *             units: [2]
     *     responses:
     *       "201":
     *         description: Create a negotiation.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Negotiation'
     */
    .post('/', (req, res, next) =>
      new NegotiationController(service).create({ req, res, next })
    )
    /**
     * @swagger
     * /negotiations/{id}:
     *   get:
     *     summary: Show a single negotiation
     *     tags: [Negotiations]
     *     parameters:
     *       - name: id
     *         description: Negotiation id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Show a single negotiation.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Negotiation'
     */
    .get('/:id', (req, res, next) =>
      new NegotiationController(service).getOne({ req, res, next })
    )
    /**
     * @swagger
     * /negotiations/{id}/deliver:
     *   post:
     *     summary: Deliver a rent negotiation
     *     tags: [Negotiations]
     *     parameters:
     *       - name: id
     *         description: Negotiation id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Deliver a rent negotiation.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Negotiation'
     */
    .post('/:id/deliver', (req, res, next) =>
      new NegotiationController(service).deliver({ req, res, next })
    )
    /**
     * @swagger
     * /negotiations/{id}:
     *   delete:
     *     summary: Archive a single negotiation
     *     tags: [Negotiations]
     *     parameters:
     *       - name: id
     *         description: Negotiation id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "204":
     *         description: Archive a single negotiation.
     */
    .delete('/:id', (req, res, next) =>
      new NegotiationController(service).destroy({ req, res, next })
    );

  return routes;
}
