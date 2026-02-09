import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreateUserUseCase } from './application/create-user/handler/create-user.use-case';
import { ChangePasswordUseCase } from './application/change-password/handler/change-password.use-case';
import { VerifyEmailUseCase } from './application/verify-email/handler/verify-email.use-case';
import { RequestPasswordResetUseCase } from './application/request-password-reset/handler/request-password-reset.use-case';
import { ResetPasswordUseCase } from './application/reset-password/handler/reset-password.use-case';
import { EmailVerificationTokenPort } from './application/shared/port/email-verification-token.port';
import { PasswordHashingPort } from './application/shared/port/password-hashing.port';
import { PasswordResetTokenPort } from './application/shared/port/password-reset-token.port';
import { UserIdGeneratorPort } from './application/shared/port/user-id-generator.port';
import { UserRepositoryPort } from './domain/user/repository/user-repository.port';
import { TypeOrmEmailVerificationTokenAdapter } from './infrastructure/persistence/typeorm/adapters/typeorm-email-verification-token.adapter';
import { TypeOrmPasswordResetTokenAdapter } from './infrastructure/persistence/typeorm/adapters/typeorm-password-reset-token.adapter';
import { TypeOrmUserRepositoryAdapter } from './infrastructure/persistence/typeorm/adapters/typeorm-user-repository.adapter';
import { TypeOrmRefreshTokenAdapter } from './infrastructure/persistence/typeorm/adapters/typeorm-refresh-token.adapter';
import { EmailVerificationTokenOrmEntity } from './infrastructure/persistence/typeorm/entities/email-verification-token.orm-entity';
import { PasswordResetTokenOrmEntity } from './infrastructure/persistence/typeorm/entities/password-reset-token.orm-entity';
import { RefreshTokenOrmEntity } from './infrastructure/persistence/typeorm/entities/refresh-token.orm-entity';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { CryptoPasswordHashingAdapter } from './infrastructure/security/crypto/crypto-password-hashing.adapter';
import { CryptoUserIdGeneratorAdapter } from './infrastructure/ids/crypto/crypto-user-id-generator.adapter';
import { Repository } from 'typeorm';
import { AuthController } from './infrastructure/http/auth.controller';
import { UserController } from './infrastructure/http/user.controller';
import { JwtTokenSigningAdapter } from './infrastructure/security/jwt/jwt-token-signing.adapter';
import { LoginUseCase } from './application/login/handler/login.use-case';
import { RefreshSessionUseCase } from './application/refresh-session/handler/refresh-session.use-case';
import { LogoutUseCase } from './application/logout/handler/logout.use-case';
import { RefreshTokenPort } from './application/shared/port/refresh-token.port';
import { TokenSigningPort } from './application/shared/port/token-signing.port';

const USER_REPOSITORY_PORT = 'UserRepositoryPort';
const PASSWORD_HASHING_PORT = 'PasswordHashingPort';
const USER_ID_GENERATOR_PORT = 'UserIdGeneratorPort';
const EMAIL_VERIFICATION_TOKEN_PORT = 'EmailVerificationTokenPort';
const PASSWORD_RESET_TOKEN_PORT = 'PasswordResetTokenPort';
const REFRESH_TOKEN_PORT = 'RefreshTokenPort';
const TOKEN_SIGNING_PORT = 'TokenSigningPort';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      EmailVerificationTokenOrmEntity,
      PasswordResetTokenOrmEntity,
      RefreshTokenOrmEntity,
    ]),
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
      inject: [USER_REPOSITORY_PORT, PASSWORD_HASHING_PORT, USER_ID_GENERATOR_PORT],
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
      ) => new RequestPasswordResetUseCase(userRepository, passwordResetTokenPort),
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
