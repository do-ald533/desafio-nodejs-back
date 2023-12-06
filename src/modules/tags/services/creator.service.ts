import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TagsRepository } from '../repositories';
import { CreateTagDto } from '../dto';
import { TagEntity } from '../entities/';

@Injectable()
export class CreatorService {
  private readonly logger = new Logger(CreatorService.name);

  constructor(private readonly tagsRepository: TagsRepository) {}

  public async create(payload: CreateTagDto): Promise<TagEntity> {
    try {
      const createdTag = await this.tagsRepository.create(payload);
      return new TagEntity(createdTag);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
