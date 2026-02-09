import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ChangePasswordUseCase } from '@identity/application/change-password/handler/change-password.use-case';
import { CreateUserUseCase } from '@identity/application/create-user/handler/create-user.use-case';
import { GetMyPermissionsUseCase } from '@identity/application/get-my-permissions/handler/get-my-permissions.use-case';
import { GetMyRolesUseCase } from '@identity/application/get-my-roles/handler/get-my-roles.use-case';
import { GetMyTeamsUseCase } from '@identity/application/get-my-teams/handler/get-my-teams.use-case';
import { GetUserUseCase } from '@identity/application/get-user/handler/get-user.use-case';
import { LoginUseCase } from '@identity/application/login/handler/login.use-case';
import { LogoutUseCase } from '@identity/application/logout/handler/logout.use-case';
import { RefreshSessionUseCase } from '@identity/application/refresh-session/handler/refresh-session.use-case';
import { RequestPasswordResetUseCase } from '@identity/application/request-password-reset/handler/request-password-reset.use-case';
import { ResetPasswordUseCase } from '@identity/application/reset-password/handler/reset-password.use-case';
import { CurrentUserReadPort } from '@identity/application/shared/port/current-user-read.port';
import { EmailVerificationTokenPort } from '@identity/application/shared/port/email-verification-token.port';
import { PasswordHashingPort } from '@identity/application/shared/port/password-hashing.port';
import { PasswordResetTokenPort } from '@identity/application/shared/port/password-reset-token.port';
import { RefreshTokenPort } from '@identity/application/shared/port/refresh-token.port';
import { TokenSigningPort } from '@identity/application/shared/port/token-signing.port';
import { UserIdGeneratorPort } from '@identity/application/shared/port/user-id-generator.port';
import { UpdateProfileUseCase } from '@identity/application/update-profile/handler/update-profile.use-case';
import { VerifyEmailUseCase } from '@identity/application/verify-email/handler/verify-email.use-case';
import { UserRepositoryPort } from '@identity/domain/user/repository/user-repository.port';
import { AuthController } from '@identity/infrastructure/http/auth.controller';
import { UserController } from '@identity/infrastructure/http/user.controller';
import { CryptoUserIdGeneratorAdapter } from '@identity/infrastructure/ids/crypto/crypto-user-id-generator.adapter';
import { TypeOrmCurrentUserReadAdapter } from '@identity/infrastructure/persistence/typeorm/adapters/typeorm-current-user-read.adapter';
import { TypeOrmEmailVerificationTokenAdapter } from '@identity/infrastructure/persistence/typeorm/adapters/typeorm-email-verification-token.adapter';
import { TypeOrmPasswordResetTokenAdapter } from '@identity/infrastructure/persistence/typeorm/adapters/typeorm-password-reset-token.adapter';
import { TypeOrmRefreshTokenAdapter } from '@identity/infrastructure/persistence/typeorm/adapters/typeorm-refresh-token.adapter';
import { TypeOrmUserRepositoryAdapter } from '@identity/infrastructure/persistence/typeorm/adapters/typeorm-user-repository.adapter';
import { EmailVerificationTokenOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/email-verification-token.orm-entity';
import { PasswordResetTokenOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/password-reset-token.orm-entity';
import { RefreshTokenOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/refresh-token.orm-entity';
import { UserOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { CryptoPasswordHashingAdapter } from '@identity/infrastructure/security/crypto/crypto-password-hashing.adapter';
import { JwtAuthGuard } from '@identity/infrastructure/security/jwt/jwt-auth.guard';
import { JwtTokenSigningAdapter } from '@identity/infrastructure/security/jwt/jwt-token-signing.adapter';
import { JwtStrategy } from '@identity/infrastructure/security/jwt/jwt.strategy';

const USER_REPOSITORY_PORT = 'UserRepositoryPort';
const PASSWORD_HASHING_PORT = 'PasswordHashingPort';
const USER_ID_GENERATOR_PORT = 'UserIdGeneratorPort';
const EMAIL_VERIFICATION_TOKEN_PORT = 'EmailVerificationTokenPort';
const PASSWORD_RESET_TOKEN_PORT = 'PasswordResetTokenPort';
const REFRESH_TOKEN_PORT = 'RefreshTokenPort';
const TOKEN_SIGNING_PORT = 'TokenSigningPort';
const CURRENT_USER_READ_PORT = 'CurrentUserReadPort';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      EmailVerificationTokenOrmEntity,
      PasswordResetTokenOrmEntity,
      RefreshTokenOrmEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useFactory: (repository: Repository<UserOrmEntity>) =>
        new TypeOrmUserRepositoryAdapter(repository),
      inject: [getRepositoryToken(UserOrmEntity)],
    },
    {
      provide: EMAIL_VERIFICATION_TOKEN_PORT,
      useFactory: (repository: Repository<EmailVerificationTokenOrmEntity>) =>
        new TypeOrmEmailVerificationTokenAdapter(repository),
      inject: [getRepositoryToken(EmailVerificationTokenOrmEntity)],
    },
    {
      provide: PASSWORD_RESET_TOKEN_PORT,
      useFactory: (repository: Repository<PasswordResetTokenOrmEntity>) =>
        new TypeOrmPasswordResetTokenAdapter(repository),
      inject: [getRepositoryToken(PasswordResetTokenOrmEntity)],
    },
    {
      provide: REFRESH_TOKEN_PORT,
      useFactory: (repository: Repository<RefreshTokenOrmEntity>) =>
        new TypeOrmRefreshTokenAdapter(repository),
      inject: [getRepositoryToken(RefreshTokenOrmEntity)],
    },
    {
      provide: PASSWORD_HASHING_PORT,
      useClass: CryptoPasswordHashingAdapter,
    },
    {
      provide: USER_ID_GENERATOR_PORT,
      useClass: CryptoUserIdGeneratorAdapter,
    },
    {
      provide: CURRENT_USER_READ_PORT,
      useFactory: (dataSource: DataSource) =>
        new TypeOrmCurrentUserReadAdapter(dataSource),
      inject: [DataSource],
    },
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: TOKEN_SIGNING_PORT,
      useFactory: (jwtService: JwtService) =>
        new JwtTokenSigningAdapter(jwtService),
      inject: [JwtService],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordHashingPort: PasswordHashingPort,
        userIdGeneratorPort: UserIdGeneratorPort,
      ) =>
        new CreateUserUseCase(
          userRepository,
          passwordHashingPort,
          userIdGeneratorPort,
        ),
      inject: [
        USER_REPOSITORY_PORT,
        PASSWORD_HASHING_PORT,
        USER_ID_GENERATOR_PORT,
      ],
    },
    {
      provide: ChangePasswordUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordHashingPort: PasswordHashingPort,
      ) => new ChangePasswordUseCase(userRepository, passwordHashingPort),
      inject: [USER_REPOSITORY_PORT, PASSWORD_HASHING_PORT],
    },
    {
      provide: VerifyEmailUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        emailVerificationTokenPort: EmailVerificationTokenPort,
      ) => new VerifyEmailUseCase(userRepository, emailVerificationTokenPort),
      inject: [USER_REPOSITORY_PORT, EMAIL_VERIFICATION_TOKEN_PORT],
    },
    {
      provide: RequestPasswordResetUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordResetTokenPort: PasswordResetTokenPort,
      ) =>
        new RequestPasswordResetUseCase(userRepository, passwordResetTokenPort),
      inject: [USER_REPOSITORY_PORT, PASSWORD_RESET_TOKEN_PORT],
    },
    {
      provide: ResetPasswordUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordResetTokenPort: PasswordResetTokenPort,
        passwordHashingPort: PasswordHashingPort,
      ) =>
        new ResetPasswordUseCase(
          userRepository,
          passwordResetTokenPort,
          passwordHashingPort,
        ),
      inject: [
        USER_REPOSITORY_PORT,
        PASSWORD_RESET_TOKEN_PORT,
        PASSWORD_HASHING_PORT,
      ],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordHashingPort: PasswordHashingPort,
        refreshTokenPort: RefreshTokenPort,
        tokenSigningPort: TokenSigningPort,
      ) =>
        new LoginUseCase(
          userRepository,
          passwordHashingPort,
          refreshTokenPort,
          tokenSigningPort,
        ),
      inject: [
        USER_REPOSITORY_PORT,
        PASSWORD_HASHING_PORT,
        REFRESH_TOKEN_PORT,
        TOKEN_SIGNING_PORT,
      ],
    },
    {
      provide: RefreshSessionUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        refreshTokenPort: RefreshTokenPort,
        tokenSigningPort: TokenSigningPort,
      ) =>
        new RefreshSessionUseCase(
          userRepository,
          refreshTokenPort,
          tokenSigningPort,
        ),
      inject: [USER_REPOSITORY_PORT, REFRESH_TOKEN_PORT, TOKEN_SIGNING_PORT],
    },
    {
      provide: LogoutUseCase,
      useFactory: (refreshTokenPort: RefreshTokenPort) =>
        new LogoutUseCase(refreshTokenPort),
      inject: [REFRESH_TOKEN_PORT],
    },
    {
      provide: GetUserUseCase,
      useFactory: (userRepository: UserRepositoryPort) =>
        new GetUserUseCase(userRepository),
      inject: [USER_REPOSITORY_PORT],
    },
    {
      provide: UpdateProfileUseCase,
      useFactory: (userRepository: UserRepositoryPort) =>
        new UpdateProfileUseCase(userRepository),
      inject: [USER_REPOSITORY_PORT],
    },
    {
      provide: GetMyRolesUseCase,
      useFactory: (currentUserReadPort: CurrentUserReadPort) =>
        new GetMyRolesUseCase(currentUserReadPort),
      inject: [CURRENT_USER_READ_PORT],
    },
    {
      provide: GetMyPermissionsUseCase,
      useFactory: (currentUserReadPort: CurrentUserReadPort) =>
        new GetMyPermissionsUseCase(currentUserReadPort),
      inject: [CURRENT_USER_READ_PORT],
    },
    {
      provide: GetMyTeamsUseCase,
      useFactory: (currentUserReadPort: CurrentUserReadPort) =>
        new GetMyTeamsUseCase(currentUserReadPort),
      inject: [CURRENT_USER_READ_PORT],
    },
  ],
  exports: [
    CreateUserUseCase,
    ChangePasswordUseCase,
    VerifyEmailUseCase,
    RequestPasswordResetUseCase,
    ResetPasswordUseCase,
  ],
})
export class IdentityModule {}
