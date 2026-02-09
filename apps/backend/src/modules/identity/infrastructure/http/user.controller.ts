import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/create-user/handler/create-user.use-case';
import { CreateUserCommand } from '../../application/create-user/command/create-user.command';
import { ChangePasswordUseCase } from '../../application/change-password/handler/change-password.use-case';
import { ChangePasswordCommand } from '../../application/change-password/command/change-password.command';
import { CreateUserHttpDto } from './create-user.http-dto';
import { ChangePasswordHttpDto } from './change-password.http-dto';

@Controller()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post('users')
  async createUser(@Body() body: CreateUserHttpDto): Promise<{ userId: string }> {
    const userId = await this.createUserUseCase.execute(
      new CreateUserCommand(body.email, body.displayName, body.password),
    );
    return { userId };
  }

  @Post('users/:userId/password')
  async changeUserPassword(
    @Param('userId') userId: string,
    @Body() body: ChangePasswordHttpDto,
  ): Promise<{ status: string }> {
    await this.changePasswordUseCase.execute(
      new ChangePasswordCommand(userId, body.currentPassword, body.newPassword),
    );
    return { status: 'ok' };
  }

}
