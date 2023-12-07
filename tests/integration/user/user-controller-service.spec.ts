import { Test } from '@nestjs/testing';
import { UsersController } from '../../../src/modules/users/users.controller';
import {
  CreatorService,
  FinderService,
  IndexerService,
  RemoverService,
} from '../../../src/modules/users/services';
import { UserRepository } from '../../../src/modules/users/repositories';
import {
  createDbPaginatedResponse,
  createDbResponse,
  createServiceResponse,
} from './user.helper';
import { UserEntity } from '../../../src/modules/users/entities';
import { PasswordUtils, UserUtils } from '../../../src/modules/users/utils';
import { PrismaService } from '../../../src/shared/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UpdaterService } from '../../../src/modules/users/services/updater.service';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('User Controller Service Flow', () => {
  let controller: UsersController;
  let prisma: PrismaService;
  let finderService: FinderService;
  let userRepository: UserRepository;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        CreatorService,
        UserRepository,
        PasswordUtils,
        PrismaService,
        ConfigService,
        FinderService,
        RemoverService,
        IndexerService,
        UpdaterService,
        UserUtils,
      ],
    }).compile();
    controller = moduleRef.get(UsersController);
    prisma = moduleRef.get(PrismaService);
    finderService = moduleRef.get(FinderService);
    userRepository = moduleRef.get(UserRepository);
  });

  describe('User Controller Creator service flow', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should create a user', async () => {
      const payload = {
        name: 'test',
        email: 'test@test.com',
        password: 'senha 123',
      };

      jest
        .spyOn(prisma.user, 'create')
        .mockResolvedValue(createDbResponse(payload));

      const response = await controller.create(payload);
      expect(response).toBeInstanceOf(UserEntity);
      expect(response.email).toBe(payload.email);
      expect(response.name).toBe(payload.name);
    });
  });

  describe('User Controller Finder service flow', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return a single user', async () => {
      const payload = { id: '123' };

      jest
        .spyOn(prisma.user, 'findFirstOrThrow')
        .mockResolvedValue(createDbResponse(payload));

      const response = await controller.findOne(payload);

      expect(response).toBeInstanceOf(UserEntity);
      expect(response.id).toBe(payload.id);
    });

    it('should return a NotFoundException', async () => {
      const payload = { id: '123' };

      jest.spyOn(prisma.user, 'findFirstOrThrow').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '5',
        }),
      );

      try {
        await controller.findOne(payload);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('User Controller Remover service flow', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should remove a user from the database', async () => {
      const payload = { id: '123' };
      jest
        .spyOn(finderService, 'findOne')
        .mockImplementationOnce(() =>
          Promise.resolve(createServiceResponse(payload)),
        );
      jest
        .spyOn(prisma.user, 'delete')
        .mockResolvedValue(createDbResponse(payload));

      const response = await controller.remove(payload);
      expect(response).toHaveProperty('message');
    });

    it('should return a NotFoundException', async () => {
      const payload = { id: '123' };
      jest
        .spyOn(finderService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      try {
        await controller.remove(payload);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('User Controller Indexer service flow', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return a list of users', async () => {
      const payload = {};
      jest
        .spyOn(userRepository, 'findAll')
        .mockResolvedValue(createDbPaginatedResponse());

      const response = await controller.findAll(payload);

      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('meta');
    });
  });
});
