// src/store/slices/userSlice.ts
import api from "@/utils/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone_num: string;
  role: string;
  isActive: boolean;
  password: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

// 1. جلب جميع المستخدمين
export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await api.get("users");
  return response.data;
});

// 2. جلب مستخدم واحد
export const fetchUser = createAsyncThunk(
  "users/fetchOne",
  async (id: string) => {
    const response = await api.get(`users/${id}`);
    return response.data;
  }
);

// 3. إضافة مستخدم
export const addUser = createAsyncThunk(
  "users/add",
  async (userData: Partial<User>) => {
    const response = await api.post("users", userData);
    return response.data.data;
  }
);

// 4. تعديل مستخدم
export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, userData }: { id: string; userData: Partial<User> }) => {
    const response = await api.put(`users/${id}`, userData);
    return response.data.data;
  }
);

// 5. حذف مستخدم
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string) => {
    await api.delete(`users/${id}`);
    return id;
  }
);

// 🔧 Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      // Fetch single user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })

      // Add user
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })

      // Update user
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?._id === action.payload._id) {
          state.currentUser = action.payload;
        }
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export default userSlice.reducer;
