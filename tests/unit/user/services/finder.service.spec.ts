import { TestBed } from '@automock/jest';
import { UserRepository } from '../../../../src/modules/users/repositories';
import { FinderService } from '../../../../src/modules/users/services';
import { createUserResponse, generatePasswordMock } from '../user.helper';
import { UserEntity } from '../../../../src/modules/users/entities';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('User Finder Service', () => {
  let service: FinderService;
  let repository: jest.Mocked<UserRepository>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(FinderService).compile();

    service = unit;
    repository = unitRef.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a single user', async () => {
    const id = generatePasswordMock();

    repository.findById.mockResolvedValue(createUserResponse({ id: id }));

    const response = await service.findOne(id);

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(id);
    expect(response).toBeInstanceOf(UserEntity);
    expect(response.id).toEqual(id);
  });

  it('should throw a NotFoundException error', async () => {
    repository.findById.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '5',
      }),
    );

    try {
      await service.findOne('...');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
