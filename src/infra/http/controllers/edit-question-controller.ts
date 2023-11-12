import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

@Controller('/question/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { content, title } = body;
    const { sub: userId } = user;

    const result = await this.editQuestion.execute({
      questionId,
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
