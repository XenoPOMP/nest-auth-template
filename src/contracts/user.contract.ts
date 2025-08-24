import { ApplicationUser } from '@sclable/nestjs-auth';
import { User } from '@prisma/client';
import { UserID } from '@sclable/nestjs-auth/dist/src/types';

type CuidToUserId<U> = {
  [Key in keyof U]: Key extends `${string}id${string}`
    ? UserID
    : Key extends `${string}Id${string}`
      ? UserID | undefined
      : U[Key];
};

type NullToOptional<U, K extends keyof U> = {
  [Key in keyof U]: Key extends K ? NonNullable<U[Key]> | undefined : U[Key];
};

type ClearedIds = CuidToUserId<User>;
type Optionals = NullToOptional<ClearedIds, 'email' | 'username'>;
type ApplicationLike<U extends ApplicationUser> = U;

/** User, converted to library-like usage. */
export type UserContract = ApplicationLike<Optionals>;
