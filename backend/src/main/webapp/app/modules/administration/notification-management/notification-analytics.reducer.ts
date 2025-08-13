import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null,
  analytics: {} as any,
  deliveryFailures: [] as any[],
  abTestResults: [] as any[],
  userPreferences: [] as any[],
  updating: false,
  updateSuccess: false,
};

export type NotificationAnalyticsState = Readonly<typeof initialState>;

// Analytics Actions
export const getNotificationAnalytics = createAsyncThunk(
  'notificationAnalytics/fetch_analytics',
  async (params: { startDate: string; endDate: string }) => {
    const requestUrl = `api/admin/notification-analytics?startDate=${params.startDate}&endDate=${params.endDate}`;
    return axios.get<any>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getDeliveryFailures = createAsyncThunk(
  'notificationAnalytics/fetch_delivery_failures',
  async (params: { startDate: string; endDate: string }) => {
    const requestUrl = `api/admin/notification-analytics/failures?startDate=${params.startDate}&endDate=${params.endDate}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getChannelPerformance = createAsyncThunk(
  'notificationAnalytics/fetch_channel_performance',
  async (params: { startDate: string; endDate: string }) => {
    const requestUrl = `api/admin/notification-analytics/channels?startDate=${params.startDate}&endDate=${params.endDate}`;
    return axios.get<any>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getTypePerformance = createAsyncThunk(
  'notificationAnalytics/fetch_type_performance',
  async (params: { startDate: string; endDate: string }) => {
    const requestUrl = `api/admin/notification-analytics/types?startDate=${params.startDate}&endDate=${params.endDate}`;
    return axios.get<any>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getDailyTrends = createAsyncThunk(
  'notificationAnalytics/fetch_daily_trends',
  async (params: { startDate: string; endDate: string }) => {
    const requestUrl = `api/admin/notification-analytics/trends?startDate=${params.startDate}&endDate=${params.endDate}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// A/B Testing Actions
export const createABTest = createAsyncThunk(
  'notificationAnalytics/create_ab_test',
  async (abTest: any) => {
    const result = await axios.post<any>('api/admin/notification-analytics/ab-tests', abTest);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const getABTestResults = createAsyncThunk(
  'notificationAnalytics/fetch_ab_test_results',
  async (testId: string | number) => {
    const requestUrl = `api/admin/notification-analytics/ab-tests/${testId}/results`;
    return axios.get<any>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// User Preferences Actions
export const getUserPreferences = createAsyncThunk(
  'notificationAnalytics/fetch_user_preferences',
  async () => {
    const requestUrl = 'api/admin/notification-analytics/user-preferences';
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const updateUserPreferences = createAsyncThunk(
  'notificationAnalytics/update_user_preferences',
  async (preferences: any) => {
    const result = await axios.put<any>(`api/admin/notification-analytics/user-preferences/${preferences.userId}`, preferences);
    return result;
  },
  { serializeError: serializeAxiosError },
);

// Retry Mechanisms Actions
export const retryFailedDeliveries = createAsyncThunk(
  'notificationAnalytics/retry_failed_deliveries',
  async (params: { deliveryIds: number[]; reason?: string }) => {
    const result = await axios.post<any>('api/admin/notification-analytics/retry-deliveries', params);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const bulkRetryByFilter = createAsyncThunk(
  'notificationAnalytics/bulk_retry_by_filter',
  async (params: { startDate: string; endDate: string; channel?: string; type?: string; failureReason?: string }) => {
    const result = await axios.post<any>('api/admin/notification-analytics/bulk-retry', params);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const NotificationAnalyticsSlice = createSlice({
  name: 'notificationAnalytics',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    resetUpdateSuccess(state) {
      state.updateSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      // Analytics
      .addCase(getNotificationAnalytics.pending, state => {
        state.loading = true;
      })
      .addCase(getNotificationAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data;
      })
      .addCase(getNotificationAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getDeliveryFailures.pending, state => {
        state.loading = true;
      })
      .addCase(getDeliveryFailures.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryFailures = action.payload.data;
      })
      .addCase(getDeliveryFailures.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getChannelPerformance.pending, state => {
        state.loading = true;
      })
      .addCase(getChannelPerformance.fulfilled, (state, action) => {
        state.loading = false;
        if (state.analytics) {
          state.analytics.statsByChannel = action.payload.data;
        }
      })
      .addCase(getChannelPerformance.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getTypePerformance.pending, state => {
        state.loading = true;
      })
      .addCase(getTypePerformance.fulfilled, (state, action) => {
        state.loading = false;
        if (state.analytics) {
          state.analytics.statsByType = action.payload.data;
        }
      })
      .addCase(getTypePerformance.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getDailyTrends.pending, state => {
        state.loading = true;
      })
      .addCase(getDailyTrends.fulfilled, (state, action) => {
        state.loading = false;
        if (state.analytics) {
          state.analytics.dailyTrends = action.payload.data;
        }
      })
      .addCase(getDailyTrends.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // A/B Testing
      .addCase(createABTest.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(createABTest.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.abTestResults.push(action.payload.data);
      })
      .addCase(createABTest.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getABTestResults.pending, state => {
        state.loading = true;
      })
      .addCase(getABTestResults.fulfilled, (state, action) => {
        state.loading = false;
        state.abTestResults = action.payload.data;
      })
      .addCase(getABTestResults.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // User Preferences
      .addCase(getUserPreferences.pending, state => {
        state.loading = true;
      })
      .addCase(getUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.userPreferences = action.payload.data;
      })
      .addCase(getUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(updateUserPreferences.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        const index = state.userPreferences.findIndex(p => p.userId === action.payload.data.userId);
        if (index !== -1) {
          state.userPreferences[index] = action.payload.data;
        } else {
          state.userPreferences.push(action.payload.data);
        }
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      })
      // Retry Mechanisms
      .addCase(retryFailedDeliveries.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(retryFailedDeliveries.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
      })
      .addCase(retryFailedDeliveries.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      })
      .addCase(bulkRetryByFilter.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(bulkRetryByFilter.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
      })
      .addCase(bulkRetryByFilter.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset, resetUpdateSuccess } = NotificationAnalyticsSlice.actions;

export default NotificationAnalyticsSlice.reducer;
