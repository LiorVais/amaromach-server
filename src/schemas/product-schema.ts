import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../interfaces/IProduct';

const Product = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, required: true },
  isLimited: { type: String, required: true },
  stock: Number,
});

export const ProductSchema = mongoose.model<IProduct>('Product', Product);
