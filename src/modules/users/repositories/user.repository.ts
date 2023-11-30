import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/services/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string): Promise<User> {
    try {
      return await this.prismaService.user.findFirstOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async findAll(options?: Prisma.UserWhereInput): Promise<User[]> {
    try {
      return await this.prismaService.user.findMany({
        where: options,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    try {
      return this.prismaService.user.update({
        data,
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      return await this.prismaService.user.delete({ where });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }
}
