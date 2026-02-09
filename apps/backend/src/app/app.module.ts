import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../main/database/database.module';
import { IdentityTypeormModule } from '../modules/identity/identity-typeorm.module';

@Module({
  imports: [
    DatabaseModule,
    IdentityTypeormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
