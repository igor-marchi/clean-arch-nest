import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { AttachmentPresenter } from './attachment-presenter';

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      authorId: questionDetails.authorId.toString(),
      authorName: questionDetails.authorName,
      questionId: questionDetails.questionId.toString(),
      questionTitle: questionDetails.questionTitle,
      questionSlug: questionDetails.questionSlug,
      questionContent: questionDetails.questionContent,
      questionCreatedAt: questionDetails.questionCreatedAt,
      questionUpdatedAt: questionDetails.questionUpdatedAt,
      bestAnswerId: questionDetails.bestAnswerId,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
    };
  }
}
