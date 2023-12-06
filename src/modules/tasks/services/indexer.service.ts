import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TasksRepository } from '../repositories';
import { Prisma } from '@prisma/client';
import { TaskEntity } from '../entities';

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);

  constructor(private readonly tasksRepository: TasksRepository) {}

  public async findAll(
    limit?: number,
    page?: number,
    where?: Prisma.TaskWhereInput,
  ) {
    try {
      const foundTasks = await this.tasksRepository.findAll(limit, page, where);
      const newData = foundTasks.data.map((data) => new TaskEntity(data));

      const serializedData = { ...foundTasks, data: newData };
      return serializedData;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
