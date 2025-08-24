import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AuthProviderUserContract,
  UserServiceContract,
} from '@sclable/nestjs-auth';
import { UserContract } from '../../contracts/user.contract';
import { UserID } from '@sclable/nestjs-auth/dist/src/types';
import { PrismaService } from '../../features/prisma.service';
import { User } from '@prisma/client';
import passwordGenerator from 'generate-password';
import { hash, verify } from 'argon2';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService implements UserServiceContract<UserContract> {
  constructor(private readonly prisma: PrismaService) {}

  private stringToUndefineable(value: string | null): string | undefined {
    if (value === null) {
      return undefined;
    }
    return value;
  }

  /**
   * Converts Prisma`s user to UserContract.
   * @param user    fetched user from DB
   */
  followContract(user: User | null): UserContract | null {
    // Return null if user is null
    if (user === null) {
      return null;
    }

    // Get raw properties
    const { name, id, externalId, username, email, password } = user;
    // Convert raw properties to library types
    return {
      name,
      id,
      externalId: this.stringToUndefineable(externalId),
      username: this.stringToUndefineable(username),
      email: this.stringToUndefineable(email),
      password,
    };
  }

  async getOneById(userId: UserID): Promise<UserContract | null> {
    const id: string = userId.toString();
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return this.followContract(user);
  }

  async getOneByExternalId(externalId: UserID): Promise<UserContract | null> {
    const id: string = externalId.toString();
    const user = await this.prisma.user.findUnique({
      where: {
        externalId: id,
      },
    });
    return this.followContract(user);
  }

  async getOneByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<UserContract | null> {
    const oneByUsername = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!oneByUsername) throw new UnauthorizedException('User not found');

    /** True if password from dto is valid. */
    const isValid = await verify(oneByUsername.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid password');

    return this.followContract(oneByUsername);
  }

  async createFromExternalUserData(
    userData: AuthProviderUserContract,
  ): Promise<UserID> {
    const { externalId, username, firstName, lastName, email } = userData;
    const newUser = await this.prisma.user.create({
      data: {
        externalId: externalId.toString(),
        name: `${firstName} ${lastName}`,
        username,
        email,
        password: await hash(
          passwordGenerator.generate({
            length: 15,
            numbers: true,
          }),
        ),
      },
    });
    return newUser.id;
  }

  async updateFromExternalUserData(
    userData: AuthProviderUserContract,
  ): Promise<UserID> {
    const { externalId, username, firstName, lastName, email } = userData;
    const updatedUser = await this.prisma.user.update({
      where: {
        externalId: externalId.toString(),
      },
      data: {
        username,
        name: `${firstName} ${lastName}`,
        email,
      },
    });
    return updatedUser.id;
  }

  async getOneByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async createPlain(dto: AuthDto): Promise<User> {
    const user: Pick<User, 'username' | 'password'> = {
      username: dto.username,
      password: await hash(dto.password),
    };
    return this.prisma.user.create({
      data: user,
    });
  }
}
