import { IsString } from 'class-validator';

export class VerifyEmailHttpDto {
  @IsString()
  readonly token!: string;
}
