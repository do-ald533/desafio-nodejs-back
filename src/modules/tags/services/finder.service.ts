import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TagsRepository } from '../repositories';
import { TagEntity } from '../entities/';
import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';

@Injectable()
export class FinderService {
  private readonly logger = new Logger(FinderService.name);

  constructor(private readonly tagsRepository: TagsRepository) {}

  public async findById(id: string): Promise<TagEntity> {
    try {
      const foundTag = await this.tagsRepository.findById(id);
      return new TagEntity(foundTag);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.NOT_FOUND
      )
        throw new NotFoundException(
          `could not find tag with id: ${id}`,
          error.message,
        );

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
