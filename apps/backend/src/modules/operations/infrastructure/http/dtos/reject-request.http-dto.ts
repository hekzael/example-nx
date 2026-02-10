import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectRequestHttpDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly comment?: string | null;
}
