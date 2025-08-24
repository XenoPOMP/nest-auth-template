import { Module } from '@nestjs/common';
import {
  LocalAuthModule,
  JwtGuard,
  AuthConfig,
  LocalGuard,
} from '@sclable/nestjs-auth';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../features/prisma.service';

@Module({
  imports: [
    LocalAuthModule.forRootAsync({
      imports: [UserModule],
      inject: [ConfigService, UserService],
      useFactory: (config: ConfigService, userService: UserService) => ({
        config: config.get<AuthConfig>('auth', {}),
        userService,
      }),
    }),
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    LocalGuard,
    AuthService,
    PrismaService,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
