import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtToken, SignInDto } from './dtos/jwt.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import { Public } from './is-public.decorator';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  signIn(@Body() { username, password }: SignInDto): JwtToken {
    if (!this.authService.isAdminUser(username, password)) {
      throw new NotFoundException('아아디나 비밀번호가 잘못되었습니다.');
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
