import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  buildingsAPI,
  floorsAPI,
  roomsAPI,
  shiftsAPI,
  rolesAPI,
  categoryItemsAPI,
  eventCategoriesAPI,
  accountsAPI
} from '../services/api';

// Buildings
export const fetchBuildings = createAsyncThunk('master/fetchBuildings', async (params, { rejectWithValue }) => {
  try {
    const response = await buildingsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data gedung');
  }
});

export const fetchBuildingById = createAsyncThunk('master/fetchBuildingById', async (id, { rejectWithValue }) => {
  try {
    const response = await buildingsAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil detail gedung');
  }
});

export const createBuilding = createAsyncThunk('master/createBuilding', async (data, { rejectWithValue }) => {
  try {
    const response = await buildingsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat gedung');
  }
});

export const updateBuilding = createAsyncThunk('master/updateBuilding', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await buildingsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate gedung');
  }
});

export const deleteBuilding = createAsyncThunk('master/deleteBuilding', async (id, { rejectWithValue }) => {
  try {
    const response = await buildingsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus gedung');
  }
});

// Floors
export const fetchFloors = createAsyncThunk('master/fetchFloors', async (params, { rejectWithValue }) => {
  try {
    const response = await floorsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data lantai');
  }
});

export const fetchFloorById = createAsyncThunk('master/fetchFloorById', async (id, { rejectWithValue }) => {
  try {
    const response = await floorsAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil detail lantai');
  }
});

export const createFloor = createAsyncThunk('master/createFloor', async (data, { rejectWithValue }) => {
  try {
    const response = await floorsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat lantai');
  }
});

export const updateFloor = createAsyncThunk('master/updateFloor', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await floorsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate lantai');
  }
});

export const deleteFloor = createAsyncThunk('master/deleteFloor', async (id, { rejectWithValue }) => {
  try {
    const response = await floorsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus lantai');
  }
});

// Rooms
export const fetchRooms = createAsyncThunk('master/fetchRooms', async (params, { rejectWithValue }) => {
  try {
    const response = await roomsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data ruangan');
  }
});

export const fetchRoomById = createAsyncThunk('master/fetchRoomById', async (id, { rejectWithValue }) => {
  try {
    const response = await roomsAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil detail ruangan');
  }
});

export const createRoom = createAsyncThunk('master/createRoom', async (data, { rejectWithValue }) => {
  try {
    const response = await roomsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat ruangan');
  }
});

export const updateRoom = createAsyncThunk('master/updateRoom', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await roomsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate ruangan');
  }
});

export const deleteRoom = createAsyncThunk('master/deleteRoom', async (id, { rejectWithValue }) => {
  try {
    const response = await roomsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus ruangan');
  }
});

// Shifts
export const fetchShifts = createAsyncThunk('master/fetchShifts', async (params, { rejectWithValue }) => {
  try {
    const response = await shiftsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data shift');
  }
});

export const createShift = createAsyncThunk('master/createShift', async (data, { rejectWithValue }) => {
  try {
    const response = await shiftsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat shift');
  }
});

export const updateShift = createAsyncThunk('master/updateShift', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await shiftsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate shift');
  }
});

export const deleteShift = createAsyncThunk('master/deleteShift', async (id, { rejectWithValue }) => {
  try {
    const response = await shiftsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus shift');
  }
});

// Roles
export const fetchRoles = createAsyncThunk('master/fetchRoles', async (params, { rejectWithValue }) => {
  try {
    const response = await rolesAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data role');
  }
});

export const createRole = createAsyncThunk('master/createRole', async (data, { rejectWithValue }) => {
  try {
    const response = await rolesAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat role');
  }
});

export const updateRole = createAsyncThunk('master/updateRole', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await rolesAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate role');
  }
});

export const deleteRole = createAsyncThunk('master/deleteRole', async (id, { rejectWithValue }) => {
  try {
    const response = await rolesAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus role');
  }
});

// Category Items
export const fetchCategoryItems = createAsyncThunk('master/fetchCategoryItems', async (params, { rejectWithValue }) => {
  try {
    const response = await categoryItemsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data kategori');
  }
});

export const fetchCategoryItemById = createAsyncThunk('master/fetchCategoryItemById', async (id, { rejectWithValue }) => {
  try {
    const response = await categoryItemsAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil detail kategori');
  }
});

export const createCategoryItem = createAsyncThunk('master/createCategoryItem', async (data, { rejectWithValue }) => {
  try {
    const response = await categoryItemsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat kategori');
  }
});

export const updateCategoryItem = createAsyncThunk('master/updateCategoryItem', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await categoryItemsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate kategori');
  }
});

