import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RequestPasswordResetUseCase } from '@identity/application/request-password-reset/handler/request-password-reset.use-case';
import { RequestPasswordResetCommand } from '@identity/application/request-password-reset/command/request-password-reset.command';
import { ResetPasswordUseCase } from '@identity/application/reset-password/handler/reset-password.use-case';
import { ResetPasswordCommand } from '@identity/application/reset-password/command/reset-password.command';
import { VerifyEmailUseCase } from '@identity/application/verify-email/handler/verify-email.use-case';
import { VerifyEmailCommand } from '@identity/application/verify-email/command/verify-email.command';
import { LoginUseCase } from '@identity/application/login/handler/login.use-case';
import { LoginCommand } from '@identity/application/login/command/login.command';
import { RefreshSessionUseCase } from '@identity/application/refresh-session/handler/refresh-session.use-case';
import { RefreshSessionCommand } from '@identity/application/refresh-session/command/refresh-session.command';
import { LogoutUseCase } from '@identity/application/logout/handler/logout.use-case';
import { LogoutCommand } from '@identity/application/logout/command/logout.command';
import { RequestPasswordResetHttpDto } from '@identity/infrastructure/http/dtos/request-password-reset.http-dto';
import { ResetPasswordHttpDto } from '@identity/infrastructure/http/dtos/reset-password.http-dto';
import { VerifyEmailHttpDto } from '@identity/infrastructure/http/dtos/verify-email.http-dto';
import { LoginHttpDto } from '@identity/infrastructure/http/dtos/login.http-dto';
import { RefreshSessionHttpDto } from '@identity/infrastructure/http/dtos/refresh-session.http-dto';
import { LogoutHttpDto } from '@identity/infrastructure/http/dtos/logout.http-dto';
import { AuthTokensResponseDto } from '@identity/infrastructure/http/dtos/auth-tokens.response-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Post('login')
  async login(
    @Body() body: LoginHttpDto,
  ): Promise<AuthTokensResponseDto> {
    const result = await this.loginUseCase.execute(
      new LoginCommand(body.email, body.password),
    );
    return plainToInstance(AuthTokensResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post('refresh')
  async refresh(
    @Body() body: RefreshSessionHttpDto,
  ): Promise<AuthTokensResponseDto> {
    const result = await this.refreshSessionUseCase.execute(
      new RefreshSessionCommand(body.refreshToken),
    );
    return plainToInstance(AuthTokensResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Body() body: LogoutHttpDto): Promise<void> {
    await this.logoutUseCase.execute(new LogoutCommand(body.refreshToken));
  }

  @Post('forgot-password')
  @HttpCode(204)
  async requestPasswordReset(
    @Body() body: RequestPasswordResetHttpDto,
  ): Promise<void> {
    await this.requestPasswordResetUseCase.execute(
      new RequestPasswordResetCommand(body.email),
    );
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordHttpDto,
  ): Promise<{ userId: string }> {
    const userId = await this.resetPasswordUseCase.execute(
      new ResetPasswordCommand(body.token, body.newPassword),
    );
    return { userId };
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() body: VerifyEmailHttpDto,
  ): Promise<{ userId: string }> {
    const userId = await this.verifyEmailUseCase.execute(
      new VerifyEmailCommand(body.token),
    );
    return { userId };
  }
}
