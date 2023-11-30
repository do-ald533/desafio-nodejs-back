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
export class RemoverService {
  private readonly logger = new Logger(RemoverService.name);

  constructor(private readonly userRepository: UserRepository) {}

  public async remove(id: string): Promise<UserEntity> {
    try {
      const deletedUser = await this.userRepository.delete({ id: id });
      return new UserEntity(deletedUser);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.NOT_FOUND
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
