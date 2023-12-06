import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRepository } from '../repositories';
import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';
import { ProjectEntity } from '../entities';

@Injectable()
export class FinderService {
  private readonly logger = new Logger(FinderService.name);

  constructor(private readonly projectRepository: ProjectRepository) {}

  public async findById(id: string): Promise<ProjectEntity> {
    try {
      const foundProject = await this.projectRepository.findById(id);

      return new ProjectEntity(foundProject);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.NOT_FOUND
      )
        throw new NotFoundException(
          `could not find user with id: ${id}`,
          error.message,
        );

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
