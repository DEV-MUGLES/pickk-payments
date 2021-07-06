import { Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  signIn(): string {
    return this.authService.getJwtToken();
  }
}
