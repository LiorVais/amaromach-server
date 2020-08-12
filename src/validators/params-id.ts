import Joi from 'joi';
import { ValidationError } from 'src/errors/validation-error';

import { validateMongoIdSchema } from 'src/validators/joi-schemas';

export const validateParamsId = async (ctx, next) => {
  try {
    ctx.params.id = Joi.attempt(ctx.params.id, validateMongoIdSchema);
  } catch (err) {
    throw new ValidationError('Parameters Id is invalid', err);
  }

  await next(ctx, next);
};
