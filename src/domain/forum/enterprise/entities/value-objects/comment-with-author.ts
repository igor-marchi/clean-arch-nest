import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface CommentWithAuthorProps {
  commentId: UniqueEntityID;
  commentContent: string;
  authorId: UniqueEntityID;
  authorName: string;
  commentCreatedAt: Date;
  commentUpdatedAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props);
  }

  get commentId() {
    return this.props.commentId;
  }

  get commentContent() {
    return this.props.commentContent;
  }

  get authorId() {
    return this.props.authorId;
  }

  get authorName() {
    return this.props.authorName;
  }

  get commentCreatedAt() {
    return this.props.commentCreatedAt;
  }

  get commentUpdatedAt() {
    return this.props.commentUpdatedAt;
  }
}
