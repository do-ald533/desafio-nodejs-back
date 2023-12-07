import { TestBed } from '@automock/jest';
import { UserRepository } from '../../../../src/modules/users/repositories';
import { PrismaService } from '../../../../src/shared/services/prisma.service';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: jest.MockedObjectDeep<PrismaService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserRepository)
      .mock(PrismaService)
      .using({
        user: {
          create: jest.fn(),
          delete: jest.fn(),
          update: jest.fn(),
          findFirstOrThrow: jest.fn(),
        },
      })
      .compile();

    repository = unit;
    prisma = unitRef.get(PrismaService) as jest.MockedObjectDeep<PrismaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const payload = {
      name: 'test',
      password_hash: 'sla',
      salt: 'sla2',
      email: 'test@test.com',
    };
    prisma.user.create.mockResolvedValue({
      ...payload,
      id: 'aaabbbccc',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await repository.create(payload);

    expect(response).toHaveProperty('id');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('should get signle user from db', async () => {
    const payloadDb = {
      name: 'test',
      password_hash: 'sla',
      salt: 'sla2',
      email: 'test@test.com',
    };
    prisma.user.findFirstOrThrow.mockResolvedValue({
      ...payloadDb,
      id: 'aaabbbccc',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await repository.findById('123');
    expect(response).toHaveProperty('id');
    expect(prisma.user.findFirstOrThrow).toHaveBeenCalled();
  });
});
