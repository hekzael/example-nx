import { createHash, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { RefreshTokenPort } from '@identity/application/shared/port/refresh-token.port';
import { RefreshTokenOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/refresh-token.orm-entity';

export class TypeOrmRefreshTokenAdapter implements RefreshTokenPort {
  private static readonly TOKEN_BYTES = 32;
  private static readonly TTL_MS = 7 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly tokenRepository: Repository<RefreshTokenOrmEntity>,
  ) {}

  async create(userId: string): Promise<string> {
    const token = randomBytes(TypeOrmRefreshTokenAdapter.TOKEN_BYTES).toString(
      'base64url',
    );
    const tokenHash = TypeOrmRefreshTokenAdapter.hashToken(token);

    const entity = new RefreshTokenOrmEntity();
    entity.userId = userId;
    entity.tokenHash = tokenHash;
    entity.expiresAt = new Date(Date.now() + TypeOrmRefreshTokenAdapter.TTL_MS);
    entity.revokedAt = null;

    await this.tokenRepository.save(entity);
    return token;
  }

  async consume(token: string): Promise<string | null> {
    const tokenHash = TypeOrmRefreshTokenAdapter.hashToken(token);
    const now = new Date();

    const entity = await this.tokenRepository.findOne({
      where: { tokenHash },
    });

    if (!entity || entity.revokedAt || entity.expiresAt <= now) {
      return null;
    }

    entity.revokedAt = now;
    await this.tokenRepository.save(entity);
    return entity.userId;
  }

  async revoke(token: string): Promise<void> {
    const tokenHash = TypeOrmRefreshTokenAdapter.hashToken(token);
    const entity = await this.tokenRepository.findOne({
      where: { tokenHash },
    });
    if (!entity || entity.revokedAt) {
      return;
    }
    entity.revokedAt = new Date();
    await this.tokenRepository.save(entity);
  }

  private static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
