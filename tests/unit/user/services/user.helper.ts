import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../../../../src/modules/users/dtos';
import { User } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { UserEntity } from '../../../../src/modules/users/entities';

export function createUserPayload(dto?: Partial<CreateUserDto>): CreateUserDto {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.lorem.word(),
    ...dto,
  };
}

const id = faker.string.uuid();
const email = faker.internet.email();
const name = faker.person.fullName();

export function createUserResponse(payload?: any): UserEntity {
  return {
    id: id,
    email: email,
    name: name,
    salt: faker.string.hexadecimal(),
    password_hash: faker.string.hexadecimal(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    ...payload,
  };
}

export function createUserPaginatedResponse(
  payload?: any,
): PaginatedResult<UserEntity> {
  return {
    data: [createUserResponse(), createUserResponse(), createUserResponse()],
    meta: {
      total: 3,
      perPage: 3,
      currentPage: 2,
      lastPage: 5,
      next: 2,
      prev: 1,
      ...payload,
    },
  };
}

export function generatePasswordMock(payload?: string): string {
  return payload ? payload : faker.string.hexadecimal();
}

export const passwordUtilsMock = {
  generatePassword: (password?: string) =>
    jest.fn().mockReturnValue(generatePasswordMock(password)),
};
