import { Injectable } from '@nestjs/common';
import {
  AuthProviderUserContract,
  UserServiceContract,
} from '@sclable/nestjs-auth';
import { UserContract } from '../../contracts/user.contract';
import { UserID } from '@sclable/nestjs-auth/dist/src/types';
import { PrismaService } from '../../features/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService
  implements
    Omit<
      UserServiceContract<UserContract>,
      'createFromExternalUserData' | 'updateFromExternalUserData'
    >
{
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
    const user = await this.prisma.user.findUnique({
      where: {
        username,
        password,
      },
    });
    return this.followContract(user);
  }
}
