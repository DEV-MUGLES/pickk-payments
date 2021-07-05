import { BaseException } from './base.exception';

export class BadRequestException extends BaseException {
  constructor(message?: string) {
    super('Bad Request', 400, message);
  }
}
