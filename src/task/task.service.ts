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
  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException('Task not found');
    }
    return found;
  }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find(task => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException('Task not found');
  //   }
  //   return found;
  // }
  // deleteTaskById(id: string): Task[] {
  //   this.tasks = this.tasks.filter(task => task.id !== id);
  //   return this.tasks;
  // }
  // updateTask(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }

  async createTask(createTask: CreateTask): Promise<Task> {
    return this.taskRepository.createTask(createTask);
  }

  // createTask(createTask: CreateTask): Task {
  //   const { title, description } = createTask;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
}
