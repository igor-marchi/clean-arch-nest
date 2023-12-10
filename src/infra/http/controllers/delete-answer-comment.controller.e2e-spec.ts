import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Delete answer comment (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let answerCommentFactory: AnswerCommentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[DELETE] /answer/comment/:id', async () => {
    const user = await studentFactory.makePersistenceStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePersistenceQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePersistenceAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerComment =
      await answerCommentFactory.makePersistenceAnswerComment({
        authorId: user.id,
        answerId: answer.id,
      });

    const answerCommentId = answerComment.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/answer/comment/${answerCommentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const commentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    });

    expect(commentOnDatabase).toBeNull();
  });
});
