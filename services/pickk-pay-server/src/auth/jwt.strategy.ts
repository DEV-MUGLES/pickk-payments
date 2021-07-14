import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtConstants, jwtRefreshConstants } from './constants/jwt.constant';
import { JwtPayload } from './dtos/jwt.dto';

export const CustomJwtStrategy = (
  name?: string,
  secretOrKey: string = jwtConstants.secret
) =>
  class ResultStrategy extends PassportStrategy(Strategy, name) {
    constructor() {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey,
      });
    }

    async validate(payload: JwtPayload) {
      return payload;
    }
  };

@Injectable()
export class JwtStrategy extends CustomJwtStrategy() {}

@Injectable()
export class JwtRefreshStrategy extends CustomJwtStrategy(
  'jwt-refresh',
  jwtRefreshConstants.secret
) {}
