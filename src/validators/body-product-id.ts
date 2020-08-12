import Joi from 'joi';
import { ValidationError } from 'src/errors/validation-error';

import { validateProductId } from 'src/validators/joi-schemas';

export const validateBodyProductId = async (ctx, next) => {
  try {
    ctx.request.body.product = Joi.attempt(ctx.request.body, validateProductId);
  } catch (err) {
    throw new ValidationError('Body of product is invalid', err);
  }

  await next();
};
