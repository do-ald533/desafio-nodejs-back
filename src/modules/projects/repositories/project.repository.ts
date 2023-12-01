import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/services/prisma.service';
import { Prisma, Project } from '@prisma/client';
import { ProjectEntity } from '../entities/project.entity';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ProjectRepository {
  private readonly logger = new Logger(ProjectRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  public async findById(projectId: string): Promise<Project> {
    try {
      const project = await this.prisma.project.findFirstOrThrow({
        where: { id: projectId },
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

  public async addUsers(data): Promise<{ message: string }> {
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

  public async removeUsers(data): Promise<{ message: string }> {
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

  public async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    try {
      const createdProject = await this.prisma.project.create({
        data,
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
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }

  public async remove(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
    try {
      return await this.prisma.project.delete({ where });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;

      this.logger.error(error);
      throw error;
    }
  }
}
