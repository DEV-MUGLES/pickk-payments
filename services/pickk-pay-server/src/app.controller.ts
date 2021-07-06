import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/is-public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  healthCheck(): string {
    return "I'm Good";
  }
}
