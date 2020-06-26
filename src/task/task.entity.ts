import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from './task-status-enum';
import { UserEntity } from 'src/auth/user.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(
    () => UserEntity,
    user => user.tasks,
    { eager: false },
  )
  user: UserEntity;

  @Column()
  userId: number;
}
