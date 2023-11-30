import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories';
import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';
import { UserEntity } from '../entities';

@Injectable()
export class FinderService {
  private readonly logger = new Logger(FinderService.name);

  constructor(private readonly userRepository: UserRepository) {}

  public async findOne(id: string): Promise<UserEntity> {
    try {
      const foundUser = await this.userRepository.findById(id);
      return new UserEntity(foundUser);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.NOT_FOUND
      )
        throw new NotFoundException(
          `could not find user with id: ${id}`,
          error.stack,
        );

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
