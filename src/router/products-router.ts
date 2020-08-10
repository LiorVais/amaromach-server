import Router from 'koa-joi-router';
import JoiObjectId from 'joi-objectid';
import { Product } from '../models/product';
import logger from 'src/core/logger/Logger';
import { IProductDoc } from '../interfaces/IProductDoc';

const Joi = Router.Joi;
const joiObjectId = JoiObjectId(Joi);
export const productsRouter = Router();

productsRouter.get('/products', async (ctx, next) => {
  let products: IProductDoc[];

  try {
    products = await Product.find();
  } catch (err) {
    ctx.internalServerError(err);
    logger.warn('Failed to query products: ' + err);
  }

  if (products && products.length) {
    ctx.ok({ body: products });
  } else {
    ctx.notFound();
  }

  await next();
});

productsRouter.route({
  method: 'get',
  path: '/products/:id',
  validate: {
    params: {
      id: joiObjectId().required(),
    },
    failure: 400,
  },
  handler: async (ctx, next) => {
    let product: IProductDoc;

    try {
      product = await Product.findById(ctx.params.id);
    } catch (err) {
      ctx.internalServerError(err);
      logger.warn('Failed to query product: ' + err);
    }

    if (product) {
      ctx.ok({ body: product });
    } else {
      ctx.notFound();
    }

    await next();
  },
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
  handler: async (ctx, next) => {
    const { id } = ctx.params;
    try {
      const result = await Product.updateOne({ _id: id }, ctx.request.body.product);
      if (result.ok) {
        ctx.ok();
        logger.info(`Successfully updated id ${id}`);
      } else {
        ctx.notFound('Id not found');
        logger.warn(`Could not update id ${id}`);
      }
    } catch (err) {
      logger.warn(`Failed to update product id '${id}'`);
    }

    await next();
  },
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
  handler: async (ctx, next) => {
    try {
      const products = await Product.find()
        .where('_id')
        .in(ctx.request.body.products.map((product) => product.id))
        .exec();
      if (products && products.length) {
        await products.forEach((mongoProduct) => {
          Object.assign(
            mongoProduct,
            ctx.request.body.products.find((product) => mongoProduct._id == product.id),
          );

          return mongoProduct.save();
        });

        ctx.ok();
        logger.info(`Successfully updated ${products.length} products`);
      } else {
        ctx.notFound();
        logger.warn(`No products updated`);
      }
    } catch (err) {
      ctx.internalServerError(err);
      logger.warn(`Failed to update ${ctx.request.body.products.length} products`);
    }

    await next();
  },
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
        stock: Joi.when('isLimited', { is: true, then: Joi.number().required() }).allow(null),
      }),
    },
    type: 'json',
    failure: 400,
  },
  handler: async (ctx, next) => {
    let newProduct: IProductDoc;

    try {
      newProduct = await Product.create(ctx.request.body.product);
      ctx.created({ id: newProduct._id });
      logger.info(`Document created with id ${newProduct._id}`);
    } catch (err) {
      ctx.internalServerError(err);
      logger.warn('Failed to create product: ' + err);
    }

    await next();
  },
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
  handler: async (ctx, next) => {
    try {
      const result = await Product.deleteOne({ _id: ctx.request.body.id });
      if (result.ok && result.deletedCount) {
        ctx.ok();
        logger.info(`Product with id '${ctx.request.body.id}' deleted from mongo`);
      } else {
        ctx.notFound();
        logger.warn(`Could not find product id '${ctx.request.body.id}'`);
      }
    } catch (err) {
      ctx.internalServerError(err);
      logger.warn('Failed to delete product: ' + err);
    }

    await next();
  },
});
