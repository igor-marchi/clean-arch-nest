import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';
import { Attachment } from '../../enterprise/entities/attachment';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { Uploader } from '../storage/uploader';

const FILE_TYPE_REGEX_VALIDATOR = /^(image\/(jpeg|png))$|^application\/pdf$/;

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!FILE_TYPE_REGEX_VALIDATOR.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentRepository.create(attachment);

    return right({ attachment });
  }
}
