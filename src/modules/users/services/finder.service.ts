import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories';
import { FindOneParams } from '../dto/find-one-params.dto';
import { User, Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';

@Injectable()
export class FinderService {
  private readonly logger = new Logger(FinderService.name);

  constructor(private readonly userRepository: UserRepository) {}

  public async findOne(dto: FindOneParams): Promise<User> {
    try {
      return await this.userRepository.findById(dto.id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.NOT_FOUND
      )
        throw new NotFoundException(
          `could not find user with id: ${dto.id}`,
          error.stack,
        );

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
