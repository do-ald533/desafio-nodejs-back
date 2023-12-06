import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { CreatorService, FinderService, IndexerService } from './services';
import { TasksRepository } from './repositories';
import { PrismaService } from '../../shared/services/prisma.service';
import { TasksValidationUtil } from './utils';
import { FinderService as ProjectFinderService } from '../projects/services'
import { ProjectRepository } from '../projects/repositories';

@Module({
  controllers: [TasksController],
  providers: [
    CreatorService,
    IndexerService,
    FinderService,
    TasksRepository,
    PrismaService,
    TasksValidationUtil,
    ProjectFinderService,
    ProjectRepository,
  ],
})
export class TasksModule {}
