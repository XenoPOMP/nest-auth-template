import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @MinLength(5, {
    message: 'Username have to be at least 5 characters long',
  })
  @MaxLength(12, {
    message: 'Username have to be not longer that 12 characters',
  })
  username: string;

  @IsString()
  @MinLength(5, {
    message: 'Password have to be at least 5 characters long',
  })
  @MaxLength(12, {
    message: 'Password have to be not longer that 15 characters',
  })
  password: string;
}
