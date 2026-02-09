import { User } from '../../../domain/user/entity/user.entity';
import { UserAlreadyExistsException } from '../../../domain/user/errors/user-already-exists.exception';
import { DisplayName } from '../../../domain/user/value-objects/display-name.vo';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { PasswordHash } from '../../../domain/user/value-objects/password-hash.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { CreateUserCommand } from '../command/create-user.command';
import { CreateUserPort } from '../port/create-user.port';
import { PasswordPolicyService } from '../../shared/password-policy/password-policy.service';
import { PasswordHashingPort } from '../../shared/port/password-hashing.port';
import { UserIdGeneratorPort } from '../../shared/port/user-id-generator.port';

export class CreateUserUseCase implements CreateUserPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHashingPort: PasswordHashingPort,
    private readonly userIdGeneratorPort: UserIdGeneratorPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const email = new Email(command.email);
    const displayName = new DisplayName(command.displayName);
    PasswordPolicyService.validate(command.password);

    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      throw new UserAlreadyExistsException();
    }

    const userId = new UserId(this.userIdGeneratorPort.generate());
    const hash = await this.passwordHashingPort.hash(command.password);
    const passwordHash = new PasswordHash(hash);

    const user = User.createNew({
      userId,
      email,
      displayName,
      passwordHash,
    });

    await this.userRepository.save(user);
    return userId.value;
  }
}
