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
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  CreatorService,
  FinderService,
  IndexerService,
  RemoverService,
  UpdaterService,
} from './services';
import { TagEntity } from './entities';
import { FindOneParams, ListAllDto } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../shared/decorators/apiPaginatedResponse.decorator';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly finderService: FinderService,
    private readonly indexerService: IndexerService,
    private readonly removerService: RemoverService,
    private readonly updaterService: UpdaterService,
  ) {}

  @ApiResponse({ status: 201, type: TagEntity })
  @Post()
  create(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
    return this.creatorService.create(createTagDto);
  }

  @ApiResponse({ status: 500 })
  @ApiPaginatedResponse(TagEntity)
  @Get()
  findAll(@Query() { limit, page }: ListAllDto) {
    return this.indexerService.findAll(limit, page);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 200, type: TagEntity })
  @Get(':id')
  findOne(@Param() dto: FindOneParams) {
    return this.finderService.findById(dto.id);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 200, type: TagEntity })
  @Patch(':id')
  update(@Param() dto: FindOneParams, @Body() updateTagDto: UpdateTagDto) {
    return this.updaterService.update(dto.id, updateTagDto);
  }

  @ApiResponse({ status: 500 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 200, type: TagEntity })
  @Delete(':id')
  remove(@Param() dto: FindOneParams) {
    return this.removerService.remove(dto.id);
  }
}
