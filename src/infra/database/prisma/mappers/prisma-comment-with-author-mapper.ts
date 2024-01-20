import {
  Comment as PrismaComment,
  User as PrismaUser,
} from 'prisma/prisma-client';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser;
};

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.author.id),
      authorName: raw.author.name,
      commentContent: raw.content,
      commentCreatedAt: raw.createdAt,
      commentUpdatedAt: raw.updatedAt,
    });
  }
}
