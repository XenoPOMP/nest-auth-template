import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../routes/auth/guards/jwt.guard';

export const Auth = () => UseGuards(JwtAuthGuard);
