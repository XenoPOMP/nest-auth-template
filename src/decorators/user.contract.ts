import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserContract } from '../contracts/user.contract';

/**
 * Pulls up user from execution context.
 * The 'authRequired' flag is required using Endpoint decorator!
 * @param ctx
 */
export const getUserFromCtx = (ctx: ExecutionContext): UserContract => {
  const request = ctx.switchToHttp().getRequest<{ user: UserContract }>();
  return request.user;
};

/**
 * Passes current logged user. Uses ExecutionContext, modified by jwt library.
 *
 * @example
 * \@Endpoint('GET', '/test', {
 *   authRequired: true,
 * })
 * test(@CurrentUser() user: User, @CurrentUser('name') userName: User['name']) {
 *   console.log({ user, name });
 * }
 */
export const CurrentUser = createParamDecorator(
  (property: keyof UserContract | undefined, ctx: ExecutionContext) => {
    const user: UserContract = getUserFromCtx(ctx);

    // Check if selecting property name is not defined.
    // If it is so, return the whole user object.
    if (!property) {
      return user;
    }

    // Otherwise, return only selected property
    return user[property];
  },
);
