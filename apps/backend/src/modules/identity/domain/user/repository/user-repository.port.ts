import { User } from '@identity/domain/user/entity/user.entity';
import { Email } from '@identity/domain/user/value-objects/email.vo';
import { UserId } from '@identity/domain/user/value-objects/user-id.vo';

export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  findById(userId: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
}
