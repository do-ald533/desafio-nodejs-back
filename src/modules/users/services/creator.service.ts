import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { randomBytes, createHash } from 'node:crypto';
import { UserRepository } from '../repositories';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreatorService {
  private readonly logger = new Logger(CreatorService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  private transformPassword(password: string): [string, string] {
    const saltSize = this.configService.get<number>('SALT_SIZE') || 4;
    const salt = randomBytes(saltSize).toString('hex');

    const concatPassword = salt + password;

    return [concatPassword, salt];
  }

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  public async create(dto: CreateUserDto): Promise<User> {
    try {
      const [concatPassword, salt] = this.transformPassword(dto.password);
      const hashedPassword = this.hashPassword(concatPassword);
      return await this.userRepository.create({
        name: dto.name,
        email: dto.email,
        salt: salt,
        password_hash: hashedPassword,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
