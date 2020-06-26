import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['userName'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  password: string;
}
