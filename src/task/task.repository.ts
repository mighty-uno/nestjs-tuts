import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTask } from './dto/createTask';
import { TaskStatus } from './task-status-enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(creatTaskDTO: CreateTask): Promise<Task> {
    const { title, description } = creatTaskDTO;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }
}
