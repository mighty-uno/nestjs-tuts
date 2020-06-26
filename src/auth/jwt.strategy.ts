import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UnauthorizedException } from '@nestjs/common';
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'khiwye238473nrwo5i475efbq',
    });
  }

  async validate(payload: { userName: string }) {
    console.log(payload);
    const user = this.userRepository.findOne({ userName: payload.userName });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
