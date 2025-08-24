import { Body, Controller, HttpStatus } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Endpoint } from '../../decorators/endpoint.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Endpoint('POST', 'register', {
    authRequired: false,
    httpCode: HttpStatus.CREATED,
  })
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }
}
