import { Customer, PrismaClient, Prisma } from '@prisma/client';
import {
  ListParams,
  RecordNotFoundException,
  Results,
  ValidationRecordException
} from '../../../entities';
import { CrudService } from '../../../use-cases';

export class CustomerService implements CrudService<Customer> {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  private async findById(id: number): Promise<Customer> {
    try {
      return await this.prismaClient.customer.findFirstOrThrow({
        where: { id, archived: false }
      });
    } catch (err) {
      throw new RecordNotFoundException(id);
    }
  }

  async getAll(listParams: ListParams): Promise<Results<Customer>> {
    const [customers, count] = await this.prismaClient.$transaction([
      this.prismaClient.customer.findMany({
        ...listParams,
        where: { archived: false }
      }),
      this.prismaClient.customer.count()
    ]);

    return { total: count, data: customers };
  }

  async getOne(id: number): Promise<Customer> {
    return await this.findById(id);
  }

  async destroy(id: number): Promise<void> {
    const found = await this.findById(id);
    found.archived = true;
    await this.update(id, found);
  }

  async create(customer: Prisma.CustomerCreateInput): Promise<Customer> {
    try {
      return await this.prismaClient.customer.create({ data: customer });
    } catch (err) {
      throw new ValidationRecordException(err);
    }
  }

  async update(
    id: number,
    customer: Prisma.CustomerCreateInput
  ): Promise<Customer> {
    try {
      return await this.prismaClient.customer.update({
        where: { id },
        data: customer
      });
    } catch (err) {
      throw new ValidationRecordException(err);
    }
  }
}
