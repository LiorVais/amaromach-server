import Router from 'koa-joi-router';
import { validateMongoIdSchema, validateProductSchema } from 'src/validators/joi-schemas';

import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateManyProducts,
  updateProduct,
} from '../controllers/products-controller';

import { validateParamsId } from 'src/validators/params-id';
import { validateBodyProduct } from '../validators/body-product';
import { validateBodyProductArray } from '../validators/body-product-array';
import { validateBodyProductId } from '../validators/body-product-id';

const Joi = Router.Joi;
export const productsRouter = Router();

productsRouter.get('/products', getAllProducts);

productsRouter.get('/products/:id', validateParamsId, getProduct);

productsRouter.put('/products/:id', validateParamsId, validateBodyProduct(), updateProduct);

productsRouter.put('/products', validateBodyProductArray, updateManyProducts);

productsRouter.post('/products', validateBodyProduct({ presence: 'required' }), addProduct);

productsRouter.delete('/products/:id', validateParamsId, deleteProduct);
