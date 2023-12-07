import { TestBed } from '@automock/jest';
import { PasswordUtils } from '../../../../src/modules/users/utils';
import { ConfigService } from '@nestjs/config';

describe('PasswordUtils', () => {
  let utils: PasswordUtils;
  let config: jest.Mocked<ConfigService>;
  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(PasswordUtils).compile();

    utils = unit;
    config = unitRef.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a password', () => {
    const saltSize = 4;
    config.get.mockReturnValue(saltSize);

    const password = utils.generatePassword('test123');

    expect(password).toBeInstanceOf(Object);
    expect(password.salt.length).toBe(saltSize * 2);
    expect(password.hashedPassword).toBeDefined();
  });

  it('should return true for verified password', () => {
    const saltSize = 4;
    config.get.mockReturnValue(saltSize);

    const { hashedPassword, salt } = utils.generatePassword('test123');

    const returnValue = utils.verifyPassword('test123', salt, hashedPassword);

    expect(returnValue).toBe(true);
  });
});
