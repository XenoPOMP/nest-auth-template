import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './routes/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './routes/user/user.module';
import auth from './config/auth.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [auth] }), AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
