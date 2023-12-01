import { TestBed } from '@automock/jest';
import { UserRepository } from '../../../../src/modules/users/repositories';
import { IndexerService } from '../../../../src/modules/users/services';
import { createUserPaginatedResponse } from './user.helper';

describe('User Indexer Service', () => {
  let service: IndexerService;
  let repository: jest.Mocked<UserRepository>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(IndexerService).compile();

    service = unit;
    repository = unitRef.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of users with no params', async () => {
    repository.findAll.mockResolvedValue(createUserPaginatedResponse());

    const response = await service.index();

    expect(repository.findAll).toHaveBeenCalled();
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('meta');
    expect(response.data).toBeInstanceOf(Array);
  });

  it('should return a certain page of users', async () => {
    const page = 4;

    repository.findAll.mockResolvedValue(
      createUserPaginatedResponse({ currentPage: page }),
    );

    const response = await service.index(undefined, page);

    expect(response).toHaveProperty('data');
    expect(repository.findAll).toHaveBeenCalledWith(undefined, page, undefined);
    expect(response).toHaveProperty('meta');
    expect(response.data).toBeInstanceOf(Array);
    expect(response.meta.currentPage).toBe(page);
  });

  it('should return a paginated response with limit', async () => {
    const limit = 4;

    repository.findAll.mockResolvedValue(
      createUserPaginatedResponse({ perPage: limit }),
    );

    const response = await service.index(limit);

    expect(response).toHaveProperty('data');
    expect(repository.findAll).toHaveBeenCalledWith(
      limit,
      undefined,
      undefined,
    );
    expect(response).toHaveProperty('meta');
    expect(response.data).toBeInstanceOf(Array);
    expect(response.meta.perPage).toBe(limit);
  });
});
