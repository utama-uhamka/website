import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { campusesAPI } from '../services/api';

export const fetchCampuses = createAsyncThunk(
  'campuses/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await campusesAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data unit');
    }
  }
);

export const fetchCampusById = createAsyncThunk(
  'campuses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await campusesAPI.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data unit');
    }
  }
);

export const createCampus = createAsyncThunk(
  'campuses/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await campusesAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal membuat unit');
    }
  }
);

export const updateCampus = createAsyncThunk(
  'campuses/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await campusesAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate unit');
    }
  }
);

export const deleteCampus = createAsyncThunk(
  'campuses/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await campusesAPI.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menghapus unit');
    }
  }
);

export const fetchCampusStats = createAsyncThunk(
  'campuses/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await campusesAPI.getStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil statistik unit');
    }
  }
);

const initialState = {
  data: [],
  selectedCampus: null,
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

const campusesSlice = createSlice({
  name: 'campuses',
  initialState,
  reducers: {
    clearCampusesError: (state) => {
      state.error = null;
    },
    clearCampusesSuccess: (state) => {
      state.success = null;
    },
    setSelectedCampus: (state, action) => {
      state.selectedCampus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampuses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCampuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCampusById.fulfilled, (state, action) => {
        state.selectedCampus = action.payload;
      })
      .addCase(createCampus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(createCampus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCampus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(updateCampus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCampus.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCampus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.data = state.data.filter(c => c.campus_id !== action.payload.id);
      })
      .addCase(deleteCampus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCampusStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearCampusesError, clearCampusesSuccess, setSelectedCampus } = campusesSlice.actions;
export default campusesSlice.reducer;
