import { createHash, randomBytes } from 'crypto';
import { MoreThan, Repository } from 'typeorm';
import { PasswordResetTokenPort } from '../../../../application/shared/port/password-reset-token.port';
import { PasswordResetTokenOrmEntity } from '../entities/password-reset-token.orm-entity';

export class TypeOrmPasswordResetTokenAdapter
  implements PasswordResetTokenPort
{
  private static readonly TOKEN_BYTES = 32;
  private static readonly TTL_MS = 30 * 60 * 1000;

  constructor(
    private readonly tokenRepository: Repository<PasswordResetTokenOrmEntity>,
  ) {}

  async create(userId: string): Promise<string> {
    const token = randomBytes(
      TypeOrmPasswordResetTokenAdapter.TOKEN_BYTES,
    ).toString('base64url');
    const tokenHash = TypeOrmPasswordResetTokenAdapter.hashToken(token);

    const entity = new PasswordResetTokenOrmEntity();
    entity.userId = userId;
    entity.tokenHash = tokenHash;
    entity.expiresAt = new Date(
      Date.now() + TypeOrmPasswordResetTokenAdapter.TTL_MS,
    );

    await this.tokenRepository.save(entity);
    return token;
  }

  async consume(token: string): Promise<string | null> {
    const tokenHash = TypeOrmPasswordResetTokenAdapter.hashToken(token);
    const now = new Date();

    const entity = await this.tokenRepository.findOne({
      where: {
        tokenHash,
        expiresAt: MoreThan(now),
      },
    });

    if (!entity) {
      return null;
    }

    await this.tokenRepository.delete({
      passwordResetTokenId: entity.passwordResetTokenId,
    });

    return entity.userId;
  }

  private static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
