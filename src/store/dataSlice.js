import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  itemsAPI,
  attendancesAPI,
  eventsAPI,
  issuesAPI,
  leavesAPI,
  trainingsAPI,
  evaluationsAPI,
  activitiesAPI,
  taskLogsAPI,
  notificationsAPI,
  billingsAPI,
} from '../services/api';

// Items
export const fetchItems = createAsyncThunk('data/fetchItems', async (params, { rejectWithValue }) => {
  try {
    const response = await itemsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data item');
  }
});

export const createItem = createAsyncThunk('data/createItem', async (data, { rejectWithValue }) => {
  try {
    const response = await itemsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat item');
  }
});

export const updateItem = createAsyncThunk('data/updateItem', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await itemsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate item');
  }
});

export const deleteItem = createAsyncThunk('data/deleteItem', async (id, { rejectWithValue }) => {
  try {
    const response = await itemsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus item');
  }
});

export const fetchItemStats = createAsyncThunk('data/fetchItemStats', async (_, { rejectWithValue }) => {
  try {
    const response = await itemsAPI.getStats();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

// Attendances
export const fetchAttendances = createAsyncThunk('data/fetchAttendances', async (params, { rejectWithValue }) => {
  try {
    const response = await attendancesAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data absensi');
  }
});

export const fetchTodayAttendanceStats = createAsyncThunk('data/fetchTodayAttendanceStats', async (_, { rejectWithValue }) => {
  try {
    const response = await attendancesAPI.getTodayStats();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

// Events
export const fetchEvents = createAsyncThunk('data/fetchEvents', async (params, { rejectWithValue }) => {
  try {
    const response = await eventsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data event');
  }
});

export const createEvent = createAsyncThunk('data/createEvent', async (data, { rejectWithValue }) => {
  try {
    const response = await eventsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat event');
  }
});

export const updateEvent = createAsyncThunk('data/updateEvent', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await eventsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate event');
  }
});

export const deleteEvent = createAsyncThunk('data/deleteEvent', async (id, { rejectWithValue }) => {
  try {
    const response = await eventsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus event');
  }
});

export const fetchUpcomingEvents = createAsyncThunk('data/fetchUpcomingEvents', async (limit = 10, { rejectWithValue }) => {
  try {
    const response = await eventsAPI.getUpcoming(limit);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

// Issues
export const fetchIssues = createAsyncThunk('data/fetchIssues', async (params, { rejectWithValue }) => {
  try {
    const response = await issuesAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data issue');
  }
});

export const createIssue = createAsyncThunk('data/createIssue', async (data, { rejectWithValue }) => {
  try {
    const response = await issuesAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat issue');
  }
});

export const updateIssue = createAsyncThunk('data/updateIssue', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await issuesAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate issue');
  }
});

export const deleteIssue = createAsyncThunk('data/deleteIssue', async (id, { rejectWithValue }) => {
  try {
    const response = await issuesAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus issue');
  }
});

export const resolveIssue = createAsyncThunk('data/resolveIssue', async (id, { rejectWithValue }) => {
  try {
    const response = await issuesAPI.resolve(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal resolve issue');
  }
});

export const fetchIssueStats = createAsyncThunk('data/fetchIssueStats', async (_, { rejectWithValue }) => {
  try {
    const response = await issuesAPI.getStats();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

// Leaves
export const fetchLeaves = createAsyncThunk('data/fetchLeaves', async (params, { rejectWithValue }) => {
  try {
    const response = await leavesAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data cuti');
  }
});

export const createLeave = createAsyncThunk('data/createLeave', async (data, { rejectWithValue }) => {
  try {
    const response = await leavesAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat cuti');
  }
});

export const updateLeave = createAsyncThunk('data/updateLeave', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await leavesAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate cuti');
  }
});

export const deleteLeave = createAsyncThunk('data/deleteLeave', async (id, { rejectWithValue }) => {
  try {
    const response = await leavesAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus cuti');
  }
});

export const approveLeave = createAsyncThunk('data/approveLeave', async (id, { rejectWithValue }) => {
  try {
    const response = await leavesAPI.approve(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal approve cuti');
  }
});

export const rejectLeave = createAsyncThunk('data/rejectLeave', async (id, { rejectWithValue }) => {
  try {
    const response = await leavesAPI.reject(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal reject cuti');
  }
});

export const fetchLeaveStats = createAsyncThunk('data/fetchLeaveStats', async (_, { rejectWithValue }) => {
  try {
    const response = await leavesAPI.getStats();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

// Trainings
export const fetchTrainings = createAsyncThunk('data/fetchTrainings', async (params, { rejectWithValue }) => {
  try {
    const response = await trainingsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data pelatihan');
  }
});

export const createTraining = createAsyncThunk('data/createTraining', async (data, { rejectWithValue }) => {
  try {
    const response = await trainingsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat pelatihan');
  }
});

export const updateTraining = createAsyncThunk('data/updateTraining', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await trainingsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate pelatihan');
  }
});

export const deleteTraining = createAsyncThunk('data/deleteTraining', async (id, { rejectWithValue }) => {
  try {
    const response = await trainingsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus pelatihan');
  }
});

// Evaluations
export const fetchEvaluations = createAsyncThunk('data/fetchEvaluations', async (params, { rejectWithValue }) => {
  try {
    const response = await evaluationsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data evaluasi');
  }
});

export const createEvaluation = createAsyncThunk('data/createEvaluation', async (data, { rejectWithValue }) => {
  try {
    const response = await evaluationsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat evaluasi');
  }
});

export const updateEvaluation = createAsyncThunk('data/updateEvaluation', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await evaluationsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate evaluasi');
  }
});

export const deleteEvaluation = createAsyncThunk('data/deleteEvaluation', async (id, { rejectWithValue }) => {
  try {
    const response = await evaluationsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus evaluasi');
  }
});

export const fetchEvaluationStats = createAsyncThunk('data/fetchEvaluationStats', async (_, { rejectWithValue }) => {
  try {
    const response = await evaluationsAPI.getStats();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

// Activities
export const fetchActivities = createAsyncThunk('data/fetchActivities', async (params, { rejectWithValue }) => {
  try {
    const response = await activitiesAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data aktivitas');
  }
});

export const createActivity = createAsyncThunk('data/createActivity', async (data, { rejectWithValue }) => {
  try {
    const response = await activitiesAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat aktivitas');
  }
});

export const updateActivity = createAsyncThunk('data/updateActivity', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await activitiesAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate aktivitas');
  }
});

export const deleteActivity = createAsyncThunk('data/deleteActivity', async (id, { rejectWithValue }) => {
  try {
    const response = await activitiesAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus aktivitas');
  }
});

export const fetchRecentActivities = createAsyncThunk('data/fetchRecentActivities', async (limit = 10, { rejectWithValue }) => {
  try {
    const response = await activitiesAPI.getRecent(limit);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

// Task Logs
export const fetchTaskLogs = createAsyncThunk('data/fetchTaskLogs', async (params, { rejectWithValue }) => {
  try {
    const response = await taskLogsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data task log');
  }
});

export const createTaskLog = createAsyncThunk('data/createTaskLog', async (data, { rejectWithValue }) => {
  try {
    const response = await taskLogsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat task log');
  }
});

export const updateTaskLog = createAsyncThunk('data/updateTaskLog', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await taskLogsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate task log');
  }
});

export const deleteTaskLog = createAsyncThunk('data/deleteTaskLog', async (id, { rejectWithValue }) => {
  try {
    const response = await taskLogsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus task log');
  }
});

// Notifications
export const fetchNotifications = createAsyncThunk('data/fetchNotifications', async (params, { rejectWithValue }) => {
  try {
    const response = await notificationsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data notifikasi');
  }
});

export const createNotification = createAsyncThunk('data/createNotification', async (data, { rejectWithValue }) => {
  try {
    const response = await notificationsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat notifikasi');
  }
});

export const updateNotification = createAsyncThunk('data/updateNotification', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await notificationsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate notifikasi');
  }
});

export const deleteNotification = createAsyncThunk('data/deleteNotification', async (id, { rejectWithValue }) => {
  try {
    const response = await notificationsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus notifikasi');
  }
});

// Billings (PLN & PDAM)
export const fetchBillings = createAsyncThunk('data/fetchBillings', async (params, { rejectWithValue }) => {
  try {
    const response = await billingsAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data billing');
  }
});

export const createBilling = createAsyncThunk('data/createBilling', async (data, { rejectWithValue }) => {
  try {
    const response = await billingsAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal membuat billing');
  }
});

export const updateBilling = createAsyncThunk('data/updateBilling', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await billingsAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate billing');
  }
});

export const deleteBilling = createAsyncThunk('data/deleteBilling', async (id, { rejectWithValue }) => {
  try {
    const response = await billingsAPI.delete(id);
    return { id, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal menghapus billing');
  }
});

export const fetchBillingStats = createAsyncThunk('data/fetchBillingStats', async (_, { rejectWithValue }) => {
  try {
    const response = await billingsAPI.getStats();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const initialState = {
  items: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }, stats: null },
  attendances: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }, todayStats: null },
  events: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }, upcoming: [] },
  issues: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }, stats: null },
  leaves: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }, stats: null },
  trainings: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  evaluations: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }, stats: null },
  activities: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }, recent: [] },
  taskLogs: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  notifications: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
  billings: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }, stats: null },
  loading: false,
  error: null,
  success: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearDataError: (state) => { state.error = null; },
    clearDataSuccess: (state) => { state.success = null; },
  },
  extraReducers: (builder) => {
    builder
      // Items
      .addCase(fetchItems.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items.data = action.payload.data;
        state.items.pagination = action.payload.pagination;
      })
      .addCase(fetchItems.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createItem.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateItem.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.items.data = state.items.data.filter(i => i.item_id !== action.payload.id);
      })
      .addCase(fetchItemStats.fulfilled, (state, action) => { state.items.stats = action.payload; })
      // Attendances
      .addCase(fetchAttendances.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances.data = action.payload.data;
        state.attendances.pagination = action.payload.pagination;
      })
      .addCase(fetchAttendances.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchTodayAttendanceStats.fulfilled, (state, action) => { state.attendances.todayStats = action.payload; })
      // Events
      .addCase(fetchEvents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events.data = action.payload.data;
        state.events.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createEvent.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateEvent.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.events.data = state.events.data.filter(e => e.event_id !== action.payload.id);
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => { state.events.upcoming = action.payload; })
      // Issues
      .addCase(fetchIssues.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues.data = action.payload.data;
        state.issues.pagination = action.payload.pagination;
      })
      .addCase(fetchIssues.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createIssue.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateIssue.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.issues.data = state.issues.data.filter(i => i.issue_id !== action.payload.id);
      })
      .addCase(resolveIssue.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(fetchIssueStats.fulfilled, (state, action) => { state.issues.stats = action.payload; })
      // Leaves
      .addCase(fetchLeaves.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves.data = action.payload.data;
        state.leaves.pagination = action.payload.pagination;
      })
      .addCase(fetchLeaves.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createLeave.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateLeave.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.leaves.data = state.leaves.data.filter(l => l.leave_id !== action.payload.id);
      })
      .addCase(approveLeave.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(rejectLeave.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(fetchLeaveStats.fulfilled, (state, action) => { state.leaves.stats = action.payload; })
      // Trainings
      .addCase(fetchTrainings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.loading = false;
        state.trainings.data = action.payload.data;
        state.trainings.pagination = action.payload.pagination;
      })
      .addCase(fetchTrainings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTraining.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateTraining.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteTraining.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.trainings.data = state.trainings.data.filter(t => t.training_id !== action.payload.id);
      })
      // Evaluations
      .addCase(fetchEvaluations.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations.data = action.payload.data;
        state.evaluations.pagination = action.payload.pagination;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createEvaluation.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateEvaluation.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteEvaluation.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.evaluations.data = state.evaluations.data.filter(e => e.evaluation_id !== action.payload.id);
      })
      .addCase(fetchEvaluationStats.fulfilled, (state, action) => { state.evaluations.stats = action.payload; })
      // Activities
      .addCase(fetchActivities.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities.data = action.payload.data;
        state.activities.pagination = action.payload.pagination;
      })
      .addCase(fetchActivities.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createActivity.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateActivity.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.activities.data = state.activities.data.filter(a => a.activity_id !== action.payload.id);
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => { state.activities.recent = action.payload; })
      // Task Logs
      .addCase(fetchTaskLogs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTaskLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.taskLogs.data = action.payload.data;
        state.taskLogs.pagination = action.payload.pagination;
      })
      .addCase(fetchTaskLogs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTaskLog.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateTaskLog.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteTaskLog.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.taskLogs.data = state.taskLogs.data.filter(t => t.task_log_id !== action.payload.id);
      })
      // Notifications
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.data = action.payload.data;
        state.notifications.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createNotification.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateNotification.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.notifications.data = state.notifications.data.filter(n => n.notification_id !== action.payload.id);
      })
      // Billings
      .addCase(fetchBillings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBillings.fulfilled, (state, action) => {
        state.loading = false;
        state.billings.data = action.payload.data;
        state.billings.pagination = action.payload.pagination;
      })
      .addCase(fetchBillings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createBilling.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(updateBilling.fulfilled, (state, action) => { state.success = action.payload.message; })
      .addCase(deleteBilling.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.billings.data = state.billings.data.filter(b => b.billing_id !== action.payload.id);
      })
      .addCase(fetchBillingStats.fulfilled, (state, action) => { state.billings.stats = action.payload; });
  },
});

export const { clearDataError, clearDataSuccess } = dataSlice.actions;
export default dataSlice.reducer;