export const deleteCategoryItem = createAsyncThunk('master/deleteCategoryItem', async (id, { rejectWithValue }) => {
  try {
    const response = await categoryItemsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus kategori');
  }
});

// Event Categories
export const fetchEventCategories = createAsyncThunk('master/fetchEventCategories', async (params, { rejectWithValue }) => {
  try {
    const response = await eventCategoriesAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data kategori event');
  }
});

export const createEventCategory = createAsyncThunk('master/createEventCategory', async (data, { rejectWithValue }) => {
  try {
    const response = await eventCategoriesAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat kategori event');
  }
});

export const updateEventCategory = createAsyncThunk('master/updateEventCategory', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await eventCategoriesAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate kategori event');
  }
});

export const deleteEventCategory = createAsyncThunk('master/deleteEventCategory', async (id, { rejectWithValue }) => {
  try {
    const response = await eventCategoriesAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus kategori event');
  }
});

// Accounts
export const fetchAccounts = createAsyncThunk('master/fetchAccounts', async (params, { rejectWithValue }) => {
  try {
    const response = await accountsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data akun');
  }
});

export const createAccount = createAsyncThunk('master/createAccount', async (data, { rejectWithValue }) => {
  try {
    const response = await accountsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat akun');
  }
});

export const updateAccount = createAsyncThunk('master/updateAccount', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await accountsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate akun');
  }
});

export const deleteAccount = createAsyncThunk('master/deleteAccount', async (id, { rejectWithValue }) => {
  try {
    const response = await accountsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus akun');
  }
});

const initialState = {
  buildings: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  floors: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  rooms: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  shifts: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  roles: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  categoryItems: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  eventCategories: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  accounts: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  loading: false,
  error: null,
  success: null,
};

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {
    clearMasterError: (state) => {
      state.error = null;
    },
    clearMasterSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Buildings
      .addCase(fetchBuildings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading = false;
        state.buildings.data = action.payload.data;
        state.buildings.pagination = action.payload.pagination;
      })
      .addCase(fetchBuildings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createBuilding.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateBuilding.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteBuilding.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.buildings.data = state.buildings.data.filter(b => b.building_id !== action.payload.id);
      })
      // Floors
      .addCase(fetchFloors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFloors.fulfilled, (state, action) => {
        state.loading = false;
        state.floors.data = action.payload.data;
        state.floors.pagination = action.payload.pagination;
      })
      .addCase(fetchFloors.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createFloor.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateFloor.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteFloor.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.floors.data = state.floors.data.filter(f => f.floor_id !== action.payload.id);
      })
      // Rooms
      .addCase(fetchRooms.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.data = action.payload.data;
        state.rooms.pagination = action.payload.pagination;
      })
      .addCase(fetchRooms.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createRoom.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateRoom.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.rooms.data = state.rooms.data.filter(r => r.room_id !== action.payload.id);
      })
      // Shifts
      .addCase(fetchShifts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts.data = action.payload.data;
        state.shifts.pagination = action.payload.pagination;
      })
      .addCase(fetchShifts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createShift.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateShift.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.shifts.data = state.shifts.data.filter(s => s.shift_id !== action.payload.id);
      })
      // Roles
      .addCase(fetchRoles.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.data = action.payload.data;
        state.roles.pagination = action.payload.pagination;
      })
      .addCase(fetchRoles.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createRole.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateRole.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.roles.data = state.roles.data.filter(r => r.role_id !== action.payload.id);
      })
      // Category Items
      .addCase(fetchCategoryItems.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategoryItems.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryItems.data = action.payload.data;
        state.categoryItems.pagination = action.payload.pagination;
      })
      .addCase(fetchCategoryItems.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createCategoryItem.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateCategoryItem.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteCategoryItem.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.categoryItems.data = state.categoryItems.data.filter(c => c.category_item_id !== action.payload.id);
      })
      // Event Categories
      .addCase(fetchEventCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.eventCategories.data = action.payload.data;
        state.eventCategories.pagination = action.payload.pagination;
      })
      .addCase(fetchEventCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createEventCategory.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateEventCategory.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteEventCategory.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.eventCategories.data = state.eventCategories.data.filter(e => e.event_category_id !== action.payload.id);
      })
      // Accounts
      .addCase(fetchAccounts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.data = action.payload.data;
        state.accounts.pagination = action.payload.pagination;
      })
      .addCase(fetchAccounts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createAccount.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateAccount.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.accounts.data = state.accounts.data.filter(a => a.account_id !== action.payload.id);
      });
  },
});

export const { clearMasterError, clearMasterSuccess } = masterSlice.actions;
export default masterSlice.reducer;
