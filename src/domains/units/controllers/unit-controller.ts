import {
  CrudController,
  RouteParams
} from '../../../use-cases/crud-controller';
import { UnitService } from '../services';

export class UnitController implements CrudController {
  service: UnitService;

  constructor(service: UnitService) {
    this.service = service;
  }

  async getAll({ req, res, next }: RouteParams) {
    const mediaId = Number.parseInt(req.params.mediaId);
    const { offset, limit } = req.query;
    const skip = offset ? Number.parseInt(String(offset)) : 0;
    const take = limit ? Number.parseInt(String(limit)) : 10;

    try {
      const result = await this.service.getAll({ skip, take }, mediaId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getOne({ req, res, next }: RouteParams) {
    const id = req.params.id;
    const mediaId = Number.parseInt(req.params.mediaId);

    try {
      const result = await this.service.getOne(Number.parseInt(id), mediaId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async create({ req, res }: RouteParams) {
    const unit = req.body;
    const mediaId = Number.parseInt(req.params.mediaId);

    const created = await this.service.create(unit, mediaId);
    res.status(201).json(created);
  }

  async update({ req, res }: RouteParams) {
    const unit = req.body;
    const id = req.params.id;
    const updated = await this.service.update(Number.parseInt(id), unit);
    res.status(201).json(updated);
  }

  async destroy({ req, res, next }: RouteParams) {
    const id = req.params.id;
    const mediaId = Number.parseInt(req.params.mediaId);

    try {
      await this.service.destroy(Number.parseInt(id), mediaId);
      res.status(204).send('');
    } catch (e) {
      next(e);
    }
  }
}
