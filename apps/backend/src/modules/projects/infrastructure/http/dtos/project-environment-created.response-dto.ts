import { Expose } from 'class-transformer';

export class ProjectEnvironmentCreatedResponseDto {
  @Expose()
  readonly projectEnvironmentId!: string;
}
