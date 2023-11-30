import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../repositories';

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);

  constructor(private readonly userRepository: UserRepository) {}

  public async index(where: Prisma.UserWhereInput): Promise<User[]> {
    try {
      return await this.userRepository.findAll(where);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
