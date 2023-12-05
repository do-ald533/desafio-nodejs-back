import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProjectEntity } from '../entities';
import { ProjectRepository } from '../repositories';
import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';

@Injectable()
export class RemoverService {
  private readonly logger = new Logger(RemoverService.name);
  constructor(private readonly projectRepository: ProjectRepository) {}

  public async remove(id: string): Promise<ProjectEntity> {
    try {
      const project = await this.projectRepository.remove({ id });
      return new ProjectEntity(project);
    } catch (error) {
      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === PrismaErrorCodes.NOT_FOUND) ||
        error instanceof NotFoundException
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
