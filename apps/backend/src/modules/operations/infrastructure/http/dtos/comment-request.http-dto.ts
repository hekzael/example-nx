import { IsString, MaxLength } from 'class-validator';

export class CommentRequestHttpDto {
  @IsString()
  @MaxLength(500)
  readonly body!: string;
}
