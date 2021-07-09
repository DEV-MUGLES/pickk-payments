import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtToken, SignInDto } from './dtos';
import { JwtRefreshGuard } from './guards';
import { Public } from './decorators';
import { UserNotFoundExeption } from './exceptions';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  signIn(@Body() { username, password }: SignInDto): JwtToken {
    if (!this.authService.isAdminUser(username, password)) {
      throw new UserNotFoundExeption();
    }
    return this.authService.getJwtToken();
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(): JwtToken {
    return this.authService.getJwtToken();
  }
}
