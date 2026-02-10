import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class ExecuteRequestHttpDto {
  @IsIn(['SUCCESS', 'FAILED'])
  readonly status!: 'SUCCESS' | 'FAILED';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly outputRef?: string | null;
}
