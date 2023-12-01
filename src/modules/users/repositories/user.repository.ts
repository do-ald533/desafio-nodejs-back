import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/services/prisma.service';
import { User, Prisma } from '@prisma/client';
import { PaginatedResult, createPaginator } from 'prisma-pagination';
import { UserEntity } from '../entities';

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

  public async findAll(
    limit: number,
    page: number,
    options?: Prisma.UserWhereInput,
  ): Promise<PaginatedResult<UserEntity>> {
    try {
      const paginate = createPaginator({ perPage: limit });

      return await paginate<UserEntity, Prisma.UserFindManyArgs>(
        this.prismaService.user,
        {
          where: options,
        },
        {
          page,
        },
      );
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
      return await this.prismaService.user.update({
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
