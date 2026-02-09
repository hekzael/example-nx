import { Expose } from 'class-transformer';

export class AuthTokensResponseDto {
  @Expose()
  readonly userId!: string;

  @Expose()
  readonly accessToken!: string;

  @Expose()
  readonly refreshToken!: string;
}
