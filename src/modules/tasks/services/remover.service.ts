import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from '../repositories';
import { TaskEntity } from '../entities';
import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';
import { RemoveTaskDto } from '../dto';
import { TasksValidationUtil } from '../utils';
import { FinderService } from './finder.service';

@Injectable()
export class RemoverService {
  private readonly logger = new Logger(RemoverService.name);

  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly tasksValidation: TasksValidationUtil,
    private readonly finderService: FinderService,
  ) {}

  public async remove(id: string, payload: RemoveTaskDto) {
    try {
      const { projectId } = await this.finderService.findById(id);
      if (!(await this.tasksValidation.validate(payload.userId, projectId)))
        throw new BadRequestException(
          `user with id: ${payload.userId} is not member of the project ${id}`,
        );

      const deletedTask = await this.tasksRepository.remove({ id });
      return new TaskEntity(deletedTask);
    } catch (error) {
      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === PrismaErrorCodes.NOT_FOUND) ||
        error instanceof NotFoundException
      )
        throw new NotFoundException(
          `could not find project with id: ${id}`,
          error.message,
        );

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
