import { BaseException } from './base.exception';

export class MethodNotAllowedException extends BaseException {
  constructor(message?: string) {
    super('Method Not Allowed', 405, message);
  }
}
