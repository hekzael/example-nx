import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddProjectEnvironmentHttpDto {
  @IsString()
  readonly code!: string;

  @IsString()
  readonly name!: string;

  @IsOptional()
  @IsString()
  readonly description?: string | null;

  @IsInt()
  @Min(0)
  readonly priority!: number;
}
