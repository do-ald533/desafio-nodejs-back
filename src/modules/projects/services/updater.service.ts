import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRepository } from '../repositories';
import { ProjectEntity } from '../entities';
import { ProjectValidationUtils } from '../utils';
import { UpdateProjectDto } from '../dto';

@Injectable()
export class UpdaterService {
  private readonly logger = new Logger(UpdaterService.name);

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectUtils: ProjectValidationUtils,
  ) {}

  public async update(
    projectId: string,
    payload: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    try {
      if (
        !(await this.projectUtils.validateProjectOwner(
          projectId,
          payload.creatorId,
        ))
      )
        throw new BadRequestException(
          'Only the creator of the project can execute this action',
        );

      const project = await this.projectRepository.update(
        { id: projectId },
        { name: payload.name, description: payload.description },
      );
      return new ProjectEntity(project);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);

      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
