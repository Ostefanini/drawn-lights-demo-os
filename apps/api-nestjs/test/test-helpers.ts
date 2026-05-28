import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { PrismaTestService } from './prisma-test.service.js';

/**
 * Creates a NestJS test application with full configuration
 */
export async function createTestApp(): Promise<{
  app: INestApplication;
  prismaTest: PrismaTestService;
}> {
  const prismaTest = new PrismaTestService();
  await prismaTest.$connect();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(prismaTest)
    .compile();

  const app = moduleFixture.createNestApplication();

  // Global configuration (pipes, interceptors, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  return { app, prismaTest };
}

/**
 * Cleans up application and database after tests
 */
export async function cleanupTestApp(
  app: INestApplication,
  prismaTest: PrismaTestService,
): Promise<void> {
  await prismaTest.cleanDatabase();
  await prismaTest.$disconnect();
  await app.close();
}

/**
 * Reusable test data
 */
export const testData = {
  users: {
    user1: {
      nickname: 'testuser1',
    },
    user2: {
      nickname: 'testuser2',
    },
    user3: {
      nickname: 'player_pro',
    },
  },
  assets: {
    triangle: {
      name: 'TRIANGLE' as const,
      description: 'Test triangle asset',
      type: 'TWO_D' as const,
    },
    circle: {
      name: 'CIRCLE' as const,
      description: 'Test circle asset',
      type: 'TWO_D' as const,
    },
    square: {
      name: 'SQUARE' as const,
      description: 'Test square asset',
      type: 'THREE_D' as const,
      durationSec: 30,
      nbUav: 5,
    },
  },
};
