import { DisplayName } from '../value-objects/display-name.vo';
import { Email } from '../value-objects/email.vo';
import { PasswordHash } from '../value-objects/password-hash.vo';
import { UserId } from '../value-objects/user-id.vo';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserEmailVerifiedEvent } from '../events/user-email-verified.event';
import { UserPasswordChangedEvent } from '../events/user-password-changed.event';
import { UserDeactivatedEvent } from '../events/user-deactivated.event';

export class User {
  private readonly domainEvents: Array<
    | UserCreatedEvent
    | UserEmailVerifiedEvent
    | UserPasswordChangedEvent
    | UserDeactivatedEvent
  > = [];

  private constructor(
    private readonly userId: UserId,
    private email: Email,
    private displayName: DisplayName,
    private passwordHash: PasswordHash,
    private isActive: boolean,
    private emailVerifiedAt: Date | null,
  ) {}

  static createNew(params: {
    userId: UserId;
    email: Email;
    displayName: DisplayName;
    passwordHash: PasswordHash;
    now?: Date;
  }): User {
    const now = params.now ?? new Date();
    const user = new User(
      params.userId,
      params.email,
      params.displayName,
      params.passwordHash,
      true,
      null,
    );
    user.domainEvents.push(
      new UserCreatedEvent(params.userId.value, params.email.value, now),
    );
    return user;
  }

  static rehydrate(params: {
    userId: UserId;
    email: Email;
    displayName: DisplayName;
    passwordHash: PasswordHash;
    isActive: boolean;
    emailVerifiedAt: Date | null;
  }): User {
    return new User(
      params.userId,
      params.email,
      params.displayName,
      params.passwordHash,
      params.isActive,
      params.emailVerifiedAt,
    );
  }

  changePassword(params: { passwordHash: PasswordHash; now?: Date }): void {
    const now = params.now ?? new Date();
    this.passwordHash = params.passwordHash;
    this.domainEvents.push(new UserPasswordChangedEvent(this.userId.value, now));
  }

  verifyEmail(params?: { now?: Date }): void {
    if (this.emailVerifiedAt) {
      return;
    }
    const now = params?.now ?? new Date();
    this.emailVerifiedAt = now;
    this.domainEvents.push(new UserEmailVerifiedEvent(this.userId.value, now));
  }

  deactivate(params?: { now?: Date }): void {
    if (!this.isActive) {
      return;
    }
    const now = params?.now ?? new Date();
    this.isActive = false;
    this.domainEvents.push(new UserDeactivatedEvent(this.userId.value, now));
  }

  pullDomainEvents(): Array<
    | UserCreatedEvent
    | UserEmailVerifiedEvent
    | UserPasswordChangedEvent
    | UserDeactivatedEvent
  > {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getEmail(): Email {
    return this.email;
  }

  getDisplayName(): DisplayName {
    return this.displayName;
  }

  getPasswordHash(): PasswordHash {
    return this.passwordHash;
  }

  isUserActive(): boolean {
    return this.isActive;
  }

  getEmailVerifiedAt(): Date | null {
    return this.emailVerifiedAt;
  }
}
