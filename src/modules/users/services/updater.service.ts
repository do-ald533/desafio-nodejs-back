import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories';
import { FinderService } from './finder.service';
import { UpdateUserDto } from '../dtos';
import { UserUtils } from '../utils/user.utils';
import { UserEntity } from '../entities';

@Injectable()
export class UpdaterService {
  private readonly logger = new Logger(UpdaterService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly finderService: FinderService,
    private readonly userUtils: UserUtils,
  ) {}
  public async update(id: string, payload: UpdateUserDto) {
    try {
      const foundUser = await this.finderService.findOne(id);

      if (!this.userUtils.verifyUser(foundUser, payload.password))
        throw new BadRequestException({ message: 'passwords dont match' });
      const updatedUser = await this.userRepository.update({ id }, payload);

      return new UserEntity(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);

      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
