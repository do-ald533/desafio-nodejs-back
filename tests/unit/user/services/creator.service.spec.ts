import { CreatorService } from '../../../../src/modules/users/services';
import { UserRepository } from '../../../../src/modules/users/repositories';
import { createUserPayload, createUserResponse } from './user.helper';
import { TestBed } from '@automock/jest';
import { PasswordUtils } from '../../../../src/modules/users/utils';
import { UserEntity } from '../../../../src/modules/users/entities';

describe('User CreatorService', () => {
  let service: CreatorService;
  let repository: jest.Mocked<UserRepository>;
  let passwordUtil: jest.Mocked<PasswordUtils>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(CreatorService).compile();

    service = unit;
    repository = unitRef.get(UserRepository);
    passwordUtil = unitRef.get(PasswordUtils);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const userPayload = createUserPayload();
    passwordUtil.generatePassword.mockReturnValue({
      salt: '',
      hashedPassword: '',
    });
    repository.create.mockResolvedValue(
      createUserResponse({ email: userPayload.email, name: userPayload.name }),
    );

    const userResponse = await service.create(userPayload);

    expect(userPayload.name).toBe(userResponse.name);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(userResponse).toBeInstanceOf(UserEntity);
    expect(userResponse).not.toHaveProperty('password');
  });
});
