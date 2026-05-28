import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaTestService } from '../../prisma-test.service.js';
import { cleanupTestApp, createTestApp } from '../../test-helpers.js';

describe('AssetsController (e2e)', () => {
  let app: INestApplication;
  let prismaTest: PrismaTestService;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    prismaTest = testApp.prismaTest;
  });

  afterEach(async () => {
    await prismaTest.cleanDatabase();
  });

  afterAll(async () => {
    await cleanupTestApp(app, prismaTest);
  });

  describe('GET /assets', () => {
    it('should return empty array when no assets exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/assets')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /assets/thumbnail/:id', () => {
    it('should return 400 for invalid UUID format', async () => {
      await request(app.getHttpServer())
        .get('/assets/thumbnail/not-a-uuid')
        .expect(400);
    });
  });
});
