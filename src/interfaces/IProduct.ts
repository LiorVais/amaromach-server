export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isLimited: boolean;
  stock?: number;
}
