import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class ApproveRequestHttpDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly comment?: string | null;

  @IsInt()
  @Min(1)
  readonly minApprovals!: number;
}
