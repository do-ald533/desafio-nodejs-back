import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../../../../src/modules/users/dtos';
import { validate } from 'class-validator';

describe('CreateUserDto', () => {
  it('should NOT return a error', async () => {
    const payload = { name: 'test', email: 'test@test.com', password: 'sla' };
    const createUserDto = plainToInstance(CreateUserDto, payload);
    const errors = await validate(createUserDto);

    expect(errors.length).toBe(0);
  });

  it.each([
    { value: '', propertyError: 'isNotEmpty' },
    { value: 1, propertyError: 'isString' },
  ])(
    'should return a error because of invalid name',
    async ({ value, propertyError }) => {
      const payload = { name: value, email: 'test@test.com', password: 'sla' };
      const createUserDto = plainToInstance(CreateUserDto, payload);
      const errors = await validate(createUserDto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty(propertyError);
      expect(errors[0].property).toBe('name');
    },
  );

  it.each([
    { value: '', propertyError: 'isNotEmpty' },
    { value: 1, propertyError: 'isString' },
    { value: 'test', propertyError: 'isEmail' },
  ])(
    'should return a error because of invalid email',
    async ({ value, propertyError }) => {
      const payload = { name: 'test', email: value, password: 'sla' };
      const createUserDto = plainToInstance(CreateUserDto, payload);
      const errors = await validate(createUserDto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty(propertyError);
      expect(errors[0].property).toBe('email');
    },
  );

  it.each([
    { value: '', propertyError: 'isNotEmpty' },
    { value: 1, propertyError: 'isString' },
  ])(
    'should return a error because of invalid password',
    async ({ value, propertyError }) => {
      const payload = { name: 'test', email: 'test@test.com', password: value };
      const createUserDto = plainToInstance(CreateUserDto, payload);
      const errors = await validate(createUserDto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty(propertyError);
      expect(errors[0].property).toBe('password');
    },
  );
});
