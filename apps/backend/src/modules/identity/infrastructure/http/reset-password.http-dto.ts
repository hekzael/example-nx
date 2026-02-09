import { IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordHttpDto {
  @IsString()
  readonly token!: string;

  @IsString()
  @MinLength(12)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  readonly newPassword!: string;
}
