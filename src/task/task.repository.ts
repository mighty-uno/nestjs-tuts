import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTask } from './dto/createTask';
import { TaskStatus } from './task-status-enum';
import { UserEntity } from 'src/auth/user.entity';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('Task Repository');
  async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.userName
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(creatTaskDTO: CreateTask, user: UserEntity): Promise<Task> {
    const { title, description } = creatTaskDTO;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;
    return task;
  }
}
