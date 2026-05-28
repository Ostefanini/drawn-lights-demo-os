import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaTestService } from '../../prisma-test.service.js';
import { cleanupTestApp, createTestApp, testData } from '../../test-helpers.js';

describe('CombinationsController (e2e)', () => {
  let app: INestApplication;
  let prismaTest: PrismaTestService;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    prismaTest = testApp.prismaTest;
  });

  beforeEach(async () => {
    await prismaTest.user.create({
      data: testData.users.user1,
    });
  });

  afterEach(async () => {
    await prismaTest.cleanDatabase();
  });

  afterAll(async () => {
    await cleanupTestApp(app, prismaTest);
  });

  describe('GET /combinations/is-found', () => {
    it('should validate required parameters', async () => {
      await request(app.getHttpServer())
        .get('/combinations/is-found')
        .query({
          assetOne: 'TRIANGLE',
          // sound is missing
        })
        .expect(400);
    });
  });

  describe('POST /combinations/attribute', () => {
    it('should validate user nickname length', async () => {
      await request(app.getHttpServer())
        .post('/combinations/attribute')
        .query({
          assetOne: 'TRIANGLE',
          sound: 'none',
        })
        .send({ userNickname: 'a' }) // Too short (min 2 chars)
        .expect(400);
    });

    it('should validate required fields', async () => {
      await request(app.getHttpServer())
        .post('/combinations/attribute')
        .query({
          assetOne: 'TRIANGLE',
          sound: 'none',
        })
        .send({}) // userNickname is missing
        .expect(400);
    });
  });
});
