import { TestBed } from '@automock/jest';
import { UserRepository } from '../../../../src/modules/users/repositories';
import { createUserResponse } from '../user.helper';
import { UpdaterService } from '../../../../src/modules/users/services/updater.service';
import { FinderService } from '../../../../src/modules/users/services';
import { UserUtils } from '../../../../src/modules/users/utils';
import { NotFoundException } from '@nestjs/common';

describe('User Updater Service', () => {
  let service: UpdaterService;
  let repository: jest.Mocked<UserRepository>;
  let finderService: jest.Mocked<FinderService>;
  let userUtils: jest.Mocked<UserUtils>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UpdaterService).compile();

    service = unit;
    repository = unitRef.get(UserRepository);
    finderService = unitRef.get(FinderService);
    userUtils = unitRef.get(UserUtils);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should rupdate a user', async () => {
    const updatePayload = {
      name: 'testando',
      email: 'ola@mundo',
      password: 'senha',
    };
    const user = createUserResponse();
    const foundUser = finderService.findOne.mockResolvedValue(user);
    userUtils.verifyUser.mockReturnValue(true);

    const foundUserData = await foundUser('sla');

    repository.update.mockResolvedValue(
      createUserResponse({
        name: updatePayload.name,
        email: updatePayload.email,
      }),
    );
    const response = await service.update(user.id, updatePayload);

    expect(response.name).toEqual(updatePayload.name);
    expect(response.email).toEqual(updatePayload.email);
    expect(response.name).not.toEqual(foundUserData.name);
    expect(response.name).not.toEqual(foundUserData.email);
    expect(repository.update).toHaveBeenCalledWith(
      { id: foundUserData.id },
      updatePayload,
    );
    expect(finderService.findOne).toHaveBeenCalled();
    expect(userUtils.verifyUser).toHaveBeenCalled();
  });

  it('should return a not found error', async () => {
    const updatePayload = {
      name: 'testando',
      email: 'ola@mundo',
      password: 'senha',
    };
    finderService.findOne.mockRejectedValue(new NotFoundException());

    try {
      await service.update('...', updatePayload);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
