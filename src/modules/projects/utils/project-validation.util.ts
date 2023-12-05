import { Injectable } from '@nestjs/common';
import { FinderService } from '../services';
import { FinderService as UserFinderService } from '../../users/services';
import { UserEntity } from '../../users/entities';

@Injectable()
export class ProjectValidationUtils {
  constructor(
    private readonly finderService: FinderService,
    private readonly userFinderService: UserFinderService,
  ) {}

  public async validateProjectOwner(
    projectId: string,
    creatorId: string,
  ): Promise<boolean> {
    const foundProject = await this.finderService.findById(projectId);

    return foundProject.creatorId === creatorId;
  }

  public async validateMember(memberId: string): Promise<UserEntity> {
    return this.userFinderService.findOne(memberId);
  }
}
