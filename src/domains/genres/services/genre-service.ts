import { Genre, PrismaClient, Prisma } from '@prisma/client';
import {
  ListParams,
  RecordNotFoundException,
  Results,
  ValidationRecordException
} from '../../../entities';
import { CrudService } from '../../../use-cases';

export class GenreService implements CrudService<Genre> {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  private async findById(id: number): Promise<Genre> {
    try {
      return await this.prismaClient.genre.findFirstOrThrow({
        where: { id }
      });
    } catch (err) {
      throw new RecordNotFoundException(id);
    }
  }

  async getAll(listParams: ListParams): Promise<Results<Genre>> {
    const [genres, count] = await this.prismaClient.$transaction([
      this.prismaClient.genre.findMany({ ...listParams }),
      this.prismaClient.genre.count()
    ]);

    return { total: count, data: genres };
  }

  async getOne(id: number): Promise<Genre> {
    return await this.findById(id);
  }

  async destroy(id: number): Promise<void> {
    await this.findById(id);
    await this.prismaClient.genre.delete({ where: { id } });
  }

  async create(genre: Prisma.GenreCreateInput): Promise<Genre> {
    try {
      return await this.prismaClient.genre.create({ data: genre });
    } catch (err) {
      throw new ValidationRecordException(err);
    }
  }

  async update(id: number, genre: Prisma.GenreCreateInput): Promise<Genre> {
    try {
      return await this.prismaClient.genre.update({
        where: { id },
        data: genre
      });
    } catch (err) {
      throw new ValidationRecordException(err);
    }
  }
}
