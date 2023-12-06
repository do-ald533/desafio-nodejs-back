import { Injectable } from '@nestjs/common';
import { FinderService as ProjectFinderService } from '../../projects/services';
import { ProjectEntity } from '../../projects/entities';

@Injectable()
export class TasksValidationUtil {
  constructor(private readonly projectFinderService: ProjectFinderService) {}

  private async validateProjectId(projectId: string) {
    return await this.projectFinderService.findById(projectId);
  }

  private validateUserMember(userId: string, project: ProjectEntity) {
    const { members } = project;
    return members.some(({ userId: id }) => id === userId);
  }

  public async validate(userId: string, projectId: string) {
    return this.validateUserMember(
      userId,
      await this.validateProjectId(projectId),
    );
  }
}
