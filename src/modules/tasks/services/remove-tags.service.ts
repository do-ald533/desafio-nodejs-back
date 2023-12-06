import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from '../repositories';
import { FinderService } from './finder.service';
import { TasksValidationUtil } from '../utils';
import { TaskTagsDto } from '../dto';

@Injectable()
export class RemoveTagsService {
  private readonly logger = new Logger(RemoveTagsService.name);

  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly finderService: FinderService,
    private readonly tasksValidation: TasksValidationUtil,
  ) {}

  private createPayloadForDb(taskId: string, tagIds: string[]) {
    return tagIds.map((tagId) => ({
      tagId,
      taskId,
    }));
  }

  public async removeTags(taskId: string, payload: TaskTagsDto) {
    try {
      const { projectId } = await this.finderService.findById(taskId);
      if (!(await this.tasksValidation.validate(payload.userId, projectId)))
        throw new BadRequestException(
          `user with id: ${payload.userId} is not member of the project ${projectId}`,
        );
      return await this.tasksRepository.removeTags(
        this.createPayloadForDb(taskId, payload.tagIds),
      );
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error);

      if (error instanceof BadRequestException)
        throw new BadRequestException(error);

      this.logger.error(error.message);
      throw new InternalServerErrorException(error);
    }
  }
}
