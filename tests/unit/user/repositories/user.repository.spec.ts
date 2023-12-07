import { TestBed } from '@automock/jest';
import { UserRepository } from '../../../../src/modules/users/repositories';
import { PrismaService } from '../../../../src/shared/services/prisma.service';
import { createUserPayload, createUserResponse } from '../user.helper';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: jest.Mocked<PrismaService>;
  const { name, email } = createUserPayload();

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserRepository)
      .mock(PrismaService)
      .using({
        user: {
          create: jest
            .fn()
            .mockResolvedValue(createUserResponse({ name, email })),
          update: jest.fn(),
          findFirstOrThrow: jest.fn(),
          delete: jest.fn(),
        },
      })
      .compile();

    repository = unit;
    prisma = unitRef.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user in db', async () => {
    const response = await repository.create({
      password_hash: '',
      salt: '',
      name,
      email,
    });

    expect(prisma.user.create).toHaveBeenCalled();
    expect(response.name).toBe(name);
    expect(response.email).toBe(email);
  });
});
