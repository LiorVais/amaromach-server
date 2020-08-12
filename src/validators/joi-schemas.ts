import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

const joiObjectId = JoiObjectId(Joi);

export const validateMongoIdSchema = joiObjectId().required();

export const validateProductId = Joi.object().keys({
  product: Joi.object().keys({
    id: validateMongoIdSchema,
  }),
});

const joiProductSchema = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string().optional(),
  price: Joi.number(),
  image: Joi.string(),
  isLimited: Joi.boolean(),
  stock: Joi.when('isLimited', { is: true, then: Joi.number().min(0).required(), otherwise: Joi.forbidden() }),
});

export const validateProductSchema = Joi.object().keys({
  product: joiProductSchema,
});

export const validateProductArraySchema = Joi.object().keys({
  products: Joi.array().items(joiProductSchema.append({ id: validateMongoIdSchema })),
});
