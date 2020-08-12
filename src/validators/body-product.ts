import Joi from 'joi';
import { ValidationError } from 'src/errors/validation-error';

import { validateProductSchema } from 'src/validators/joi-schemas';

export const validateBodyProduct = (options = {}) => async (ctx, next) => {
  try {
    ctx.request.body = Joi.attempt(ctx.request.body, validateProductSchema, options);
  } catch (err) {
    throw new ValidationError('Body of product is invalid', err);
  }

  await next();
};
