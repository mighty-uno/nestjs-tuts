import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTask } from './dto/createTask';
import { TaskStatusValidationPipe } from './pipes/taskStatusValidation';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  // @Get()
  // getAllTasks(): Task[] {
  //   return this.taskService.getAllTasks();
  // }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number): void {
    this.taskService.deleteTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTask: CreateTask): Promise<Task> {
    console.log(createTask);
    return this.taskService.createTask(createTask);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.taskService.updateTask(id, status);
  }
}