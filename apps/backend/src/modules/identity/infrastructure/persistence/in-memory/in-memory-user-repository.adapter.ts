import { User } from '../../../domain/user/entity/user.entity';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';

export class InMemoryUserRepositoryAdapter implements UserRepositoryPort {
  private readonly users = new Map<string, User>();

  async findById(id: UserId): Promise<User | null> {
    return this.users.get(id.value) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email.equals(email)) {
        return user;
      }
    }

    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id.value, user);
  }
}
