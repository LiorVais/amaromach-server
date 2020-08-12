import { ProductSchema } from '../schemas/product-schema';
import { IProduct } from '../interfaces/IProduct';

export const findProducts = () => ProductSchema.find();

export const findProductById = (id: string) => ProductSchema.findById(id);

export const createProduct = (product: IProduct) => ProductSchema.create(product);

export const findAndUpdateProduct = (id: string, product: IProduct) =>
  ProductSchema.findOneAndUpdate(id, product, { new: true });

export const bulkUpdateProducts = async (products: IProduct[]) => {
  const bulkWriteData = products.map((product: IProduct) => {
    const { id, ...updateData } = product;
    return {
      updateOne: {
        filter: { _id: id },
        update: {
          $set: updateData,
        },
      },
    };
  });
  const session = await ProductSchema.startSession();

  await session.withTransaction(async () => {
    const result = await ProductSchema.bulkWrite(bulkWriteData, { session: session });
    if (result.matchedCount !== products.length) throw 404;
  });

  session.endSession();

  return ProductSchema.find()
    .where('_id')
    .in(products.map((product: IProduct) => product.id))
    .exec();
};

export const findAndDeleteProduct = (id: string) => ProductSchema.findOneAndDelete(id);
