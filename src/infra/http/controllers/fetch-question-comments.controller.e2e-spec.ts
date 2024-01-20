import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch question comments (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /question/:questionId/comment', async () => {
    const user = await studentFactory.makePersistenceStudent({
      name: 'John Doe',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePersistenceQuestion({
      authorId: user.id,
      title: 'Question-01',
    });

    await Promise.all([
      await questionCommentFactory.makePersistenceQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Comment 01',
      }),
      await questionCommentFactory.makePersistenceQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Comment 02',
      }),
    ]);

    const questionId = question.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/question/${questionId}/comment`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          commentContent: 'Comment 01',
          authorName: 'John Doe',
        }),
        expect.objectContaining({
          commentContent: 'Comment 02',
          authorName: 'John Doe',
        }),
      ]),
    });
  });
});
