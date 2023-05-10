/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, MediaType, NegotiationType } from '@prisma/client';
import { ListParams, Results } from '../../../entities';

export interface SearchParams extends ListParams {
  mediaType?: MediaType;
  title?: string;
  negotiationType?: NegotiationType;
}

export class SearchService {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async search({
    title,
    mediaType,
    negotiationType,
    skip,
    take
  }: SearchParams): Promise<Results<any>> {
    const titleMatch: any = title
      ? { title: { contains: title, mode: 'insensitive' } }
      : {};
    const mediaTypeMatch: any = mediaType ? { mediaType: mediaType } : {};
    const availableFor: any = negotiationType
      ? { availableFor: { hasSome: [negotiationType] } }
      : {};

    const where = {
      archived: false,
      ...titleMatch,
      ...mediaTypeMatch,
      units: {
        every: {
          archived: false,
          ...availableFor
        }
      }
    };

    const [searches, count] = await this.prismaClient.$transaction([
      this.prismaClient.media.findMany({
        skip,
        take,
        include: {
          units: true,
          genrers: true
        },
        where
      }),
      this.prismaClient.media.count({ where })
    ]);
    return {
      total: count,
      data: searches
    };
  }
}
