import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/services/prisma.service';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { TaskEntity } from '../entities';

@Injectable()
export class TasksRepository {
  private readonly logger = new Logger(TasksRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: Prisma.TaskUncheckedCreateInput) {
    try {
      return await this.prisma.task.create({
        data,
        include: { project: true, tags: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async findById(taskId: string) {
    try {
      return await this.prisma.task.findFirstOrThrow({ where: { id: taskId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async findAll(
    limit: number,
    page: number,
    options?: Prisma.TaskWhereInput,
  ) {
    try {
      const paginate = createPaginator({ perPage: limit });

      return await paginate<TaskEntity, Prisma.TaskFindManyArgs>(
        this.prisma.task,
        {
          where: options,
          include: {
            project: true,
            tags: true,
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

  public async addTags(data: Array<Prisma.TagsTaskUncheckedCreateInput>) {
    try {
      await this.prisma.tagsTask.createMany({ data });
      return {
        message: 'Tags added succesfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async removeTags(data: Array<Prisma.TagsTaskUncheckedCreateInput>) {
    try {
      await this.prisma.tagsTask.deleteMany({
        where: {
          OR: data,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async update(
    where: Prisma.TaskWhereUniqueInput,
    data: Prisma.TaskUpdateInput,
  ) {
    try {
      return await this.prisma.task.update({
        data,
        where,
        include: {
          project: true,
          tags: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async remove(where: Prisma.TaskWhereUniqueInput) {
    try {
      return await this.prisma.task.delete({
        where,
        include: {
          project: true,
          tags: true,
        },
      });
    } catch (error) {}
  }
}
