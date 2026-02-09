import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { IdentityModule } from '../modules/identity/identity.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, IdentityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
