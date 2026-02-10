import { Expose } from 'class-transformer';

export class RequestCommentCreatedResponseDto {
  @Expose()
  readonly requestId!: string;
}
