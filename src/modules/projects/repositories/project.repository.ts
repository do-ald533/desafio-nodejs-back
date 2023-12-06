import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/services/prisma.service';
import { Prisma, Project } from '@prisma/client';
import { ProjectEntity } from '../entities/project.entity';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ProjectRepository {
  private readonly logger = new Logger(ProjectRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  public async findById(projectId: string) {
    try {
      const project = await this.prisma.project.findFirstOrThrow({
        where: { id: projectId },
        include: {
          creator: true,
          members: true,
          tasks: true,
        },
      });
      return project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async findAll(
    limit: number,
    page: number,
    options?: Prisma.ProjectWhereInput,
  ) {
    try {
      const paginate = createPaginator({ perPage: limit });

      return await paginate<ProjectEntity, Prisma.ProjectFindManyArgs>(
        this.prisma.project,
        {
          where: options,
          include: {
            creator: true,
            members: true,
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

  public async addUsers(
    data: Array<Prisma.UserProjectUncheckedCreateInput>,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.userProject.createMany({ data });
      return {
        message: 'Users added successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async removeUsers(
    data: Array<Prisma.UserProjectWhereInput>,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.userProject.deleteMany({
        where: {
          OR: data,
        },
      });
      return { message: 'removed users successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async create(
    data: Prisma.ProjectUncheckedCreateInput,
  ): Promise<Project> {
    try {
      const createdProject = await this.prisma.project.create({
        data,
        include: {
          creator: true,
          members: true,
          tasks: true,
        },
      });
      return createdProject;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async update(
    where: Prisma.ProjectWhereUniqueInput,
    data: Prisma.ProjectUpdateInput,
  ): Promise<Project> {
    try {
      return await this.prisma.project.update({
        data,
        where,
        include: {
          creator: true,
          members: true,
          tasks: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async remove(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
    try {
      return await this.prisma.project.delete({
        where,
        include: {
          creator: true,
          members: true,
          tasks: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }
}
