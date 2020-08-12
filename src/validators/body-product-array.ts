import Joi from 'joi';
import { ValidationError } from 'src/errors/validation-error';

import { validateProductArraySchema } from 'src/validators/joi-schemas';

export const validateBodyProductArray = async (ctx, next) => {
  try {
    ctx.request.body.products = Joi.attempt(ctx.request.body, validateProductArraySchema);
  } catch (err) {
    throw new ValidationError('Body of product is invalid', err);
  }

  await next();
};
