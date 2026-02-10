import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '../database/database.module';
import { IdentityModule } from '../modules/identity/identity.module';
import { ProjectsModule } from '../modules/projects/projects.module';
import { OperationsModule } from '../modules/operations/operations.module';
import { JwtAuthGuard } from '@identity/infrastructure/security/jwt/jwt-auth.guard';
import { RequirePasswordChangeGuard } from '@identity/infrastructure/security/jwt/require-password-change.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BootstrapService } from './bootstrap.service';

@Module({
  imports: [DatabaseModule, IdentityModule, ProjectsModule, OperationsModule],
  controllers: [AppController],
  providers: [
    AppService,
    BootstrapService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RequirePasswordChangeGuard,
    },
  ],
})
export class AppModule {}
