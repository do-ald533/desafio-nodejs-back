import { Injectable } from '@nestjs/common';
import { FinderService as ProjectFinderService } from '../../projects/services';
import { ProjectEntity } from '../../projects/entities';

@Injectable()
export class TasksValidationUtil {
  constructor(private readonly projectFinderService: ProjectFinderService) {}

  public async validateProjectId(projectId: string) {
    return await this.projectFinderService.findById(projectId);
  }

  public async validateUserMember(userId: string, project: ProjectEntity) {
    const { members } = project;
    console.log(members);
    return members.some(({ userId: id }) => id === userId);
  }
}
