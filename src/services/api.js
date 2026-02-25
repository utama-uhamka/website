import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/dashboard';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if already on login page (prevents reload on failed login)
      const isLoginPage = window.location.pathname === '/login';
      if (!isLoginPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (period = 'month') => api.get(`/stats?period=${period}`),
  getAttendanceChart: (days = 7) => api.get(`/stats/attendance-chart?days=${days}`),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
  // User Shift Schedule
  getShifts: (userId) => api.get(`/users/${userId}/shifts`),
  updateShift: (userId, data) => api.put(`/users/${userId}/shifts`, data),
  bulkUpdateShifts: (userId, schedules) => api.put(`/users/${userId}/shifts/bulk`, { schedules }),
};

// Campuses API
export const campusesAPI = {
  getAll: (params) => api.get('/campuses', { params }),
  getById: (id) => api.get(`/campuses/${id}`),
  create: (data) => api.post('/campuses', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  update: (id, data) => api.put(`/campuses/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  delete: (id) => api.delete(`/campuses/${id}`),
  getStats: () => api.get('/campuses/stats'),
};

// Buildings API
export const buildingsAPI = {
  getAll: (params) => api.get('/buildings', { params }),
  getById: (id) => api.get(`/buildings/${id}`),
  create: (data) => api.post('/buildings', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  update: (id, data) => api.put(`/buildings/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  delete: (id) => api.delete(`/buildings/${id}`),
};

// Floors API
export const floorsAPI = {
  getAll: (params) => api.get('/floors', { params }),
  getById: (id) => api.get(`/floors/${id}`),
  create: (data) => api.post('/floors', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  update: (id, data) => api.put(`/floors/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  delete: (id) => api.delete(`/floors/${id}`),
};

// Rooms API
export const roomsAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  update: (id, data) => api.put(`/rooms/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// Items API
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  update: (id, data) => api.put(`/items/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  delete: (id) => api.delete(`/items/${id}`),
  getStats: () => api.get('/items/stats'),
  getMaintenance: () => api.get('/items/maintenance'),
};

// Category Items API
export const categoryItemsAPI = {
  getAll: (params) => api.get('/category-items', { params }),
  getById: (id) => api.get(`/category-items/${id}`),
  create: (data) => api.post('/category-items', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  update: (id, data) => api.put(`/category-items/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  delete: (id) => api.delete(`/category-items/${id}`),
};

// Accounts API
export const accountsAPI = {
  getAll: (params) => api.get('/accounts', { params }),
  getById: (id) => api.get(`/accounts/${id}`),
  create: (data) => api.post('/accounts', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
};

// Attendances API
export const attendancesAPI = {
  getAll: (params) => api.get('/attendances', { params }),
  getById: (id) => api.get(`/attendances/${id}`),
  getStats: (params) => api.get('/attendances/stats', { params }),
  getTodayStats: () => api.get('/attendances/today-stats'),
  getGrouped: (params) => api.get('/attendances/grouped', { params }),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  update: (id, data) => api.put(`/events/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  delete: (id) => api.delete(`/events/${id}`),
  getUpcoming: (limit = 10) => api.get(`/events/upcoming?limit=${limit}`),
};

// Event Categories API
export const eventCategoriesAPI = {
  getAll: (params) => api.get('/event-categories', { params }),
  getById: (id) => api.get(`/event-categories/${id}`),
  create: (data) => api.post('/event-categories', data),
  update: (id, data) => api.put(`/event-categories/${id}`, data),
  delete: (id) => api.delete(`/event-categories/${id}`),
};

// Issues API
export const issuesAPI = {
  getAll: (params) => api.get('/issues', { params }),
  getById: (id) => api.get(`/issues/${id}`),
  create: (data) => api.post('/issues', data),
  update: (id, data) => api.put(`/issues/${id}`, data),
  delete: (id) => api.delete(`/issues/${id}`),
  resolve: (id) => api.put(`/issues/${id}/resolve`),
  getStats: () => api.get('/issues/stats'),
};

// Shifts API
export const shiftsAPI = {
  getAll: (params) => api.get('/shifts', { params }),
  getById: (id) => api.get(`/shifts/${id}`),
  create: (data) => api.post('/shifts', data),
  update: (id, data) => api.put(`/shifts/${id}`, data),
  delete: (id) => api.delete(`/shifts/${id}`),
};

// Roles API
export const rolesAPI = {
  getAll: (params) => api.get('/roles', { params }),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
  getStats: () => api.get('/roles/stats'),
};

// Leaves API
export const leavesAPI = {
  getAll: (params) => api.get('/leaves', { params }),
  getById: (id) => api.get(`/leaves/${id}`),
  create: (data) => api.post('/leaves', data),
  update: (id, data) => api.put(`/leaves/${id}`, data),
  delete: (id) => api.delete(`/leaves/${id}`),
  approve: (id) => api.put(`/leaves/${id}/approve`),
  reject: (id) => api.put(`/leaves/${id}/reject`),
  getStats: () => api.get('/leaves/stats'),
};

// Trainings API
export const trainingsAPI = {
  getAll: (params) => api.get('/trainings', { params }),
  getById: (id) => api.get(`/trainings/${id}`),
  create: (data) => api.post('/trainings', data),
  update: (id, data) => api.put(`/trainings/${id}`, data),
  delete: (id) => api.delete(`/trainings/${id}`),
  getUpcoming: (limit = 10) => api.get(`/trainings/upcoming?limit=${limit}`),
};

// Evaluations API
export const evaluationsAPI = {
  getAll: (params) => api.get('/evaluations', { params }),
  getById: (id) => api.get(`/evaluations/${id}`),
  create: (data) => api.post('/evaluations', data),
  update: (id, data) => api.put(`/evaluations/${id}`, data),
  delete: (id) => api.delete(`/evaluations/${id}`),
  getStats: () => api.get('/evaluations/stats'),
  exportTemplate: (period) => api.get('/evaluations/export-template', { params: { period } }),
  importEvaluations: (data) => api.post('/evaluations/import', data),
};

// Activities API
export const activitiesAPI = {
  getAll: (params) => api.get('/activities', { params }),
  getById: (id) => api.get(`/activities/${id}`),
  create: (data) => api.post('/activities', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  update: (id, data) => api.put(`/activities/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  delete: (id) => api.delete(`/activities/${id}`),
  getRecent: (limit = 10) => api.get(`/activities/recent?limit=${limit}`),
};

// Task Logs API
export const taskLogsAPI = {
  getAll: (params) => api.get('/task-logs', { params }),
  getById: (id) => api.get(`/task-logs/${id}`),
  create: (data) => api.post('/task-logs', data),
  update: (id, data) => api.put(`/task-logs/${id}`, data),
  delete: (id) => api.delete(`/task-logs/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  create: (data) => api.post('/notifications', data),
  update: (id, data) => api.put(`/notifications/${id}`, data),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Push Notifications API
export const pushNotificationsAPI = {
  getAll: (params) => api.get('/push-notifications', { params }),
  getById: (id) => api.get(`/push-notifications/${id}`),
  getStats: () => api.get('/push-notifications/stats'),
  send: (data) => api.post('/push-notifications/send', data),
  delete: (id) => api.delete(`/push-notifications/${id}`),
};

// Billings API (PLN & PDAM)
export const billingsAPI = {
  getAll: (params) => api.get('/billings', { params }),
  getById: (id) => api.get(`/billings/${id}`),
  create: (data) => api.post('/billings', data),
  update: (id, data) => api.put(`/billings/${id}`, data),
  delete: (id) => api.delete(`/billings/${id}`),
  getStats: () => api.get('/billings/stats'),
};

// Banners API
export const bannersAPI = {
  getAll: (params) => api.get('/banners', { params }),
  getById: (id) => api.get(`/banners/${id}`),
  create: (data) => api.post('/banners', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  update: (id, data) => api.put(`/banners/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  delete: (id) => api.delete(`/banners/${id}`),
  toggleActive: (id) => api.put(`/banners/${id}/toggle`),
};

// Reports API
export const reportsAPI = {
  getCampusReportData: (campusId, params) => api.get(`/reports/campus/${campusId}/data`, { params }),
  getCampusReportStats: (campusId, params) => api.get(`/reports/campus/${campusId}/stats`, { params }),
  downloadCampusPdf: (campusId, params) => api.get(`/reports/campus/${campusId}/pdf`, {
    params,
    responseType: 'blob',
  }),
  downloadCampusPhotos: (campusId, params) => api.get(`/reports/campus/${campusId}/photos`, {
    params,
    responseType: 'blob',
  }),
};

export default api;
