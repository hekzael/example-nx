import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '../database/database.module';
import { IdentityModule } from '../modules/identity/identity.module';
import { ProjectsModule } from '../modules/projects/projects.module';
import { JwtAuthGuard } from '@identity/infrastructure/security/jwt/jwt-auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, IdentityModule, ProjectsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
