import { IsOptional, IsString } from 'class-validator';

export class CreateTeamHttpDto {
  @IsString()
  readonly projectId!: string;

  @IsString()
  readonly name!: string;

  @IsOptional()
  @IsString()
  readonly description?: string | null;
}
