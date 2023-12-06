import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TagsRepository } from '../repositories';
import { UpdateTagDto } from '../dto';
import { FinderService } from './finder.service';
import { TagEntity } from '../entities';

@Injectable()
export class UpdaterService {
  private readonly logger = new Logger(UpdaterService.name);

  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly finderService: FinderService,
  ) {}

  public async update(tagId: string, payload: UpdateTagDto) {
    try {
      if (!(await this.finderService.findById(tagId)))
        throw new NotFoundException(`couldn't find tag with Id: ${tagId}`);
      const updatedTag = await this.tagsRepository.update(tagId, payload);
      return new TagEntity(updatedTag);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);

      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
