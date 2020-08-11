import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../interfaces/IProduct';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, required: true },
  isLimited: { type: String, required: true },
  stock: Number,
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
