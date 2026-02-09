import { JwtService } from '@nestjs/jwt';
import { TokenSigningPort } from '@identity/application/shared/port/token-signing.port';

export class JwtTokenSigningAdapter implements TokenSigningPort {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: process.env.JWT_ACCESS_TTL || '15m',
      },
    );
  }
}
