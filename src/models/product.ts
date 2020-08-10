import mongoose, { Schema } from 'mongoose';
import { IProductDoc } from '../interfaces/IProductDoc';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, required: true },
  isLimited: { type: String, required: true },
  stock: Number,
});

export const Product = mongoose.model<IProductDoc>('Product', ProductSchema);
