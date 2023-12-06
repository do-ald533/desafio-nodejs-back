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

  @Post()
  create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    return this.creatorService.create(createProjectDto);
  }

  @Get()
  findAll(
    @Query() { limit, page }: ListAllDto,
  ): Promise<PaginatedResult<ProjectEntity>> {
    return this.indexerService.findAll(limit, page);
  }

  @Get(':id')
  findOne(@Param() dto: FindOneParams): Promise<ProjectEntity> {
    return this.finderService.findById(dto.id);
  }

  @Patch('add-members/:id')
  addMembers(@Param() params: FindOneParams, @Body() payload: MembersDto) {
    return this.addMembersService.addMembers(payload, params.id);
  }

  @Patch('remove-members/:id')
  removeMembers(@Param() params: FindOneParams, @Body() payload: MembersDto) {
    return this.removeMembersService.removeMembers(payload, params.id);
  }

  @Patch(':id')
  update(@Param() dto: FindOneParams, @Body() payload: UpdateProjectDto) {
    return this.updaterService.update(dto.id, payload);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.removerService.remove(id);
  }
}
