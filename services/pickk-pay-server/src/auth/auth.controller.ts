import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInDto } from './dtos/jwt.dto';
import { Public } from './is-public.decorator';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  signIn(@Body() { username, password }: SignInDto): string {
    if (!this.authService.isAdminUser(username, password)) {
      throw new NotFoundException('아아디나 비밀번호가 잘못되었습니다.');
    }
    return this.authService.getJwtToken();
  }
}
