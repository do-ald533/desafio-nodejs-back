import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateUserDto } from '../../../../src/modules/users/dtos';

describe('UpdateUserDTO', () => {
  it('should NOT return a error if only the password is defined', async () => {
    const payload = { password: 'sla' };

    const updateUserDto = plainToInstance(UpdateUserDto, payload);
    const errors = await validate(updateUserDto);
    expect(errors.length).toBe(0);
  });

  it('should not return a error if all attributes are defined', async () => {
    const payload = { password: 'sla', name: 'test', email: 'test@test.com' };

    const updateUserDto = plainToInstance(UpdateUserDto, payload);
    const errors = await validate(updateUserDto);
    expect(errors.length).toBe(0);
  });

  it.each([
    {
      payload: { password: 'sla', name: '', email: 'test@test.com' },
      property: 'name',
      propertyError: 'isNotEmpty',
    },
    {
      payload: { password: 'sla', name: 5, email: 'test@test.com' },
      property: 'name',
      propertyError: 'isString',
    },
    {
      payload: { password: 'sla', name: 'test', email: '' },
      property: 'email',
      propertyError: 'isNotEmpty',
    },
    {
      payload: { password: 'sla', name: 'test', email: 'test' },
      property: 'email',
      propertyError: 'isEmail',
    },
    {
      payload: { password: 'sla', name: 'test', email: 5 },
      property: 'email',
      propertyError: 'isString',
    },
    {
      payload: { password: '', name: 'test', email: 'test@test.com' },
      property: 'password',
      propertyError: 'isNotEmpty',
    },
  ])(
    'should return a error for invalid payload',
    async ({ payload, property, propertyError }) => {
      const updateUserDto = plainToInstance(UpdateUserDto, payload);
      const errors = await validate(updateUserDto);
      console.log(errors);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe(property);
      expect(errors[0].constraints).toHaveProperty(propertyError);
    },
  );
});
