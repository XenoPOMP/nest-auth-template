import { Module } from '@nestjs/common';
import {
  LocalAuthModule,
  JwtGuard,
  AuthConfig,
  LocalGuard,
} from '@sclable/nestjs-auth';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    LocalGuard,
  ],
})
export class AuthModule {}
