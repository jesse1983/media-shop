import { Media, PrismaClient, Prisma } from '@prisma/client';
import {
  ListParams,
  RecordNotFoundException,
  Results,
  ValidationRecordException
} from '../../../entities';
import { CrudService } from '../../../use-cases';

export class MediaService implements CrudService<Media> {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  private async findById(id: number): Promise<Media> {
    try {
      return await this.prismaClient.media.findFirstOrThrow({
        where: { id, archived: false }
      });
    } catch (err) {
      throw new RecordNotFoundException(id);
    }
  }

  async getAll(listParams: ListParams): Promise<Results<Media>> {
    const [medias, count] = await this.prismaClient.$transaction([
      this.prismaClient.media.findMany({
        ...listParams,
        where: { archived: false }
      }),
      this.prismaClient.media.count()
    ]);

    return { total: count, data: medias };
  }

  async getOne(id: number): Promise<Media> {
    return await this.findById(id);
  }

  async destroy(id: number): Promise<void> {
    const found = await this.findById(id);
    found.archived = true;
    await this.update(id, found);
  }

  async create(media: Prisma.MediaCreateInput): Promise<Media> {
    try {
      return await this.prismaClient.media.create({ data: media });
    } catch (err) {
      throw new ValidationRecordException(err);
    }
  }

  async update(id: number, media: Prisma.MediaCreateInput): Promise<Media> {
    try {
      return await this.prismaClient.media.update({
        where: { id },
        data: media
      });
    } catch (err) {
      throw new ValidationRecordException(err);
    }
  }
}
