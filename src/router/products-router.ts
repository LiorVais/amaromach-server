import Router from 'koa-joi-router';
import JoiObjectId from 'joi-objectid';
import {
  addProduct, deleteProduct,
  getAllProducts,
  getProduct,
  updateManyProducts,
  updateProduct
} from '../controllers/products-controller';

const Joi = Router.Joi;
const joiObjectId = JoiObjectId(Joi);
export const productsRouter = Router();

productsRouter.get('/products', getAllProducts);

productsRouter.route({
  method: 'get',
  path: '/products/:id',
  validate: {
    params: {
      id: joiObjectId().required(),
    },
    failure: 400,
  },
  handler: getProduct
});

productsRouter.route({
  method: 'put',
  path: '/products/:id',
  validate: {
    params: {
      id: joiObjectId().required(),
    },
    body: {
      product: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        image: Joi.string(),
        isLimited: Joi.boolean(),
        stock: Joi.when('isLimited', { is: true, then: Joi.number().required() }),
      }),
    },
    type: 'json',
    failure: 400,
  },
  handler: updateProduct
});

productsRouter.route({
  method: 'put',
  path: '/products',
  validate: {
    body: {
      products: Joi.array().items(
        Joi.object().keys({
          id: joiObjectId().required(),
          name: Joi.string(),
          description: Joi.string(),
          price: Joi.number(),
          image: Joi.string(),
          isLimited: Joi.boolean(),
          stock: Joi.when('isLimited', { is: true, then: Joi.number().required() }),
        }),
      ),
    },
    type: 'json',
    failure: 400,
  },
  handler: updateManyProducts
});

productsRouter.route({
  method: 'post',
  path: '/products',
  validate: {
    body: {
      product: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().required(),
        image: Joi.string().required(),
        isLimited: Joi.boolean().required(),
        stock: Joi.when('isLimited', {is: true, then: Joi.number().required()}),
      }),
    },
    type: 'json',
    failure: 400,
  },
  handler: addProduct
});

productsRouter.route({
  method: 'delete',
  path: '/products',
  validate: {
    body: {
      id: joiObjectId().required(),
    },
    type: 'json',
    failure: 400,
  },
  handler: deleteProduct
});
