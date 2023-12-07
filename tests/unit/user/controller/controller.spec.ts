import { TestBed } from '@automock/jest';
import {
  CreatorService,
  FinderService,
  IndexerService,
  RemoverService,
} from '../../../../src/modules/users/services';
import { UsersController } from '../../../../src/modules/users/users.controller';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../../../src/modules/users/entities';
import {
  createUserPaginatedResponse,
  generatePasswordMock,
} from '../user.helper';
import { UpdaterService } from '../../../../src/modules/users/services/updater.service';

describe('User controller', () => {
  let controller: UsersController;
  let creatorService: jest.Mocked<CreatorService>;
  let finderService: jest.Mocked<FinderService>;
  let removerService: jest.Mocked<RemoverService>;
  let indexerService: jest.Mocked<IndexerService>;
  let updaterService: jest.Mocked<UpdaterService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();

    controller = unit;
    creatorService = unitRef.get(CreatorService);
    finderService = unitRef.get(FinderService);
    removerService = unitRef.get(RemoverService);
    indexerService = unitRef.get(IndexerService);
    updaterService = unitRef.get(UpdaterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create user', () => {
    it('should return a instance of a userEntity', async () => {
      const payload = { name: 'test', email: 'test@test.com', password: 'sla' };
      creatorService.create.mockResolvedValue(new UserEntity(payload));

      const response = await controller.create(payload);

      expect(response).toBeInstanceOf(UserEntity);
      expect(creatorService.create).toHaveBeenCalled();
      expect(creatorService.create).toHaveBeenCalledWith(payload);
    });

    it('should return a InternalServerErrorException', async () => {
      const payload = { name: 'test', email: 'test@test.com', password: 'sla' };

      creatorService.create.mockRejectedValue(
        new InternalServerErrorException(),
      );

      try {
        await controller.create(payload);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('find single user', () => {
    it('should return a instance of a userEntity', async () => {
      const id = generatePasswordMock();
      const requestPayload = { id };
      const payload = { name: 'test', email: 'test@test.com', password: 'sla' };
      finderService.findOne.mockResolvedValue(new UserEntity(payload));

      const response = await controller.findOne(requestPayload);

      expect(response).toBeInstanceOf(UserEntity);
      expect(finderService.findOne).toHaveBeenCalled();
      expect(finderService.findOne).toHaveBeenCalledWith(id);
    });

    it('should return a NotFoundException', async () => {
      const id = generatePasswordMock();
      const requestPayload = { id };
      finderService.findOne.mockRejectedValue(new NotFoundException());

      try {
        await controller.findOne(requestPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(finderService.findOne).toHaveBeenCalled();
        expect(finderService.findOne).toHaveBeenCalledWith(id);
      }
    });
  });

  describe('remove single user', () => {
    it('should return a instance of a userEntity', async () => {
      const id = generatePasswordMock();
      const requestPayload = { id };
      removerService.remove.mockResolvedValue({
        message: 'deleted user',
        id: id,
      });

      const response = await controller.remove(requestPayload);

      expect(response).toHaveProperty('id', id);
      expect(removerService.remove).toHaveBeenCalled();
      expect(removerService.remove).toHaveBeenCalledWith(id);
    });

    it('should return a notFoundError', async () => {
      const id = generatePasswordMock();
      const requestPayload = { id };

      removerService.remove.mockRejectedValue(new NotFoundException());

      try {
        await controller.remove(requestPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(removerService.remove).toHaveBeenCalled();
        expect(removerService.remove).toHaveBeenCalledWith(id);
      }
    });
  });

  describe('find multiple users', () => {
    it('should return a list of users', async () => {
      indexerService.index.mockResolvedValue(createUserPaginatedResponse());

      const response = await controller.findAll({});

      expect(indexerService.index).toHaveBeenCalled();
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('meta');
      expect(response.data).toBeInstanceOf(Array);
    });

    it('should return a certain page of the pagination', async () => {
      const page = 4;
      indexerService.index.mockResolvedValue(
        createUserPaginatedResponse({ currentPage: page }),
      );

      const response = await controller.findAll({
        limit: undefined,
        page,
      });

      expect(response).toHaveProperty('data');
      expect(indexerService.index).toHaveBeenCalledWith(undefined, page);
      expect(response).toHaveProperty('meta');
      expect(response.data).toBeInstanceOf(Array);
      expect(response.meta.currentPage).toBe(page);
    });

    it('should return a certain limit of the pagination', async () => {
      const limit = 4;
      indexerService.index.mockResolvedValue(
        createUserPaginatedResponse({ perPage: limit }),
      );

      const response = await controller.findAll({
        limit,
        page: undefined,
      });

      expect(response).toHaveProperty('data');
      expect(indexerService.index).toHaveBeenCalledWith(limit, undefined);
      expect(response).toHaveProperty('meta');
      expect(response.data).toBeInstanceOf(Array);
      expect(response.meta.perPage).toBe(limit);
    });
  });

  describe('update user', () => {
    it('should update a user', async () => {
      const updatePayload = {
        name: 'testando update',
      };
      const id = generatePasswordMock();

      updaterService.update.mockResolvedValue(
        new UserEntity({ ...updatePayload, id }),
      );

      const response = await controller.update(
        { id },
        { ...updatePayload, password: 'sla' },
      );

      expect(response).toBeInstanceOf(UserEntity);
      expect(response.name).toBe(updatePayload.name);
      expect(response.id).toBe(id);
      expect(updaterService.update).toHaveBeenCalled();
      expect(updaterService.update).toHaveBeenCalledWith(id, {
        ...updatePayload,
        password: 'sla',
      });
    });
    it('should return a NotFoundException', async () => {
      const updatePayload = {
        name: 'testando update',
      };
      const id = generatePasswordMock();

      updaterService.update.mockRejectedValue(new NotFoundException());

      try {
        await controller.update({ id }, { ...updatePayload, password: 'sla' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(updaterService.update).toHaveBeenCalled();
        expect(updaterService.update).toHaveBeenCalledWith(id, {
          ...updatePayload,
          password: 'sla',
        });
      }
    });
  });
});
