import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import dashboardReducer from './dashboardSlice';
import usersReducer from './usersSlice';
import campusesReducer from './campusesSlice';
import masterReducer from './masterSlice';
import dataReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    campuses: campusesReducer,
    master: masterReducer,
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
