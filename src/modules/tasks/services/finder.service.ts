import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from '../repositories';
import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';
import { TaskEntity } from '../entities';

@Injectable()
export class FinderService {
  private readonly logger = new Logger(FinderService.name);

  constructor(private readonly tasksRepository: TasksRepository) {}

  public async findById(id: string) {
    try {
      const foundTask = await this.tasksRepository.findById(id);
      return new TaskEntity(foundTask);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.NOT_FOUND
      )
        throw new NotFoundException(
          `could not find project with id: ${id}`,
          error.message,
        );

      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
