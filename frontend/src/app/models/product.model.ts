export interface Product {
  id: number;
  description?: string;
  characteristics?: object;
  status?: string;
  src: string;
  price: number;
  title: string;
  rating?: string;
  category?: string;
  stock?: number;
  inStock?: boolean;
  color?: string;
}
