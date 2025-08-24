import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../features/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getOneByUsername(dto.username);

    /** Check if user with certain email exists. */
    if (oldUser) throw new BadRequestException('User already exists');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.createPlain(dto);
  }
}
