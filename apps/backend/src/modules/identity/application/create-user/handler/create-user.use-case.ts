import { User } from '../../../domain/user/entity/user.entity';
import { DomainException } from '../../../domain/shared/domain.exception';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { PasswordHash } from '../../../domain/user/value-objects/password-hash.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { CreateUserCommand } from '../command/create-user.command';
import { IdGeneratorPort } from '../../shared/ports/id-generator.port';
import { PasswordHashingPort } from '../../shared/ports/password-hashing.port';
import { PasswordPolicyPort } from '../../shared/ports/password-policy.port';

export interface CreateUserResult {
  userId: string;
  user: User;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly passwordHashing: PasswordHashingPort,
    private readonly passwordPolicy: PasswordPolicyPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    const email = Email.create(command.email);
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new DomainException('EMAIL_ALREADY_EXISTS', 'Email ya registrado.');
    }

    this.passwordPolicy.validate(command.password);
    const passwordHashValue = await this.passwordHashing.hash(command.password);

    const user = User.create({
      id: UserId.create(this.idGenerator.nextId()),
      email,
      passwordHash: PasswordHash.create(passwordHashValue),
      displayName: command.name,
    });

    await this.userRepository.save(user);

    return {
      userId: user.id.value,
      user,
    };
  }
}
