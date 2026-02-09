import { Expose } from 'class-transformer';

export class ProjectCreatedResponseDto {
  @Expose()
  readonly projectId!: string;
}
