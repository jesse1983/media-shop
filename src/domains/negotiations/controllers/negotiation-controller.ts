import { RouteParams } from '../../../use-cases/crud-controller';
import { NegotiationService } from '../services';

export class NegotiationController {
  service: NegotiationService;

  constructor(service: NegotiationService) {
    this.service = service;
  }

  async getAll({ req, res, next }: RouteParams) {
    const { offset, limit } = req.query;
    const skip = offset ? Number.parseInt(String(offset)) : 0;
    const take = limit ? Number.parseInt(String(limit)) : 10;

    try {
      const result = await this.service.getAll({ skip, take });
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getOne({ req, res, next }: RouteParams) {
    const id = req.params.id;

    try {
      const result = await this.service.getOne(Number.parseInt(id));
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async create({ req, res, next }: RouteParams) {
    const negotiation = req.body;
    try {
      const created = await this.service.create(negotiation);
      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  }

  async destroy({ req, res, next }: RouteParams) {
    const id = req.params.id;

    try {
      await this.service.destroy(Number.parseInt(id));
      res.status(204).send('');
    } catch (e) {
      next(e);
    }
  }

  async deliver({ req, res }: RouteParams) {
    const id = req.params.id;
    const delivered = await this.service.deliver(Number.parseInt(id));
    res.status(201).json(delivered);
  }
}
