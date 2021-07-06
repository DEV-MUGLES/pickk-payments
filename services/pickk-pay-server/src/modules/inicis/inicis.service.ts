import { Injectable } from '@nestjs/common';

import { InicisCancelDto } from './dtos/inicis-cancel.dto';

@Injectable()
export class InicisService {
  async cancel(dto: InicisCancelDto) {}
}
