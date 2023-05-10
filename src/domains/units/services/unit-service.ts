import { Unit, PrismaClient, Prisma } from '@prisma/client';
import {
  ListParams,
  RecordNotFoundException,
  Results
} from '../../../entities';

export class UnitService {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  private async findById(id: number, mediaId: number): Promise<Unit> {
    try {
      return await this.prismaClient.unit.findFirstOrThrow({
        where: { id, archived: false, mediaId }
      });
    } catch (err) {
      throw new RecordNotFoundException(id);
    }
  }

  async getAll(
    listParams: ListParams,
    mediaId: number
  ): Promise<Results<Unit>> {
    const [units, count] = await this.prismaClient.$transaction([
      this.prismaClient.unit.findMany({
        ...listParams,
        where: { archived: false, mediaId }
      }),
      this.prismaClient.unit.count({ where: { archived: false, mediaId } })
    ]);

    return { total: count, data: units };
  }

  async getOne(id: number, mediaId: number): Promise<Unit> {
    return await this.findById(id, mediaId);
  }

  async destroy(id: number, mediaId: number): Promise<void> {
    const found = await this.findById(id, mediaId);
    found.archived = true;
    await this.update(id, found);
  }

  async create(unit: Unit, mediaId: number): Promise<Unit> {
    return await this.prismaClient.unit.create({ data: { ...unit, mediaId } });
  }

  async update(id: number, unit: Prisma.UnitUpdateInput): Promise<Unit> {
    return await this.prismaClient.unit.update({
      where: { id },
      data: unit
    });
  }
}
