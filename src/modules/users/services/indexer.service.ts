import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PaginatedResult } from 'prisma-pagination';
import { Prisma } from '@prisma/client';
import { UserRepository } from '../repositories';
import { UserEntity } from '../entities';

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);

  constructor(private readonly userRepository: UserRepository) {}

  public async index(
    limit: number,
    page: number,
    where?: Prisma.UserWhereInput,
  ): Promise<PaginatedResult<UserEntity>> {
    try {
      const result = await this.userRepository.findAll(limit, page, where);
      const data = result.data.map((data) => new UserEntity(data));
      const serializedResult = { ...result, data };
      return serializedResult;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
