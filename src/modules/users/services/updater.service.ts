import {
  Injectable,
  InternalServerErrorException,
  Logger,
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
      await this.finderService.findOne(id);

      const updatedUser = await this.userRepository.update({ id }, payload);
      return new UserEntity(updatedUser);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
