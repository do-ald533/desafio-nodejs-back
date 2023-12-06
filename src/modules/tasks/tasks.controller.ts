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
import {
  AddTagsService,
  CreatorService,
  FinderService,
  IndexerService,
  RemoveTagsService,
  RemoverService,
  UpdaterService,
} from './services';
import {
  FindOneParams,
  ListAllDto,
  RemoveTaskDto,
  TaskTagsDto,
  UpdateTaskDto,
} from './dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly finderService: FinderService,
    private readonly indexerService: IndexerService,
    private readonly removerService: RemoverService,
    private readonly updaterService: UpdaterService,
    private readonly addTagsService: AddTagsService,
    private readonly removeTagsService: RemoveTagsService,
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

  @Patch('add-tags/:id')
  addTags(@Param() params: FindOneParams, @Body() payload: TaskTagsDto) {
    return this.addTagsService.addTags(params.id, payload);
  }

  @Patch('remove-tags/:id')
  removeTags(@Param() params: FindOneParams, @Body() payload: TaskTagsDto) {
    return this.removeTagsService.removeTags(params.id, payload);
  }

  @Patch(':id')
  update(@Param() params: FindOneParams, @Body() updateTaskDto: UpdateTaskDto) {
    return this.updaterService.update(params.id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param() params: FindOneParams, @Query() query: RemoveTaskDto) {
    return this.removerService.remove(params.id, query);
  }
}
