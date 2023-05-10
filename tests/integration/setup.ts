import { execSync } from 'child_process';
import seeder from '../../src/config/prisma/seeder';
import { PrismaClient } from '@prisma/client';

export default async function () {
  await execSync('docker-compose up db-test -d');
  await execSync('npx prisma db push');
  await seeder(new PrismaClient());
}
