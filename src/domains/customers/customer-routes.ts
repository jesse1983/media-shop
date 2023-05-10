import express from 'express';
import { CustomerController } from './controllers';
import { PrismaClient } from '@prisma/client';
import { CustomerService } from './services';

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Routes to manage your customers.
 * components:
 *   schemas:
 *     CustomerResult:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total of customers
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Customer'
 *     Customer:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
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
  const service = new CustomerService(connector);

  routes
    /**
     * @swagger
     * /customers:
     *   get:
     *     summary: Lists all the customers
     *     tags: [Customers]
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
     *         description: The list of customers.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/CustomerResult'
     */
    .get('/', (req, res, next) =>
      new CustomerController(service).getAll({ req, res, next })
    )
    /**
     * @swagger
     * /customers:
     *   post:
     *     summary: Create a customer
     *     tags: [Customers]
     *     requestBody:
     *       description: Create a customer
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Customer'
     *           example:
     *             firstName: Callie
     *             lastName: Stewart
     *             email: vel2@protonmail.edu
     *     responses:
     *       "201":
     *         description: Create a customer.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Customer'
     */
    .post('/', (req, res, next) =>
      new CustomerController(service).create({ req, res, next })
    )
    /**
     * @swagger
     * /customers/{id}:
     *   get:
     *     summary: Show a single customer
     *     tags: [Customers]
     *     parameters:
     *       - name: id
     *         description: Customer id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Show a single customer.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Customer'
     */
    .get('/:id', (req, res, next) =>
      new CustomerController(service).getOne({ req, res, next })
    )
    /**
     * @swagger
     * /customers/{id}:
     *   put:
     *     summary: Update a customer
     *     tags: [Customers]
     *     parameters:
     *       - name: id
     *         description: Customer id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Update a customer
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Customer'
     *           example:
     *             firstName: Callie
     *             lastName: Stewart
     *             email: vel2@protonmail.edu
     *     responses:
     *       "201":
     *         description: Update a customer.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Customer'
     */
    .put('/:id', (req, res, next) =>
      new CustomerController(service).update({ req, res, next })
    )
    /**
     * @swagger
     * /customers/{id}:
     *   delete:
     *     summary: Archive a single customer
     *     tags: [Customers]
     *     parameters:
     *       - name: id
     *         description: Customer id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "204":
     *         description: Archive a single customer.
     */
    .delete('/:id', (req, res, next) =>
      new CustomerController(service).destroy({ req, res, next })
    );

  return routes;
}
