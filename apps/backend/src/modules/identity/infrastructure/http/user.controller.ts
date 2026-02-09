import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserUseCase } from '@identity/application/create-user/handler/create-user.use-case';
import { CreateUserCommand } from '@identity/application/create-user/command/create-user.command';
import { ChangePasswordUseCase } from '@identity/application/change-password/handler/change-password.use-case';
import { ChangePasswordCommand } from '@identity/application/change-password/command/change-password.command';
import { GetUserUseCase } from '@identity/application/get-user/handler/get-user.use-case';
import { GetUserQuery } from '@identity/application/get-user/command/get-user.query';
import { UpdateProfileUseCase } from '@identity/application/update-profile/handler/update-profile.use-case';
import { UpdateProfileCommand } from '@identity/application/update-profile/command/update-profile.command';
import { GetMyRolesUseCase } from '@identity/application/get-my-roles/handler/get-my-roles.use-case';
import { GetMyRolesQuery } from '@identity/application/get-my-roles/command/get-my-roles.query';
import { GetMyPermissionsUseCase } from '@identity/application/get-my-permissions/handler/get-my-permissions.use-case';
import { GetMyPermissionsQuery } from '@identity/application/get-my-permissions/command/get-my-permissions.query';
import { GetMyTeamsUseCase } from '@identity/application/get-my-teams/handler/get-my-teams.use-case';
import { GetMyTeamsQuery } from '@identity/application/get-my-teams/command/get-my-teams.query';
import { CreateUserHttpDto } from '@identity/infrastructure/http/dtos/create-user.http-dto';
import { ChangePasswordHttpDto } from '@identity/infrastructure/http/dtos/change-password.http-dto';
import { UpdateProfileHttpDto } from '@identity/infrastructure/http/dtos/update-profile.http-dto';
import { JwtAuthGuard } from '@identity/infrastructure/security/jwt/jwt-auth.guard';
import { CurrentUserId } from '@identity/infrastructure/http/current-user-id.decorator';
import { PaginationHttpDto } from '@identity/infrastructure/http/dtos/pagination.http-dto';
import { UserResponseDto } from '@identity/infrastructure/http/dtos/user.response-dto';
import { MyRolesResponseDto } from '@identity/infrastructure/http/dtos/my-roles.response-dto';
import { MyPermissionsResponseDto } from '@identity/infrastructure/http/dtos/my-permissions.response-dto';
import { MyTeamsResponseDto } from '@identity/infrastructure/http/dtos/my-teams.response-dto';

@Controller()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly getMyRolesUseCase: GetMyRolesUseCase,
    private readonly getMyPermissionsUseCase: GetMyPermissionsUseCase,
    private readonly getMyTeamsUseCase: GetMyTeamsUseCase,
  ) {}

  @Post('users')
  async createUser(@Body() body: CreateUserHttpDto): Promise<{ userId: string }> {
    const userId = await this.createUserUseCase.execute(
      new CreateUserCommand(body.email, body.displayName, body.password),
    );
    return { userId };
  }

  @Post('users/:userId/password')
  @HttpCode(204)
  async changeUserPassword(
    @Param('userId') userId: string,
    @Body() body: ChangePasswordHttpDto,
  ): Promise<void> {
    await this.changePasswordUseCase.execute(
      new ChangePasswordCommand(userId, body.currentPassword, body.newPassword),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUserId() userId: string): Promise<UserResponseDto> {
    const result = await this.getUserUseCase.execute(new GetUserQuery(userId));
    return plainToInstance(UserResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @HttpCode(204)
  async updateMe(
    @CurrentUserId() userId: string,
    @Body() body: UpdateProfileHttpDto,
  ): Promise<void> {
    await this.updateProfileUseCase.execute(
      new UpdateProfileCommand(userId, body.displayName),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/password')
  @HttpCode(204)
  async changeMyPassword(
    @CurrentUserId() userId: string,
    @Body() body: ChangePasswordHttpDto,
  ): Promise<void> {
    await this.changePasswordUseCase.execute(
      new ChangePasswordCommand(userId, body.currentPassword, body.newPassword),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/roles')
  async getMyRoles(
    @CurrentUserId() userId: string,
    @Query() query: PaginationHttpDto,
  ): Promise<MyRolesResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const result = await this.getMyRolesUseCase.execute(
      new GetMyRolesQuery(userId, page, pageSize),
    );
    return plainToInstance(MyRolesResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/permissions')
  async getMyPermissions(
    @CurrentUserId() userId: string,
    @Query() query: PaginationHttpDto,
  ): Promise<MyPermissionsResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const result = await this.getMyPermissionsUseCase.execute(
      new GetMyPermissionsQuery(userId, page, pageSize),
    );
    return plainToInstance(MyPermissionsResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/teams')
  async getMyTeams(
    @CurrentUserId() userId: string,
    @Query() query: PaginationHttpDto,
  ): Promise<MyTeamsResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const result = await this.getMyTeamsUseCase.execute(
      new GetMyTeamsQuery(userId, page, pageSize),
    );
    return plainToInstance(MyTeamsResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

}
