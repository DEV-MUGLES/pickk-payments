import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('/payments')
export class PaymentsController {
  @Get()
  get() {
    return 'hi';
  }
}
