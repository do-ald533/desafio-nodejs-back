import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories';
import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '../../../shared/enums';
import { FinderService } from './finder.service';

@Injectable()
export class RemoverService {
  private readonly logger = new Logger(RemoverService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly finderService: FinderService,
  ) {}

  public async remove(id: string): Promise<{ message: string; id: string }> {
    try {
      await this.finderService.findOne(id);
      const deletedUser = await this.userRepository.delete({ id: id });
      return { message: `deleted user`, id: deletedUser.id };
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
