import { Expose } from 'class-transformer';

export class ProjectModuleCreatedResponseDto {
  @Expose()
  readonly projectModuleId!: string;
}
