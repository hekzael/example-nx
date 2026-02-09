import { IsString } from 'class-validator';

export class LogoutHttpDto {
  @IsString()
  readonly refreshToken!: string;
}
