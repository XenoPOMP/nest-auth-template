import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './routes/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import auth from './config/auth.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [auth] }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
