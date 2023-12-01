import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserRepository } from '../repositories';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities';
import { PasswordUtils } from '../utils';

@Injectable()
export class CreatorService {
  private readonly logger = new Logger(CreatorService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordUtils: PasswordUtils,
  ) {}

  public async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      const { hashedPassword, salt } = this.passwordUtils.generatePassword(
        dto.password,
      );
      const createdUser = await this.userRepository.create({
        name: dto.name,
        email: dto.email,
        salt: salt,
        password_hash: hashedPassword,
      });
      return new UserEntity(createdUser);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
