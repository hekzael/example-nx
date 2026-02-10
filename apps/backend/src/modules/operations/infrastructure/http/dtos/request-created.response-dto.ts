import { Expose } from 'class-transformer';

export class RequestCreatedResponseDto {
  @Expose()
  readonly requestId!: string;
}
