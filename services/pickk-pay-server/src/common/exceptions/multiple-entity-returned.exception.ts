import { HttpException, HttpStatus } from '@nestjs/common';

export class MultipleEntityReturnedException extends HttpException {
  constructor() {
    super('Multiple Entity Returned', HttpStatus.CONFLICT);
  }
}
