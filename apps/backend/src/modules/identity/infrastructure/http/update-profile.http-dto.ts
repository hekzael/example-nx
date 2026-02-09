import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileHttpDto {
  @IsOptional()
  @IsString()
  readonly displayName?: string;
}
