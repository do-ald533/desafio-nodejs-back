import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TagsRepository } from '../repositories';
import { TagEntity } from '../entities';
import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';

@Injectable()
export class RemoverService {
  private readonly logger = new Logger(RemoverService.name);

  constructor(private readonly tagsRepository: TagsRepository) {}

  public async remove(id: string): Promise<TagEntity> {
    try {
      const removedTag = await this.tagsRepository.remove(id);
      return new TagEntity(removedTag);
    } catch (error) {
      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === PrismaErrorCodes.NOT_FOUND) ||
        error instanceof NotFoundException
      )
        throw new NotFoundException(
          `could not find user with id: ${id}`,
          error.message,
        );

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
