export interface User {
  name: string;
  email: string;
  phone_num: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rate: number;
  status: number;
  description: string;
  phone: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
export interface AddProductForm {
  name: string;
  price: number;
  images: string[];
  rate?: number;
  description: string;
  phone: string;
  category_id: string;
}
