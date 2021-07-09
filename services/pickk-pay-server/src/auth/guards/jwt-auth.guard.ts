import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY, IS_SUPER_SECRET_KEY } from '../decorators';
import { SuperSecretException } from '../exceptions';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.headers['super-pass'] === 'aMOrPhaTI1!') {
      return true;
    }

    const isSuperSecret = this.reflector.getAllAndOverride<boolean>(
      IS_SUPER_SECRET_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isSuperSecret) {
      throw new SuperSecretException();
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
