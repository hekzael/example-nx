import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserHttpDto {
  @IsEmail()
  readonly email!: string;

  @IsString()
  readonly displayName!: string;

  @IsString()
  @MinLength(12)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  readonly password!: string;
}
