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

@Controller('tags')
export class TagsController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly finderService: FinderService,
    private readonly indexerService: IndexerService,
    private readonly removerService: RemoverService,
    private readonly updaterService: UpdaterService,
  ) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
    return this.creatorService.create(createTagDto);
  }

  @Get()
  findAll(@Query() { limit, page }: ListAllDto) {
    return this.indexerService.findAll(limit, page);
  }

  @Get(':id')
  findOne(@Param() dto: FindOneParams) {
    return this.finderService.findById(dto.id);
  }

  @Patch(':id')
  update(@Param() dto: FindOneParams, @Body() updateTagDto: UpdateTagDto) {
    return this.updaterService.update(dto.id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param() dto: FindOneParams) {
    return this.removerService.remove(dto.id);
  }
}
