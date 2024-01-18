import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments';
import { StudentFactory } from 'test/factories/make-student';

describe('Edit question (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /question/:id', async () => {
    const user = await studentFactory.makePersistenceStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePersistenceQuestion({
      authorId: user.id,
    });

    const [attachment1, attachment2] = await Promise.all([
      attachmentFactory.makePersistenceAttachment(),
      attachmentFactory.makePersistenceAttachment(),
    ]);

    await questionAttachmentFactory.makePersistenceQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    });

    const attachment3 = await attachmentFactory.makePersistenceAttachment();

    const questionId = question.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/question/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New title',
        content: 'New question content',
        attachments: [attachment2.id.toString(), attachment3.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New title',
        content: 'New question content',
      },
    });

    expect(questionOnDatabase).toBeTruthy();
    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment2.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    );
  });
});
