import {
  Negotiation,
  PrismaClient,
  NegotiationType,
  Unit
} from '@prisma/client';
import { ListParams, Results } from '../../../entities';
import { HttpException } from '../../../entities/httpException';

export type NegotiationInput = {
  negotiationType: NegotiationType;
  totalPrice: number;
  customerId: number;
  scheduledDeliveryAt: string;
  deliveredAt: string;
  units: number[];
};

export class NegotiationService {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  private async checkAvailableUnits(ids: number[]): Promise<void> {
    const count = await this.prismaClient.unit.count({
      where: {
        id: {
          in: ids
        },
        available: true
      }
    });
    if (count < ids.length) {
      throw new HttpException(400, 'All units must been available');
    }
  }
  private async toggleAvailableUnits(
    ids: number[],
    available: boolean
  ): Promise<void> {
    const promises = ids.map((id) =>
      this.prismaClient.unit.update({
        where: { id },
        data: { available }
      })
    );
    await Promise.all(promises);
  }

  private async reserveUnits(ids: number[]): Promise<void> {
    return await this.toggleAvailableUnits(ids, false);
  }

  private async enableUnits(ids: number[]): Promise<void> {
    return await this.toggleAvailableUnits(ids, true);
  }

  private async findById(id: number): Promise<Negotiation & { units: Unit[] }> {
    return await this.prismaClient.negotiation.findFirstOrThrow({
      where: { id, archived: false },
      include: {
        customer: true,
        units: true
      }
    });
  }

  async getAll(listParams: ListParams): Promise<Results<Negotiation>> {
    const [negotiations, count] = await this.prismaClient.$transaction([
      this.prismaClient.negotiation.findMany({
        ...listParams,
        where: { archived: false },
        include: {
          customer: true,
          units: true
        }
      }),
      this.prismaClient.negotiation.count()
    ]);

    return { total: count, data: negotiations };
  }

  async getOne(id: number): Promise<Negotiation> {
    return await this.findById(id);
  }

  async destroy(id: number): Promise<void> {
    const found = await this.findById(id);
    found.archived = true;
    await this.archive(id);
  }

  async create(negotiation: NegotiationInput): Promise<Negotiation> {
    await this.checkAvailableUnits(negotiation.units);
    const created = await this.prismaClient.negotiation.create({
      data: {
        ...negotiation,
        units: {
          connect: negotiation.units.map((unit) => ({ id: unit }))
        }
      }
    });
    await this.reserveUnits(negotiation.units);
    return await this.findById(created.id);
  }

  async archive(id: number): Promise<void> {
    await this.prismaClient.negotiation.update({
      where: { id },
      data: {
        archived: true
      },
      include: {
        customer: true,
        units: true
      }
    });
  }

  async deliver(id: number): Promise<Negotiation> {
    const negotiation = await this.findById(id);
    await this.enableUnits(negotiation.units.map((unit) => unit.id));
    return await this.prismaClient.negotiation.update({
      where: {
        id
      },
      include: {
        units: true,
        customer: true
      },
      data: {
        deliveredAt: new Date().toISOString()
      }
    });
  }
}
