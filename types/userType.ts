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
  averageRating: number;
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
export interface SearchProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rate: number;
  status: number;
  description: string;
  phone: string;
  category_id: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  ratings: {
    userId: string;
    rate: number;
    _id: string;
  }[];
}
