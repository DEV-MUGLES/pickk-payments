import { IsString } from 'class-validator';

export class JwtPayload {
  iat: number;

  exp: number;
}

export class SignInDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
