// store/slices/productSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AddProductForm, Product } from "../../../../types/userType";
import api from "@/utils/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  pagination: null,
};

// ⬇️ Thunks

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (
    params: {
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    } = {},
    thunkAPI
  ) => {
    try {
      const query = new URLSearchParams();

      if (params.minPrice !== undefined)
        query.append("minPrice", params.minPrice.toString());

      if (params.maxPrice !== undefined)
        query.append("maxPrice", params.maxPrice.toString());

      if (params.page !== undefined)
        query.append("page", params.page.toString());

      if (params.limit !== undefined)
        query.append("limit", params.limit.toString());

      const queryString = query.toString();
      const { data } = await api.get(
        `products${queryString ? "?" + queryString : ""}`
      );

      return {
        products: data.data,
        pagination: data.pagination,
      };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await api.get(`products/${id}`);
      return data.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (
    params: {
      categoryId: string;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    },
    thunkAPI
  ) => {
    try {
      const query = new URLSearchParams();

      if (params.minPrice !== undefined)
        query.append("minPrice", params.minPrice.toString());

      if (params.maxPrice !== undefined)
        query.append("maxPrice", params.maxPrice.toString());

      if (params.page !== undefined)
        query.append("page", params.page.toString());

      if (params.limit !== undefined)
        query.append("limit", params.limit.toString());

      const queryString = query.toString();

      const { data } = await api.get(
        `products/category/${params.categoryId}${
          queryString ? `?${queryString}` : ""
        }`
      );

      return {
        products: data.data,
        pagination: data.pagination,
      };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchTopRatedProducts = createAsyncThunk(
  "products/fetchTopRated",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`products/top-rated`);
      return data.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchLatestProducts = createAsyncThunk(
  "products/fetchLatest",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`products/latest`);
      return data.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const AddProduct = createAsyncThunk(
  "products/add",
  async (newProduct: Partial<AddProductForm>, thunkAPI) => {
    try {
      const { data } = await api.post(`products`, newProduct);
      if (data.success) {
        toast.success("تم اضافة العرض بنجاح");
      }
      return data.data;
    } catch (err) {
      toast.error("حدث خطأ أثناء اضافة العرض");
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (
    { id, updatedData }: { id: string; updatedData: Partial<Product> },
    thunkAPI
  ) => {
    try {
      const { data } = await api.put(`products/${id}`, updatedData);
      if (data.success) {
        toast.success("تم تعديل العرض بنجاح");
      }
      return data.data;
    } catch (err) {
      toast.error("حدث خطأ أثناء تعديل العرض ");
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`products/${id}`);
      toast.success("تم حذف العرض بنجاح");
      return id;
    } catch (err) {
      toast.error("حدث خطأ أثناء الحذف");
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  "products/updateStatus",
  async ({ id, status }: { id: string; status: number }, thunkAPI) => {
    try {
      const { data } = await api.patch(`products/${id}/status`, {
        status,
      });
      if (data.success) {
        toast.success(
          `تم ${status === 1 ? "نشر العرض بنجاج" : "تعيين العرض ك مباع بنجاح"}`
        );
      }
      return data.data;
    } catch (err) {
      toast.error("حدث خطأ اثناء تعديل الحالة");
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateProductRate = createAsyncThunk(
  "products/updateRate",
  async ({ id, rate }: { id: string; rate: number }, thunkAPI) => {
    try {
      const { data } = await api.patch(`products/${id}/rate`, { rate });
      toast.success("تم اضافة التقييم بنجاح");
      return data.data;
    } catch (err) {
      toast.error("حدث خطأ أثناء ارسال التقييم");
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ⬇️ Slice

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProduct(state) {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ⬇️ Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[];
            pagination: Pagination;
          }>
        ) => {
          state.products = action.payload.products;
          state.pagination = action.payload.pagination;
          state.loading = false;
          state.error = null;
        }
      )

      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // ⬇️ Fetch latest products
      .addCase(fetchLatestProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLatestProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.products = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ⬇️ Fetch top-rated products
      .addCase(fetchTopRatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTopRatedProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.products = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchTopRatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ⬇️ Fetch single
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.product = action.payload;
          state.loading = false;
        }
      )
      .addCase(AddProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // ⬇️ Delete
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.products = state.products.filter(
            (p) => p._id !== action.payload
          );
        }
      )
      //fetch by categories
      .addCase(
        fetchProductsByCategory.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[];
            pagination: Pagination;
          }>
        ) => {
          state.products = action.payload.products;
          state.pagination = action.payload.pagination;
          state.loading = false;
          state.error = null;
        }
      )

      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ⬇️ Update / Status / Rate
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) state.products[index] = action.payload;
        }
      )
      .addCase(
        updateProductStatus.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) state.products[index] = action.payload;
        }
      )
      .addCase(
        updateProductRate.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) state.products[index] = action.payload;
        }
      );
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
