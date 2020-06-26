import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { AuthCredenstialsDTO } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(authCreds: AuthCredenstialsDTO): Promise<UserEntity> {
    return this.userRepository.signup(authCreds);
  }

  async signin(authCreds: AuthCredenstialsDTO): Promise<string> {
    const user = await this.userRepository.validateUserPassword(authCreds);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
      return;
    }

    const payload = { userName: user };
    const token = this.jwtService.sign(payload);

    return token;
  }
}
