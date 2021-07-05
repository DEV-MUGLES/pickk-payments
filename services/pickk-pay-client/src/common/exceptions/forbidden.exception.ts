import { BaseException } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor(message?: string) {
    super('Forbidden', 400, message);
  }
}
