import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtPayload {
  iat: number;

  exp: number;
}

export class SignInDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
