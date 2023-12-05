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
} from './services';
import { FindOneParams, CreateProjectDto, AddMembersDto } from './dto';
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
  addMembers(@Param() params: FindOneParams, @Body() payload: AddMembersDto) {
    return this.addMembersService.addMembers(payload, params.id);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
  //   return this.projectsService.update(+id, updateProjectDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.projectsService.remove(+id);
  // }
}
