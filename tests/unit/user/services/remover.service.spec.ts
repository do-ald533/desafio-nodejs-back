import { TestBed } from '@automock/jest';
import { UserRepository } from '../../../../src/modules/users/repositories';
import {
  FinderService,
  RemoverService,
} from '../../../../src/modules/users/services';
import { createUserResponse } from '../user.helper';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('User Remover Service', () => {
  let service: RemoverService;
  let repository: jest.Mocked<UserRepository>;
  let finderService: jest.Mocked<FinderService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(RemoverService).compile();

    service = unit;
    repository = unitRef.get(UserRepository);
    finderService = unitRef.get(FinderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user', async () => {
    const id = faker.string.uuid();
    const foundUser = finderService.findOne.mockResolvedValue(
      createUserResponse({ id }),
    );

    repository.delete.mockResolvedValue(foundUser(id));

    const response = await service.remove(id);

    expect(response.id).toBe(id);
    expect(finderService.findOne).toHaveBeenCalledWith(id);
  });

  it('should fail to delete a user throwing a not found exception', async () => {
    finderService.findOne.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '5',
      }),
    );

    try {
      await service.remove('...');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
