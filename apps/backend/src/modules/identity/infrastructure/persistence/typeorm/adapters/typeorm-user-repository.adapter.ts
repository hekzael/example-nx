import { Repository } from 'typeorm';
import { User } from '@identity/domain/user/entity/user.entity';
import { DisplayName } from '@identity/domain/user/value-objects/display-name.vo';
import { Email } from '@identity/domain/user/value-objects/email.vo';
import { PasswordHash } from '@identity/domain/user/value-objects/password-hash.vo';
import { UserId } from '@identity/domain/user/value-objects/user-id.vo';
import { UserRepositoryPort } from '@identity/domain/user/repository/user-repository.port';
import { UserOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/user.orm-entity';

export class TypeOrmUserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly userRepository: Repository<UserOrmEntity>) {}

  async save(user: User): Promise<void> {
    const orm = this.toOrmEntity(user);
    await this.userRepository.save(orm);
  }

  async findById(userId: UserId): Promise<User | null> {
    const orm = await this.userRepository.findOne({
      where: { userId: userId.value },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const orm = await this.userRepository.findOne({
      where: { email: email.value },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email: email.value },
      take: 1,
    });
    return count > 0;
  }

  private toDomain(orm: UserOrmEntity): User {
    return User.rehydrate({
      userId: new UserId(orm.userId),
      email: new Email(orm.email),
      displayName: new DisplayName(orm.displayName),
      passwordHash: new PasswordHash(orm.passwordHash),
      isActive: orm.isActive,
      requirePasswordChange: orm.requirePasswordChange,
      emailVerifiedAt: orm.emailVerifiedAt,
    });
  }

  private toOrmEntity(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.userId = user.getUserId().value;
    orm.email = user.getEmail().value;
    orm.displayName = user.getDisplayName().value;
    orm.passwordHash = user.getPasswordHash().value;
    orm.isActive = user.isUserActive();
    orm.requirePasswordChange = user.isPasswordChangeRequired();
    orm.emailVerifiedAt = user.getEmailVerifiedAt();
    return orm;
  }
}
