import { Repository, EntityRepository } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthCredenstialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

const SALT_ROUND = 10;

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async signup(authCreds: AuthCredenstialsDTO): Promise<UserEntity> {
    try {
      const { userName, password } = authCreds;
      const user = new UserEntity();
      user.userName = userName;
      const salt = await bcrypt.genSalt(SALT_ROUND);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      return user;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('user already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCreds: AuthCredenstialsDTO): Promise<string> {
    const { userName, password } = authCreds;
    const user = await this.findOne({ userName });
    const isValidate = await this.comparePassword(user.password, password);
    return isValidate ? userName : null;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(hash, password);
  }
}
