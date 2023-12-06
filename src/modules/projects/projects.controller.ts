import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  AddMembersService,
  CreatorService,
  FinderService,
  IndexerService,
  RemoveMembersService,
  RemoverService,
  UpdaterService,
} from './services';
import {
  FindOneParams,
  CreateProjectDto,
  MembersDto,
  UpdateProjectDto,
} from './dto';
import { ProjectEntity } from './entities';
import { ListAllDto } from '../users/dtos';
import { PaginatedResult } from 'prisma-pagination';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../shared/decorators/apiPaginatedResponse.decorator';

@ApiTags('Projects')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly finderService: FinderService,
    private readonly indexerService: IndexerService,
    private readonly addMembersService: AddMembersService,
    private readonly removeMembersService: RemoveMembersService,
    private readonly removerService: RemoverService,
    private readonly updaterService: UpdaterService,
  ) {}

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404, description: 'user id not found' })
  @ApiResponse({ type: ProjectEntity, status: 201 })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    return this.creatorService.create(createProjectDto);
  }

  @ApiResponse({ status: 500 })
  @ApiPaginatedResponse(ProjectEntity)
  @Get()
  findAll(
    @Query() { limit, page }: ListAllDto,
  ): Promise<PaginatedResult<ProjectEntity>> {
    return this.indexerService.findAll(limit, page);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404, description: 'project id not found' })
  @ApiResponse({ status: 200, type: ProjectEntity })
  @Get(':id')
  findOne(@Param() dto: FindOneParams): Promise<ProjectEntity> {
    return this.finderService.findById(dto.id);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404, description: 'project id not found' })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 200 })
  @Patch('add-members/:id')
  addMembers(@Param() params: FindOneParams, @Body() payload: MembersDto) {
    return this.addMembersService.addMembers(payload, params.id);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404, description: 'project id not found' })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 200 })
  @Patch('remove-members/:id')
  removeMembers(@Param() params: FindOneParams, @Body() payload: MembersDto) {
    return this.removeMembersService.removeMembers(payload, params.id);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404, description: 'project id not found' })
  @ApiResponse({ status: 200, type: ProjectEntity })
  @Patch(':id')
  update(@Param() dto: FindOneParams, @Body() payload: UpdateProjectDto) {
    return this.updaterService.update(dto.id, payload);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404, description: 'project id not found' })
  @ApiResponse({ status: 200, type: ProjectEntity })
  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.removerService.remove(id);
  }
}
