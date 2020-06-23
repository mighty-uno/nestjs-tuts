import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
import { CreateTask } from './dto/createTask';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
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
  async updateTask(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async createTask(createTask: CreateTask): Promise<Task> {
    return this.taskRepository.createTask(createTask);
  }
}
