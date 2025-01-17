import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TagsModule } from './modules/tags/tags.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [UsersModule, ProjectsModule, TasksModule, TagsModule, HealthModule],
})
export class AppModule {}
