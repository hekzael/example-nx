import { Expose } from 'class-transformer';

export class RequestStatusResponseDto {
  @Expose()
  readonly status!: string;
}
