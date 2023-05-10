import { CrudController, CrudParams } from '../../../use-cases';
import { MediaService } from '../services';

export class MediaController implements CrudController {
  service: MediaService;

  constructor(service: MediaService) {
    this.service = service;
  }

  async getAll({ req, res, next }: CrudParams) {
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

  async getOne({ req, res, next }: CrudParams) {
    const id = req.params.id;

    try {
      const result = await this.service.getOne(Number.parseInt(id));
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async create({ req, res, next }: CrudParams) {
    const customer = req.body;

    try {
      const created = await this.service.create(customer);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  async update({ req, res, next }: CrudParams) {
    const customer = req.body;
    const id = req.params.id;

    try {
      const updated = await this.service.update(Number.parseInt(id), customer);
      res.status(201).json(updated);
    } catch (err) {
      next(err);
    }
  }

  async destroy({ req, res, next }: CrudParams) {
    const id = req.params.id;

    try {
      await this.service.destroy(Number.parseInt(id));
      res.status(204).send('');
    } catch (e) {
      next(e);
    }
  }
}
