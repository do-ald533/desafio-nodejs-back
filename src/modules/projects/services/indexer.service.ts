import { Prisma } from '@prisma/client';
import { ProjectRepository } from '../repositories';
import { ProjectEntity } from '../entities';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);

  constructor(private readonly projectRepository: ProjectRepository) {}

  public async findAll(
    limit?: number,
    page?: number,
    where?: Prisma.ProjectWhereInput,
  ) {
    try {
      const foundProjects = await this.projectRepository.findAll(
        limit,
        page,
        where,
      );
      const data = foundProjects.data.map((data) => new ProjectEntity(data));
      const serializedResults = { ...foundProjects, data };
      return serializedResults;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
