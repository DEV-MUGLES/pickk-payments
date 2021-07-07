import { Controller, Post, UseGuards } from '@nestjs/common';

import { StdVbankNotiGuard, MobVbankNotiGuard } from './guards';

@Controller('/inicis')
export class InicisController {
  @UseGuards(StdVbankNotiGuard)
  @Post('/std/vbank-noti')
  async stdVbankNoti(): Promise<string> {
    return 'hi';
  }

  @UseGuards(MobVbankNotiGuard)
  @Post('/mob/vbank-noti')
  async mobVbankNoti(): Promise<string> {
    return 'hi';
  }
}
