import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { IdentityModule } from '../modules/identity/identity.module';
import { ProjectsModule } from '../modules/projects/projects.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, IdentityModule, ProjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
