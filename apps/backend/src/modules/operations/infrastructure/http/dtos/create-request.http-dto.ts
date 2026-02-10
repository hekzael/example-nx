import {
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateRequestHttpDto {
  @IsUUID()
  readonly environmentId!: string;

  @IsOptional()
  @IsUUID()
  readonly moduleId?: string | null;

  @IsUUID()
  readonly toolId!: string;

  @IsString()
  @Length(3, 120)
  readonly title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly description?: string | null;

  @IsString()
  @IsUrl()
  @MaxLength(200)
  readonly urlTicket!: string;

  @IsDefined()
  readonly payload!: unknown;
}
