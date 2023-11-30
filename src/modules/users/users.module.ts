import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories';
import { ConfigModule } from '@nestjs/config';
import { CreatorService } from './services';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [UserRepository, CreatorService],
})
export class UsersModule {}
