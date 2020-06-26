import { IsString, MinLength, MaxLength } from 'class-validator';

export class AuthCredenstialsDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
