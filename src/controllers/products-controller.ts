import { Product } from 'src/models/product';
import { IProduct } from '../interfaces/IProduct';
import { Context } from 'koa';
import logger from '../core/logger/Logger';

export const getAllProducts = async (ctx: Context, next) => {
  let products: IProduct[];

  try {
    products = await Product.find();
  } catch (err) {
    logger.warn('Failed to query products: ' + err);
    ctx.internalServerError(err);
  }

  if (products && products.length) {
    ctx.ok(products);
  } else {
    ctx.notFound();
  }

  await next();
};

export const getProduct = async (ctx: Context, next) => {
    let product: IProduct;

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
  };

export const addProduct = async (ctx, next) => {
    let newProduct: IProduct;

    try {
      newProduct = await Product.create(ctx.request.body.product);
      ctx.created({ id: newProduct._id });
      logger.info(`Document created with id ${newProduct._id}`);
    } catch (err) {
      ctx.internalServerError(err);
      logger.warn('Failed to create product: ' + err);
    }

    await next();
  };

export const updateProduct = async (ctx, next) => {
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
};

export const updateManyProducts = async (ctx, next) => {
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
};

export const deleteProduct = async (ctx, next) => {
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
};
