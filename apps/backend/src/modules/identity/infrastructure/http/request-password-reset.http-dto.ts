import { IsEmail } from 'class-validator';

export class RequestPasswordResetHttpDto {
  @IsEmail()
  readonly email!: string;
}
