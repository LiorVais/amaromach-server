import { ProductSchema } from '../schemas/product-schema';
import { IProduct } from '../interfaces/IProduct';

export const findProducts = () => ProductSchema.find();

export const findProductById = (id: string) => ProductSchema.findById(id);

export const createProduct = (product: IProduct) => ProductSchema.create(product);

export const findAndUpdateProduct = (id: string, product: IProduct) =>
  ProductSchema.findOneAndUpdate(id, product, { new: true });

export const findAndDeleteProduct = (id: string) => ProductSchema.findOneAndDelete(id);
