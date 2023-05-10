import { Prisma } from '@prisma/client';

export class SimpleException extends Error {
  message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export class HttpException extends SimpleException {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class RecordNotFoundException extends HttpException {
  constructor(id: unknown) {
    super(404, `Record with id ${id} not found`);
  }
}

export class ValidationRecordException extends HttpException {
  constructor(err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const message = err.message.split('\n').pop() as string;
      super(400, message);
    }
  }
}
