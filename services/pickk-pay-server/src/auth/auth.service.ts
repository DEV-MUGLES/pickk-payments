import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { jwtRefreshConstants } from './constants/jwt.constant';
import { JwtToken } from './dtos/jwt.dto';

const ADMIN_USERS = [
  { name: 'sumin', password: 'ajrmftnals1!' },
  { name: 'seoyoung', password: 'aaa111!!!' },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  isAdminUser(username: string, password: string): boolean {
    return (
      ADMIN_USERS.findIndex(
        (user) => user.name === username && user.password === password,
      ) >= 0
    );
  }

  getJwtToken(): JwtToken {
    return {
      access: this.jwtService.sign({}),
      refresh: this.jwtService.sign({}, jwtRefreshConstants),
    };
  }
}
