import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordHttpDto {
  @IsString()
  readonly currentPassword!: string;

  @IsString()
  @MinLength(12)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  readonly newPassword!: string;
}
