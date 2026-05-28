import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { AppModule } from './../src/app.module.js';
import { PrismaTestService } from './prisma-test.service.js';
import { cleanupTestApp } from './test-helpers.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaTest: PrismaTestService;

  beforeAll(async () => {
    prismaTest = new PrismaTestService();
    await prismaTest.$connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaTest)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await cleanupTestApp(app, prismaTest);
  });

  it('should answer pong on ping (GET)', () => {
    return request(app.getHttpServer()).get('/ping').expect(200).expect('pong');
  });
});
