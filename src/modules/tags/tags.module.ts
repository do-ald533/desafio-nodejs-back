import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import {
  CreatorService,
  FinderService,
  IndexerService,
  RemoverService,
  UpdaterService,
} from './services';
import { TagsRepository } from './repositories';
import { PrismaService } from '../../shared/services/prisma.service';

@Module({
  controllers: [TagsController],
  providers: [
    CreatorService,
    UpdaterService,
    RemoverService,
    FinderService,
    IndexerService,
    TagsRepository,
    PrismaService,
  ],
})
export class TagsModule {}
