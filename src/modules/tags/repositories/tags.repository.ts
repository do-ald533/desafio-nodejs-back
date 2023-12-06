import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from '../../../shared/services/prisma.service';
import { createPaginator } from 'prisma-pagination';
import { TagEntity } from '../entities/tag.entity';

@Injectable()
export class TagsRepository {
  private readonly logger = new Logger(TagsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  public async create(data: Prisma.TagCreateInput): Promise<Tag> {
    try {
      return await this.prisma.tag.create({
        data,
        include: {
          tasks: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Tag> {
    try {
      return await this.prisma.tag.findFirstOrThrow({
        where: { id },
        include: { tasks: true },
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
    options: Prisma.TagWhereInput,
  ) {
    try {
      const paginate = createPaginator({ perPage: limit });

      return await paginate<TagEntity, Prisma.TagFindManyArgs>(
        this.prisma.tag,
        {
          where: options,
          include: {
            tasks: true,
          },
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

  public async update(id: string, data: Prisma.TagUpdateInput) {
    try {
      return await this.prisma.tag.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async remove(id: string) {
    try {
      return await this.prisma.tag.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }
}
