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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly finderService: FinderService,
    private readonly indexerService: IndexerService,
    private readonly updaterService: UpdaterService,
    private readonly removerService: RemoverService,
  ) {}

  @ApiResponse({
    status: 422,
    description: 'unable to create a user',
  })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ type: UserEntity, status: 201, description: 'created user' })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.creatorService.create(createUserDto);
  }

  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiPaginatedResponse(UserEntity)
  @Get()
  findAll(@Query() query: ListAllDto) {
    return this.indexerService.index(query.limit, query.page);
  }

  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Get(':id')
  findOne(@Param() findOneDto: FindOneParams): Promise<UserEntity> {
    return this.finderService.findOne(findOneDto.id);
  }

  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Patch(':id')
  update(
    @Param() findOneDto: FindOneParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.updaterService.update(findOneDto.id, updateUserDto);
  }

  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Delete(':id')
  remove(@Param() findOneDto: FindOneParams) {
    return this.removerService.remove(findOneDto.id);
  }
}
