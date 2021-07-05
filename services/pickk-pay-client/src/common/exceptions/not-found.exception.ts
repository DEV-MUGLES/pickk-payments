import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(message?: string) {
    super('Not Found', 404, message);
  }
}
