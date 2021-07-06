import { InternalServerErrorException } from '@nestjs/common';

export class InicisCancelFailedException extends InternalServerErrorException {
  constructor(resultMsg: string) {
    super('KG이니시스 취소실패: ' + resultMsg);
  }
}
