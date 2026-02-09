import { Expose } from 'class-transformer';

export class TeamCreatedResponseDto {
  @Expose()
  readonly teamId!: string;
}
