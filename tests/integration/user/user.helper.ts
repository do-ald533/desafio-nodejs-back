import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { UserEntity } from '../../../src/modules/users/entities';
import { PaginatedResult } from 'prisma-pagination';

export function createDbResponse(payload?: any): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    salt: faker.string.hexadecimal(),
    password_hash: faker.string.hexadecimal(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    ...payload,
  };
}

export function createServiceResponse(payload?: any): UserEntity {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    salt: faker.string.hexadecimal(),
    password_hash: faker.string.hexadecimal(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    created_projects: [],
    projects: [],
    ...payload,
  };
}

export function createDbPaginatedResponse(
  payload?: any,
): PaginatedResult<UserEntity> {
  return {
    data: [createServiceResponse(), createServiceResponse()],
    meta: {
      total: 2,
      perPage: 2,
      next: 3,
      prev: 1,
      currentPage: 2,
      lastPage: 8,
    },
  };
}
