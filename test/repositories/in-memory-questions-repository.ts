import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private inMemoryAttachmentsRepository: InMemoryAttachmentsRepository,
    private inMemoryStudentsRepository: InMemoryStudentsRepository,
  ) {}

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    const author = this.inMemoryStudentsRepository.items.find(
      (student) => student.id === question.authorId,
    );

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist`,
      );
    }

    const questionAttachments =
      this.inMemoryQuestionAttachmentsRepository.items.filter(
        (questionAttachment) =>
          questionAttachment.questionId.equals(question.id),
      );

    const attachments = questionAttachments.map((questionAttachments) => {
      const attachment = this.inMemoryAttachmentsRepository.items.find(
        (attachment) => attachment.id.equals(questionAttachments.attachmentId),
      );

      if (!attachment) {
        throw new Error(
          `Attachment with Id "${questionAttachments.attachmentId}" does not exist`,
        );
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      authorName: author.name,
      questionTitle: question.title,
      questionSlug: question.slug,
      questionContent: question.content,
      bestAnswerId: question.bestAnswerId,
      questionCreatedAt: question.createdAt,
      questionUpdatedAt: question.updatedAt,
      attachments,
    });
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async create(question: Question) {
    this.items.push(question);

    await this.inMemoryQuestionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    await this.inMemoryQuestionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    );

    await this.inMemoryQuestionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);

    this.inMemoryQuestionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }
}
