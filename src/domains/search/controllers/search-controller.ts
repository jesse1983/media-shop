import { MediaType, NegotiationType } from '@prisma/client';
import { RouteParams } from '../../../use-cases/crud-controller';
import { SearchService } from '../services';

export class SearchController {
  service: SearchService;

  constructor(service: SearchService) {
    this.service = service;
  }

  private formatNegotiationType(
    availableFor: string
  ): NegotiationType | undefined {
    if (availableFor && availableFor === 'RENT') return NegotiationType.RENT;
    if (availableFor && availableFor === 'SALE') return NegotiationType.SALE;
  }

  private formatMediaType(mediaType: string): MediaType | undefined {
    if (mediaType && mediaType === 'MOVIE') return MediaType.MOVIE;
    if (mediaType && mediaType === 'SERIE') return MediaType.SERIE;
    if (mediaType && mediaType === 'BOOK') return MediaType.BOOK;
  }

  async search({ req, res, next }: RouteParams) {
    const { offset, limit, availableFor, title, mediaType } = req.query;
    const skip = offset ? Number.parseInt(String(offset)) : 0;
    const take = limit ? Number.parseInt(String(limit)) : 10;

    try {
      const result = await this.service.search({
        skip,
        take,
        title: title as string,
        negotiationType: this.formatNegotiationType(availableFor as string),
        mediaType: this.formatMediaType(mediaType as string)
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}
