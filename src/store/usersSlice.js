import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI } from '../services/api';

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await usersAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal membuat user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await usersAPI.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menghapus user');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'users/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil statistik user');
    }
  }
);

const initialState = {
  data: [],
  selectedUser: null,
  stats: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
  success: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearUsersSuccess: (state) => {
      state.success = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By Id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.data = state.data.filter(user => user.user_id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Stats
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearUsersError, clearUsersSuccess, setSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
