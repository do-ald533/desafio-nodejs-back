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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskEntity } from './entities';
import { ApiPaginatedResponse } from '../../shared/decorators/apiPaginatedResponse.decorator';

@ApiTags('Tasks')
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

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 201, type: TaskEntity })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.creatorService.create(createTaskDto);
  }

  @ApiResponse({ status: 500 })
  @ApiPaginatedResponse(TaskEntity)
  @Get()
  findAll(@Query() { limit, page }: ListAllDto) {
    return this.indexerService.findAll(limit, page);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 200, type: TaskEntity })
  @Get(':id')
  findOne(@Param() dto: FindOneParams) {
    return this.finderService.findById(dto.id);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 200 })
  @Patch('add-tags/:id')
  addTags(@Param() params: FindOneParams, @Body() payload: TaskTagsDto) {
    return this.addTagsService.addTags(params.id, payload);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 200 })
  @Patch('remove-tags/:id')
  removeTags(@Param() params: FindOneParams, @Body() payload: TaskTagsDto) {
    return this.removeTagsService.removeTags(params.id, payload);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 200, type: TaskEntity })
  @Patch(':id')
  update(@Param() params: FindOneParams, @Body() updateTaskDto: UpdateTaskDto) {
    return this.updaterService.update(params.id, updateTaskDto);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 200, type: TaskEntity })
  @Delete(':id')
  remove(@Param() params: FindOneParams, @Query() query: RemoveTaskDto) {
    return this.removerService.remove(params.id, query);
  }
}
