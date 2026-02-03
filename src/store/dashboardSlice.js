import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../services/api';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (period = 'month', { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getStats(period);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data dashboard');
    }
  }
);

export const fetchAttendanceChart = createAsyncThunk(
  'dashboard/fetchAttendanceChart',
  async (days = 7, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getAttendanceChart(days);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data attendance chart');
    }
  }
);

const initialState = {
  stats: null,
  attendanceChart: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Attendance Chart
      .addCase(fetchAttendanceChart.fulfilled, (state, action) => {
        state.attendanceChart = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
