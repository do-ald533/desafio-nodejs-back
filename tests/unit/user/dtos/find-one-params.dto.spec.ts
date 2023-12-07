import { randomUUID } from 'node:crypto';
import { FindOneParams } from '../../../../src/modules/users/dtos';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('FindOneParamsDto', () => {
  it('should NOT return a error', async () => {
    const payload = { id: randomUUID() };

    const findOneParamsDto = plainToInstance(FindOneParams, payload);
    const errors = await validate(findOneParamsDto);

    expect(errors.length).toBe(0);
  });

  it.each([
    { value: '', propertyError: 'isNotEmpty' },
    { value: 5, propertyError: 'isString' },
    { value: 'test', propertyError: 'isUuid' },
  ])(
    'should return a error for invalid id value',
    async ({ propertyError, value }) => {
      const payload = { id: value };

      const findOneParamsDto = plainToInstance(FindOneParams, payload);
      const errors = await validate(findOneParamsDto);

      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty(propertyError);
      expect(errors[0].property).toBe('id');
    },
  );
});
