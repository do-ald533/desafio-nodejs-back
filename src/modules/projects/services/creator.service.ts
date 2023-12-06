import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectRepository } from '../repositories/';
import { FinderService as UserFinderService } from '../../users/services';
import { ProjectEntity } from '../entities';

@Injectable()
export class CreatorService {
  private readonly logger = new Logger(CreatorService.name);

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userFinderService: UserFinderService,
  ) {}
  public async create(payload: CreateProjectDto): Promise<ProjectEntity> {
    try {
      if (!(await this.userFinderService.findOne(payload.creatorId)))
        throw new NotFoundException(
          `could not find creator of the project with id: ${payload.creatorId}`,
        );

      const createdProject = await this.projectRepository.create(payload);
      return new ProjectEntity(createdProject);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);

      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
