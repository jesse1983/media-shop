import { ListParams, Results } from '../entities';

export interface CrudService<T> {
  getAll(listParams: ListParams): Promise<Results<T>>;
  getOne(id: number): Promise<T>;
  destroy(id: number): Promise<void>;
  create(data: T): Promise<T>;
  update(id: number, data: T): Promise<T>;
}
