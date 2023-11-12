import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /question', async () => {
    const user = await studentFactory.makePersistenceStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      await questionFactory.makePersistenceQuestion({
        authorId: user.id,
        title: 'Question-01',
      }),
      await questionFactory.makePersistenceQuestion({
        authorId: user.id,
        title: 'Question-02',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/question')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: 'Question-01' }),
        expect.objectContaining({ title: 'Question-02' }),
      ]),
    });
  });
});
