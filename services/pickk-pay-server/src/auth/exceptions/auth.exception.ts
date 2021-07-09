import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UserNotFoundExeption extends NotFoundException {
  constructor() {
    super('아아디나 비밀번호가 잘못되었습니다.');
  }
}

export class SuperSecretException extends ForbiddenException {
  constructor() {
    super("Sorry, It's Super Secret!");
  }
}
