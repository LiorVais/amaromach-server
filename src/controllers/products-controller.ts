import { Document } from 'mongoose';
import { IProduct } from '../interfaces/IProduct';
import { Context } from 'koa';
import logger from '../core/logger/Logger';
import {
  findProductById,
  findProducts,
  createProduct,
  findAndDeleteProduct,
  findAndUpdateProduct,
  bulkUpdateProducts,
} from '../data/products-db';

export const getAllProducts = async (ctx: Context, next) => {
  let products: IProduct[];

  try {
    products = await findProducts();
  } catch (err) {
    ctx.internalServerError();
    logger.warn(`Failed to query products: ${JSON.stringify(err)}`);
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
    product = await findProductById(ctx.params.id);
  } catch (err) {
    ctx.internalServerError();
    logger.warn(`Failed to query product: ${JSON.stringify(err)}`);
  }

  if (product) {
    ctx.ok(product);
  } else {
    ctx.notFound();
  }

  await next();
};

export const addProduct = async (ctx, next) => {
  let newProduct: IProduct | Document;

  try {
    newProduct = await createProduct(ctx.request.body.product);
    ctx.created(newProduct);
    logger.info(`Document created with id ${newProduct._id}`);
  } catch (err) {
    ctx.internalServerError();
    logger.warn(`Failed to create product: ${JSON.stringify(err)}`);
  }

  await next();
};

export const updateProduct = async (ctx, next) => {
  const { id } = ctx.params;
  try {
    const updatedProduct = await findAndUpdateProduct(id, ctx.request.body.product);
    if (updatedProduct) {
      ctx.ok(updatedProduct);
      logger.info(`Successfully updated id ${id}`);
    } else {
      ctx.notFound('Id not found');
      logger.warn(`Could not update id ${id}`);
    }
  } catch (err) {
    ctx.internalServerError();
    logger.warn(`Failed to update product id '${id}': ${JSON.stringify(err)}`);
  }

  await next();
};

export const updateManyProducts = async (ctx, next) => {
  const { products } = ctx.request.body;

  try {
    const updatedDocuments = await bulkUpdateProducts(products);

    ctx.ok(updatedDocuments);
  } catch (err) {
    if (err === 404) {
      ctx.notFound();
    } else {
      ctx.internalServerError();
    }
  }

  await next();
};

export const deleteProduct = async (ctx, next) => {
  try {
    const deletedProduct = await findAndDeleteProduct(ctx.params.id);
    if (deletedProduct) {
      ctx.ok(deletedProduct);
      logger.info(`Product with id '${ctx.params.id}' deleted from mongo`);
    } else {
      ctx.notFound();
      logger.warn(`Could not find product id '${ctx.params.id}'`);
    }
  } catch (err) {
    ctx.internalServerError();
    logger.warn(`Failed to delete product: ${JSON.stringify(err)}`);
  }

  await next();
};
