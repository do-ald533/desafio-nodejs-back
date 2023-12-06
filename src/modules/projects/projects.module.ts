import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { FinderService as UserFinderService } from '../users/services';
import {
  AddMembersService,
  CreatorService,
  FinderService,
  IndexerService,
  RemoveMembersService,
  RemoverService,
  UpdaterService,
} from './services';
import { PrismaService } from '../../shared/services/prisma.service';
import { ProjectRepository } from './repositories';
import { UserRepository } from '../users/repositories';
import { ProjectValidationUtils } from './utils';

@Module({
  controllers: [ProjectsController],
  providers: [
    CreatorService,
    PrismaService,
    IndexerService,
    FinderService,
    ProjectRepository,
    AddMembersService,
    RemoveMembersService,
    UserFinderService,
    UserRepository,
    ProjectValidationUtils,
    RemoverService,
    UpdaterService,
  ],
})
export class ProjectsModule {}
