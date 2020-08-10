import mongoose, { Document } from 'mongoose';

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isLimited?: boolean;
  stock?: number;
}

export interface IProductDoc extends Document, IProduct {}
