import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AddMembersDto } from '../dto/add-members.dto';
import { ProjectRepository } from '../repositories';
import { ProjectValidationUtils } from '../utils';

@Injectable()
export class AddMembersService {
  private readonly logger = new Logger(AddMembersService.name);

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectValidationUtils: ProjectValidationUtils,
  ) {}

  private createPayloadForDb(memberIds: string[], projectId: string) {
    return memberIds.map((id) => ({
      userId: id,
      projectId: projectId,
    }));
  }

  public async addMembers(payload: AddMembersDto, projectId: string) {
    try {
      if (
        !(await this.projectValidationUtils.validateProjectOwner(
          projectId,
          payload.creatorId,
        ))
      )
        throw new NotFoundException();

      await Promise.all(
        payload.memberIds.map((id) =>
          this.projectValidationUtils.validateMember(id),
        ),
      );

      return this.projectRepository.addUsers(
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
