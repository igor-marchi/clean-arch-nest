import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      commentContent: commentWithAuthor.commentContent,
      commentCreatedAt: commentWithAuthor.commentCreatedAt,
      commentUpdatedAt: commentWithAuthor.commentUpdatedAt,
      authorId: commentWithAuthor.authorId.toString(),
      authorName: commentWithAuthor.authorName,
    };
  }
}
