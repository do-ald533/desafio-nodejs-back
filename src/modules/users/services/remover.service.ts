import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories';
import { Prisma, User } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';

@Injectable()
export class RemoverService {
  private readonly logger = new Logger(RemoverService.name);

  constructor(private readonly userRepository: UserRepository) {}

  public async remove(id: string): Promise<User> {
    try {
      return await this.userRepository.delete({ id: id });
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
