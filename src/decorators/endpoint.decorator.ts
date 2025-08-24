import {
  applyDecorators,
  Delete,
  Get,
  Head,
  HttpCode,
  Options,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AllMethods } from 'supertest/types';
import { Public } from '@sclable/nestjs-auth';
import { Fn } from 'xenopomp-essentials';
import { Auth } from './auth.decorator';

type Method = keyof typeof methodsMap;
type Path = string | string[];

const methodsMap = {
  GET: Get,
  POST: Post,
  PUT: Put,
  PATCH: Patch,
  DELETE: Delete,
  HEAD: Head,
  OPTIONS: Options,
} satisfies Partial<
  Record<AllMethods | 'PATCH', Fn<[path: Path], MethodDecorator>>
>;

interface EndpointOptions {
  /** Return code on successful response. */
  httpCode?: number;

  /** Enables validation with class-validator via pipes. */
  validate?: boolean;

  /** If true, will pass only registered users. */
  authRequired?: boolean;
}

export function Endpoint(type: Method, path: Path, options?: EndpointOptions) {
  const HttpMethod = methodsMap[type];

  // Default values
  const code = options?.httpCode ?? 200;
  const validate = options?.validate ?? false;
  const authRequired = options?.authRequired ?? false;

  // Allow optionally adding decorators
  const decorators = [
    validate ? UsePipes(new ValidationPipe()) : undefined,
    HttpCode(code),
    HttpMethod(path),
    authRequired ? Auth() : undefined,
  ]
    .filter((d) => d !== undefined)
    .reverse();

  return applyDecorators(...decorators);
}
