import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories';
import { ConfigModule } from '@nestjs/config';
import {
  CreatorService,
  FinderService,
  IndexerService,
  RemoverService,
} from './services';
import { UpdaterService } from './services/updater.service';
import { PasswordUtils, UserUtils } from './utils';
import { PrismaService } from '../../shared/services/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    UserRepository,
    CreatorService,
    UpdaterService,
    RemoverService,
    FinderService,
    IndexerService,
    PasswordUtils,
    UserUtils,
    PrismaService,
  ],
})
export class UsersModule {}
