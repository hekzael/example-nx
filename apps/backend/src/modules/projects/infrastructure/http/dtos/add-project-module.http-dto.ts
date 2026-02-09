import { IsOptional, IsString } from 'class-validator';

export class AddProjectModuleHttpDto {
  @IsString()
  readonly code!: string;

  @IsString()
  readonly name!: string;

  @IsOptional()
  @IsString()
  readonly description?: string | null;
}
