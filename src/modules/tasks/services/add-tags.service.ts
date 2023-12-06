import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from '../repositories';
import { TaskTagsDto } from '../dto';
import { FinderService } from './finder.service';
import { TasksValidationUtil } from '../utils';

@Injectable()
export class AddTagsService {
  private readonly logger = new Logger(AddTagsService.name);

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

  public async addTags(taskId: string, payload: TaskTagsDto) {
    try {
      const { projectId } = await this.finderService.findById(taskId);
      if (!(await this.tasksValidation.validate(payload.userId, projectId)))
        throw new BadRequestException(
          `user with id: ${payload.userId} is not member of the project ${projectId}`,
        );

      return await this.tasksRepository.addTags(
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
