import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from '../repositories';
import { CreateTaskDto } from '../dto';
import { TasksValidationUtil } from '../utils';
import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';

@Injectable()
export class CreatorService {
  private readonly logger = new Logger(CreatorService.name);

  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly tasksValidation: TasksValidationUtil,
  ) {}

  public async create(payload: CreateTaskDto) {
    try {
      const project = await this.tasksValidation.validateProjectId(
        payload.projectId,
      );
      if (
        !(await this.tasksValidation.validateUserMember(
          payload.userId,
          project,
        ))
      )
        throw new BadRequestException(
          `user with id: ${payload.userId} is not member of the project ${payload.projectId}`,
        );

      const createdTask = await this.tasksRepository.create({
        title: payload.title,
        projectId: payload.projectId,
        status: payload.status,
        description: payload.description,
      });
      return createdTask;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.NOT_FOUND
      )
        throw new NotFoundException(
          `could not find project with id: ${payload.projectId}`,
          error.message,
        );

      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);

      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
