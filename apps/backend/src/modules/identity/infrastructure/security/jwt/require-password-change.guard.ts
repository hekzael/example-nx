import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { UserOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@shared/http/public.decorator';

const PASSWORD_CHANGE_ALLOWED = new Set([
  '/api/me',
  '/api/me/password',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
]);

@Injectable()
export class RequirePasswordChangeGuard extends AuthGuard('jwt') {
  constructor(
    private readonly dataSource: DataSource,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  override async canActivate(
    context: import('@nestjs/common').ExecutionContext,
  ) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId as string | undefined;
    if (!userId) {
      return false;
    }

    const routeKey = `${request.baseUrl}${request.path}`;
    if (PASSWORD_CHANGE_ALLOWED.has(routeKey)) {
      return true;
    }

    const userRepo = this.dataSource.getRepository(UserOrmEntity);
    const user = await userRepo.findOne({ where: { userId } });
    if (!user) {
      return false;
    }

    if (user.requirePasswordChange) {
      throw new ForbiddenException('Password change required');
    }

    return true;
  }
}
