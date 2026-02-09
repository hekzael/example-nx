import { IsString } from 'class-validator';

export class RefreshSessionHttpDto {
  @IsString()
  readonly refreshToken!: string;
}
