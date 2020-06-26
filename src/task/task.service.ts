import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
import { CreateTask } from './dto/createTask';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }

  async getTasks(
    filterDTO: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<Task[]> {
    const tasks = await this.taskRepository.getTasks(filterDTO, user);
    return tasks;
  }

  async getTaskById(id: number, user: UserEntity): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException('Task not found');
    }
    return found;
  }

  async deleteTaskById(id: number): Promise<boolean> {
    const result = await this.taskRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Not found');
    }

    return true;
  }
  async updateTask(
    id: number,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async createTask(createTask: CreateTask, user: UserEntity): Promise<Task> {
    return this.taskRepository.createTask(createTask, user);
  }
}
