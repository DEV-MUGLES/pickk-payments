export class BaseException extends Error {
  name: string;
  code: number;

  constructor(name: string, code: number = 500, message?: string) {
    const fullMsg = message ? `${name}: ${message}` : name;

    super(fullMsg);
    this.name = name;
    this.code = code;
    this.message = fullMsg;
  }

  toString() {
    return this.message;
  }
}
