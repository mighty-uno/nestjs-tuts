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
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTask } from './dto/createTask';
import { TaskStatusValidationPipe } from './pipes/taskStatusValidation';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  private logger = new Logger('Task Controller');
  constructor(private taskService: TaskService) {}

  @Get()
  getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  @Get('/get')
  getTask(
    @Query(ValidationPipe) filterDTO: GetTasksFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<Task[]> {
    this.logger.verbose(
      `user ${user.userName} fetching all task. Filters ${JSON.stringify(
        filterDTO,
      )}`,
    );
    return this.taskService.getTasks(filterDTO, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: number,
    ParseIntPipe,
    @GetUser() user: UserEntity,
  ): void {
    this.taskService.deleteTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTask: CreateTask,
    @GetUser() user: UserEntity,
  ): Promise<Task> {
    console.log(createTask);
    this.logger.verbose(
      `user ${user.userName} creating new task. Task ${JSON.stringify(
        createTask,
      )}`,
    );
    return this.taskService.createTask(createTask, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: UserEntity,
  ): Promise<Task> {
    return this.taskService.updateTask(id, status, user);
  }
}
