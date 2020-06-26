import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { AuthService } from './auth.service';
import { AuthCredenstialsDTO } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body(ValidationPipe) authCreds: AuthCredenstialsDTO,
  ): Promise<UserEntity> {
    return this.authService.signup(authCreds);
  }

  @Post('/signin')
  async signin(
    @Body(ValidationPipe) authCreds: AuthCredenstialsDTO,
  ): Promise<string> {
    return this.authService.signin(authCreds);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  async test(@GetUser() user:UserEntity): Promise<string> {
    console.log('req', user);
    return 'checking';
  }
}
