import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRepository } from '../repositories';
import { ProjectValidationUtils } from '../utils';
import { MembersDto } from '../dto';

@Injectable()
export class RemoveMembersService {
  private readonly logger = new Logger(RemoveMembersService.name);

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectValidationUtils: ProjectValidationUtils,
  ) {}

  private createPayloadForDb(memberIds: string[], projectId: string) {
    return memberIds.map((id) => ({
      projectId,
      userId: id,
    }));
  }

  public async removeMembers(payload: MembersDto, projectId: string) {
    try {
      if (
        !(await this.projectValidationUtils.validateProjectOwner(
          projectId,
          payload.creatorId,
        ))
      )
        throw new BadRequestException(
          `only the creator of the project can add users`,
        );

      await Promise.all(
        payload.memberIds.map((id) =>
          this.projectValidationUtils.validateMember(id),
        ),
      );

      return await this.projectRepository.removeUsers(
        this.createPayloadForDb(payload.memberIds, projectId),
      );
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error);

      if (error instanceof BadRequestException)
        throw new BadRequestException(error);

      this.logger.error(error.message);
      throw new InternalServerErrorException(error);
    }
  }
}
