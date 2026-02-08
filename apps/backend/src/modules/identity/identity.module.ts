import { Module } from '@nestjs/common';
import { AssignBaseRoleUseCase } from './application/assign-base-role/handler/assign-base-role.use-case';
import { ChangePasswordUseCase } from './application/change-password/handler/change-password.use-case';
import { CreateUserUseCase } from './application/create-user/handler/create-user.use-case';
import { EvaluateAccessUseCase } from './application/evaluate-access/handler/evaluate-access.use-case';
import { GrantPermissionUseCase } from './application/grant-permission/handler/grant-permission.use-case';
import { RequestPasswordResetUseCase } from './application/request-password-reset/handler/request-password-reset.use-case';
import { ResetPasswordUseCase } from './application/reset-password/handler/reset-password.use-case';
import { SelfChangePasswordUseCase } from './application/self-change-password/handler/self-change-password.use-case';
import { SelfServiceProfileUseCase } from './application/self-service-profile/handler/self-service-profile.use-case';
import { SelfUpdateProfileUseCase } from './application/self-update-profile/handler/self-update-profile.use-case';
import { VerifyEmailUseCase } from './application/verify-email/handler/verify-email.use-case';
import { DomainPasswordPolicyAdapter } from './application/shared/adapters/domain-password-policy.adapter';
import { EmailVerificationTokenPort } from './application/shared/ports/email-verification-token.port';
import { IdGeneratorPort } from './application/shared/ports/id-generator.port';
import { PasswordHashingPort } from './application/shared/ports/password-hashing.port';
import { PasswordPolicyPort } from './application/shared/ports/password-policy.port';
import { PasswordResetTokenPort } from './application/shared/ports/password-reset-token.port';
import { ToolAvailabilityPort } from './application/shared/ports/tool-availability.port';
import { PermissionRepositoryPort } from './domain/permission/repository/permission-repository.port';
import { RoleRepositoryPort } from './domain/role/repository/role-repository.port';
import { UserRepositoryPort } from './domain/user/repository/user-repository.port';
import { InMemoryPermissionRepositoryAdapter } from './infrastructure/persistence/in-memory/in-memory-permission-repository.adapter';
import { InMemoryRoleRepositoryAdapter } from './infrastructure/persistence/in-memory/in-memory-role-repository.adapter';
import { InMemoryUserRepositoryAdapter } from './infrastructure/persistence/in-memory/in-memory-user-repository.adapter';
import { InMemoryEmailVerificationTokenAdapter } from './infrastructure/security/in-memory/in-memory-email-verification-token.adapter';
import { InMemoryPasswordHashingAdapter } from './infrastructure/security/in-memory/in-memory-password-hashing.adapter';
import { InMemoryPasswordResetTokenAdapter } from './infrastructure/security/in-memory/in-memory-password-reset-token.adapter';
import { InMemoryToolAvailabilityAdapter } from './infrastructure/security/in-memory/in-memory-tool-availability.adapter';
import { InMemoryIdGeneratorAdapter } from './infrastructure/ids/in-memory/in-memory-id-generator.adapter';
import { IDENTITY_TOKENS } from './identity.tokens';

