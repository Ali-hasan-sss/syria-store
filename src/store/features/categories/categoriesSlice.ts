// src/store/categoriesSlice.ts

import api from "@/utils/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface Category {
  _id: string;
  name: string;
}

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/categories");
      return data as Category[];
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async (name: string, thunkAPI) => {
    try {
      const { data } = await api.post("/categories", { name });
      toast.success("تم اضافة فئة بنجاح");
      return data.data as Category;
    } catch (err) {
      toast.error("حدث خطأ اثناء اضافة الفئة");
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, name }: { id: string; name: string }, thunkAPI) => {
    try {
      const { data } = await api.put(`/categories/${id}`, { name });
      toast.success("تم تعديل الفئة بنجاح");
      return data.data as Category;
    } catch (err) {
      toast.error("حدث خطأ أثناء تعديل الفئة");
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("تم حذف الفئة بنجاح");
      return id;
    } catch (err) {
      toast.error("حدث خطأ أثناء حذف الفئة");
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [] as Category[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (idx !== -1) state.categories[idx] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
      });
  },
});

export default categoriesSlice.reducer;
