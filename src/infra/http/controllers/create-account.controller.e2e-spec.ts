import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /account', async () => {
    const email = 'johndoe@gmail.com';

    const response = await request(app.getHttpServer()).post('/account').send({
      name: 'John Doe',
      email,
      password: '123456',
    });

    expect(response.statusCode).toBe(201);

    const userOnDataBase = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    expect(userOnDataBase).toBeTruthy();
  });
});