@Module({
  providers: [
    { provide: IDENTITY_TOKENS.USER_REPOSITORY, useClass: InMemoryUserRepositoryAdapter },
    { provide: IDENTITY_TOKENS.ROLE_REPOSITORY, useClass: InMemoryRoleRepositoryAdapter },
    { provide: IDENTITY_TOKENS.PERMISSION_REPOSITORY, useClass: InMemoryPermissionRepositoryAdapter },
    { provide: IDENTITY_TOKENS.ID_GENERATOR, useClass: InMemoryIdGeneratorAdapter },
    { provide: IDENTITY_TOKENS.PASSWORD_HASHING, useClass: InMemoryPasswordHashingAdapter },
    { provide: IDENTITY_TOKENS.PASSWORD_POLICY, useClass: DomainPasswordPolicyAdapter },
    { provide: IDENTITY_TOKENS.PASSWORD_RESET_TOKEN, useClass: InMemoryPasswordResetTokenAdapter },
    { provide: IDENTITY_TOKENS.EMAIL_VERIFICATION_TOKEN, useClass: InMemoryEmailVerificationTokenAdapter },
    { provide: IDENTITY_TOKENS.TOOL_AVAILABILITY, useClass: InMemoryToolAvailabilityAdapter },
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        idGenerator: IdGeneratorPort,
        passwordHashing: PasswordHashingPort,
        passwordPolicy: PasswordPolicyPort,
      ) =>
        new CreateUserUseCase(
          userRepository,
          idGenerator,
          passwordHashing,
          passwordPolicy,
        ),
      inject: [
        IDENTITY_TOKENS.USER_REPOSITORY,
        IDENTITY_TOKENS.ID_GENERATOR,
        IDENTITY_TOKENS.PASSWORD_HASHING,
        IDENTITY_TOKENS.PASSWORD_POLICY,
      ],
    },
    {
      provide: AssignBaseRoleUseCase,
      useFactory: (userRepository: UserRepositoryPort, roleRepository: RoleRepositoryPort) =>
        new AssignBaseRoleUseCase(userRepository, roleRepository),
      inject: [IDENTITY_TOKENS.USER_REPOSITORY, IDENTITY_TOKENS.ROLE_REPOSITORY],
    },
    {
      provide: GrantPermissionUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        roleRepository: RoleRepositoryPort,
        permissionRepository: PermissionRepositoryPort,
      ) => new GrantPermissionUseCase(userRepository, roleRepository, permissionRepository),
      inject: [
        IDENTITY_TOKENS.USER_REPOSITORY,
        IDENTITY_TOKENS.ROLE_REPOSITORY,
        IDENTITY_TOKENS.PERMISSION_REPOSITORY,
      ],
    },
    {
      provide: EvaluateAccessUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        roleRepository: RoleRepositoryPort,
        toolAvailability: ToolAvailabilityPort,
      ) => new EvaluateAccessUseCase(userRepository, roleRepository, toolAvailability),
      inject: [
        IDENTITY_TOKENS.USER_REPOSITORY,
        IDENTITY_TOKENS.ROLE_REPOSITORY,
        IDENTITY_TOKENS.TOOL_AVAILABILITY,
      ],
    },
    {
      provide: ChangePasswordUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordHashing: PasswordHashingPort,
        passwordPolicy: PasswordPolicyPort,
      ) => new ChangePasswordUseCase(userRepository, passwordHashing, passwordPolicy),
      inject: [
        IDENTITY_TOKENS.USER_REPOSITORY,
        IDENTITY_TOKENS.PASSWORD_HASHING,
        IDENTITY_TOKENS.PASSWORD_POLICY,
      ],
    },
    {
      provide: RequestPasswordResetUseCase,
      useFactory: (userRepository: UserRepositoryPort, passwordResetToken: PasswordResetTokenPort) =>
        new RequestPasswordResetUseCase(userRepository, passwordResetToken),
      inject: [IDENTITY_TOKENS.USER_REPOSITORY, IDENTITY_TOKENS.PASSWORD_RESET_TOKEN],
    },
    {
      provide: ResetPasswordUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordHashing: PasswordHashingPort,
        passwordPolicy: PasswordPolicyPort,
        passwordResetToken: PasswordResetTokenPort,
      ) =>
        new ResetPasswordUseCase(
          userRepository,
          passwordHashing,
          passwordPolicy,
          passwordResetToken,
        ),
      inject: [
        IDENTITY_TOKENS.USER_REPOSITORY,
        IDENTITY_TOKENS.PASSWORD_HASHING,
        IDENTITY_TOKENS.PASSWORD_POLICY,
        IDENTITY_TOKENS.PASSWORD_RESET_TOKEN,
      ],
    },
    {
      provide: VerifyEmailUseCase,
      useFactory: (userRepository: UserRepositoryPort, token: EmailVerificationTokenPort) =>
        new VerifyEmailUseCase(userRepository, token),
      inject: [IDENTITY_TOKENS.USER_REPOSITORY, IDENTITY_TOKENS.EMAIL_VERIFICATION_TOKEN],
    },
    {
      provide: SelfServiceProfileUseCase,
      useFactory: (userRepository: UserRepositoryPort) =>
        new SelfServiceProfileUseCase(userRepository),
      inject: [IDENTITY_TOKENS.USER_REPOSITORY],
    },
    {
      provide: SelfUpdateProfileUseCase,
      useFactory: (userRepository: UserRepositoryPort) =>
        new SelfUpdateProfileUseCase(userRepository),
      inject: [IDENTITY_TOKENS.USER_REPOSITORY],
    },
    {
      provide: SelfChangePasswordUseCase,
      useFactory: (changePassword: ChangePasswordUseCase) =>
        new SelfChangePasswordUseCase(changePassword),
      inject: [ChangePasswordUseCase],
    },
  ],
  exports: [
    CreateUserUseCase,
    AssignBaseRoleUseCase,
    GrantPermissionUseCase,
    EvaluateAccessUseCase,
    ChangePasswordUseCase,
    RequestPasswordResetUseCase,
    ResetPasswordUseCase,
    VerifyEmailUseCase,
    SelfServiceProfileUseCase,
    SelfUpdateProfileUseCase,
    SelfChangePasswordUseCase,
  ],
})
export class IdentityModule {}
