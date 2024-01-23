import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { Attachment } from '../attachment';
import { Slug } from './slug';

export interface QuestionDetailsProps {
  questionId: UniqueEntityID;
  questionTitle: string;
  questionSlug: Slug;
  questionContent: string;
  questionCreatedAt: Date;
  questionUpdatedAt?: Date | null;
  bestAnswerId?: UniqueEntityID | null;
  authorId: UniqueEntityID;
  authorName: string;
  attachments: Attachment[];
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props);
  }

  get questionId() {
    return this.props.questionId;
  }

  get questionTitle() {
    return this.props.questionTitle;
  }

  get questionSlug() {
    return this.props.questionSlug;
  }

  get questionContent() {
    return this.props.questionContent;
  }

  get questionCreatedAt() {
    return this.props.questionCreatedAt;
  }

  get questionUpdatedAt() {
    return this.props.questionUpdatedAt;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get authorName() {
    return this.props.authorName;
  }

  get attachments() {
    return this.props.attachments;
  }
}
