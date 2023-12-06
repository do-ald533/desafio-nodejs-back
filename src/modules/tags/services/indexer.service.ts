import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TagsRepository } from '../repositories';
import { Prisma } from '@prisma/client';
import { TagEntity } from '../entities';

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);

  constructor(private readonly tagsRepository: TagsRepository) {}

  public async findAll(
    limit?: number,
    page?: number,
    where?: Prisma.TagWhereInput,
  ) {
    try {
      const foundTags = await this.tagsRepository.findAll(limit, page, where);
      const data = foundTags.data.map((data) => new TagEntity(data));
      const serializedResults = { ...foundTags, data };
      return serializedResults;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
