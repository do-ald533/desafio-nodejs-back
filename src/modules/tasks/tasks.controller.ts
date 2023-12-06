import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreatorService, FinderService, IndexerService } from './services';
import { FindOneParams, ListAllDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly finderService: FinderService,
    private readonly indexerService: IndexerService,
  ) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.creatorService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() { limit, page }: ListAllDto) {
    return this.indexerService.findAll(limit, page);
  }

  @Get(':id')
  findOne(@Param() dto: FindOneParams) {
    return this.finderService.findById(dto.id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.tasksService.update(+id, updateTaskDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tasksService.remove(+id);
  // }
}
