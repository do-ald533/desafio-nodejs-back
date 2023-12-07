import { plainToInstance } from 'class-transformer';
import { ListAllDto } from '../../../../src/modules/users/dtos';
import { validate } from 'class-validator';

describe('ListAllDto', () => {
  it('should NOT return a error if payload is empty', async () => {
    const payload = {};

    const listAllDto = plainToInstance(ListAllDto, payload);
    const errors = await validate(listAllDto);
    expect(errors.length).toBe(0);
  });

  it.each([
    { attribute: 'page', value: '5' },
    { attribute: 'limit', value: 5 },
  ])(
    'should NOT return a error if only one attribute is defined',
    async ({ attribute, value }) => {
      const payload = { [attribute]: value };

      const listAllDto = plainToInstance(ListAllDto, payload);
      const errors = await validate(listAllDto);
      expect(errors.length).toBe(0);
    },
  );

  it.each([
    {
      attribute: 'page',
      value: 'teste',
      propertyError: 'isInt',
    },
    { attribute: 'page', value: 0, propertyError: 'min' },
    { attribute: 'limit', value: 150, propertyError: 'max' },
    { attribute: 'limit', value: 0, propertyError: 'min' },
    { attribute: 'limit', value: 'teste', propertyError: 'isInt' },
  ])(
    'should return a error if attribute contains invalid value',
    async ({ attribute, value, propertyError }) => {
      const payload = { [attribute]: value };

      const listAllDto = plainToInstance(ListAllDto, payload);
      const errors = await validate(listAllDto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe(attribute);
      expect(errors[0].constraints).toHaveProperty(propertyError);
    },
  );
});
