import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from '../repositories';
import { UpdateTaskDto } from '../dto';
import { TasksValidationUtil } from '../utils';
import { TaskEntity } from '../entities';
import { Prisma, Status } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';
import { FinderService } from './finder.service';

@Injectable()
export class UpdaterService {
  private readonly logger = new Logger(UpdaterService.name);

  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly tasksValidation: TasksValidationUtil,
    private readonly finderService: FinderService,
  ) {}

  public async update(id: string, payload: UpdateTaskDto) {
    try {
      const { projectId, status } = await this.finderService.findById(id);

      if (status === Status.COMPLETED)
        throw new BadRequestException(`cannot alter completed tasks`);

      if (!(await this.tasksValidation.validate(payload.userId, projectId)))
        throw new BadRequestException(
          `user with id: ${payload.userId} is not member of the project ${projectId}`,
        );

      const updatedTask = await this.tasksRepository.update(
        { id },
        {
          title: payload.title,
          status: payload.status,
          description: payload.description,
        },
      );

      return new TaskEntity(updatedTask);
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
