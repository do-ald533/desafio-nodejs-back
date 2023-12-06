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
import { FinderService as TagFinderService } from '../../tags/services';

@Injectable()
export class CreatorService {
  private readonly logger = new Logger(CreatorService.name);

  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly tasksValidation: TasksValidationUtil,
    private readonly tagFinderService: TagFinderService,
  ) {}

  private validateTags(tagIds: string[]) {
    return tagIds.map((id) => this.tagFinderService.findById(id));
  }

  public async create(payload: CreateTaskDto) {
    try {
      if (
        !(await this.tasksValidation.validate(
          payload.userId,
          payload.projectId,
        ))
      )
        throw new BadRequestException(
          `user with id: ${payload.userId} is not member of the project ${payload.projectId}`,
        );

      const tagIds = await Promise.all(this.validateTags(payload.tagIds));

      const createdTask = await this.tasksRepository.create({
        title: payload.title,
        projectId: payload.projectId,
        status: payload.status,
        description: payload.description,
        tags: {
          createMany: {
            data: tagIds.map(({ id }) => ({ tagId: id })),
          },
        },
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
