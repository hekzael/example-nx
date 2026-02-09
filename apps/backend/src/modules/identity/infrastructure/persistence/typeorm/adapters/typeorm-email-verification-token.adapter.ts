import { createHash, randomBytes } from 'crypto';
import { MoreThan, Repository } from 'typeorm';
import { EmailVerificationTokenPort } from '../../../../application/shared/port/email-verification-token.port';
import { EmailVerificationTokenOrmEntity } from '../entities/email-verification-token.orm-entity';

export class TypeOrmEmailVerificationTokenAdapter
  implements EmailVerificationTokenPort
{
  private static readonly TOKEN_BYTES = 32;
  private static readonly TTL_MS = 24 * 60 * 60 * 1000;

  constructor(
    private readonly tokenRepository: Repository<EmailVerificationTokenOrmEntity>,
  ) {}

  async create(userId: string): Promise<string> {
    const token = randomBytes(
      TypeOrmEmailVerificationTokenAdapter.TOKEN_BYTES,
    ).toString('base64url');
    const tokenHash = TypeOrmEmailVerificationTokenAdapter.hashToken(token);

    const entity = new EmailVerificationTokenOrmEntity();
    entity.userId = userId;
    entity.tokenHash = tokenHash;
    entity.expiresAt = new Date(
      Date.now() + TypeOrmEmailVerificationTokenAdapter.TTL_MS,
    );

    await this.tokenRepository.save(entity);
    return token;
  }

  async consume(token: string): Promise<string | null> {
    const tokenHash = TypeOrmEmailVerificationTokenAdapter.hashToken(token);
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
      emailVerificationTokenId: entity.emailVerificationTokenId,
    });

    return entity.userId;
  }

  private static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
