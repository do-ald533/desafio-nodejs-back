import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  FindOneParams,
  ListAllDto,
} from './dtos';
import {
  CreatorService,
  FinderService,
  IndexerService,
  RemoverService,
} from './services';
import { UserEntity } from './entities';
import { ApiPaginatedResponse } from '../../shared/decorators/apiPaginatedResponse.decorator';
import { UpdaterService } from './services/updater.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly finderService: FinderService,
    private readonly indexerService: IndexerService,
    private readonly updaterService: UpdaterService,
    private readonly removerService: RemoverService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.creatorService.create(createUserDto);
  }

  @ApiPaginatedResponse(UserEntity)
  @Get()
  findAll(@Query() query: ListAllDto) {
    return this.indexerService.index(query.limit, query.page);
  }

  @Get(':id')
  findOne(@Param() findOneDto: FindOneParams): Promise<UserEntity> {
    return this.finderService.findOne(findOneDto.id);
  }

  @Patch(':id')
  update(
    @Param() findOneDto: FindOneParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.updaterService.update(findOneDto.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() findOneDto: FindOneParams) {
    return this.removerService.remove(findOneDto.id);
  }
}
