import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AppModule } from '@/infra/app.module';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments';
import { StudentFactory } from 'test/factories/make-student';

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let cacheRepository: CacheRepository;
  let questionRepository: QuestionsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    questionRepository = moduleRef.get(QuestionsRepository);

    await app.init();
  });

  it('should cache question details', async () => {
    const user = await studentFactory.makePersistenceStudent();
    const question = await questionFactory.makePersistenceQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePersistenceAttachment({
      title: 'Some attachment',
    });

    await questionAttachmentFactory.makePersistenceQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;
    const questionDetails = await questionRepository.findDetailsBySlug(slug);
    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toEqual(JSON.stringify(questionDetails));
  });

  it('should return question details on subsequent calls', async () => {
    const user = await studentFactory.makePersistenceStudent();
    const question = await questionFactory.makePersistenceQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePersistenceAttachment({
      title: 'Some attachment',
    });

    await questionAttachmentFactory.makePersistenceQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    const questionDetails = await questionRepository.findDetailsBySlug(slug);

    expect(questionDetails).toEqual({ empty: true });
  });

  it('should reset question details cache when save the question', async () => {
    const user = await studentFactory.makePersistenceStudent();
    const question = await questionFactory.makePersistenceQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePersistenceAttachment({
      title: 'Some attachment',
    });

    await questionAttachmentFactory.makePersistenceQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    await questionRepository.save(question);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();
  });
});
