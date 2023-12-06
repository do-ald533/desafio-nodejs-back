import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import {
  AddTagsService,
  CreatorService,
  FinderService,
  IndexerService,
  RemoveTagsService,
  RemoverService,
  UpdaterService,
} from './services';
import { TasksRepository } from './repositories';
import { PrismaService } from '../../shared/services/prisma.service';
import { TasksValidationUtil } from './utils';
import { FinderService as ProjectFinderService } from '../projects/services';
import { FinderService as TagFinderService } from '../tags/services';
import { ProjectRepository } from '../projects/repositories';
import { TagsRepository } from '../tags/repositories';

@Module({
  controllers: [TasksController],
  providers: [
    CreatorService,
    IndexerService,
    FinderService,
    UpdaterService,
    AddTagsService,
    RemoveTagsService,
    TagFinderService,
    RemoverService,
    TasksRepository,
    TagsRepository,
    PrismaService,
    TasksValidationUtil,
    ProjectFinderService,
    ProjectRepository,
  ],
})
export class TasksModule {}
