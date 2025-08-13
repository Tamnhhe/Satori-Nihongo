import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null,
  templates: [] as any[],
  schedules: [] as any[],
  deliveries: [] as any[],
  entity: {} as any,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type NotificationManagementState = Readonly<typeof initialState>;

// Template Actions
export const getTemplates = createAsyncThunk(
  'notificationManagement/fetch_templates',
  async (params: { page: number; size: number; sort: string }) => {
    const requestUrl = `api/admin/notifications/templates?page=${params.page}&size=${params.size}&sort=${params.sort}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getTemplate = createAsyncThunk(
  'notificationManagement/fetch_template',
  async (id: string | number) => {
    const requestUrl = `api/admin/notifications/templates/${id}`;
    return axios.get<any>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createTemplate = createAsyncThunk(
  'notificationManagement/create_template',
  async (entity: any) => {
    const result = await axios.post<any>('api/admin/notifications/templates', entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateTemplate = createAsyncThunk(
  'notificationManagement/update_template',
  async (entity: any) => {
    const result = await axios.put<any>(`api/admin/notifications/templates/${entity.id}`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteTemplate = createAsyncThunk(
  'notificationManagement/delete_template',
  async (id: string | number) => {
    const requestUrl = `api/admin/notifications/templates/${id}`;
    const result = await axios.delete(requestUrl);
    return result;
  },
  { serializeError: serializeAxiosError },
);

// Schedule Actions
export const getSchedules = createAsyncThunk(
  'notificationManagement/fetch_schedules',
  async (params: { page: number; size: number; sort: string }) => {
    const requestUrl = `api/admin/notifications/schedules?page=${params.page}&size=${params.size}&sort=${params.sort}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getSchedule = createAsyncThunk(
  'notificationManagement/fetch_schedule',
  async (id: string | number) => {
    const requestUrl = `api/admin/notifications/schedules/${id}`;
    return axios.get<any>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createSchedule = createAsyncThunk(
  'notificationManagement/create_schedule',
  async (entity: any) => {
    const result = await axios.post<any>('api/admin/notifications/schedules', entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateSchedule = createAsyncThunk(
  'notificationManagement/update_schedule',
  async (entity: any) => {
    const result = await axios.put<any>(`api/admin/notifications/schedules/${entity.id}`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const sendNotificationNow = createAsyncThunk(
  'notificationManagement/send_notification',
  async (id: string | number) => {
    const requestUrl = `api/admin/notifications/schedules/${id}/send`;
    const result = await axios.post(requestUrl);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const cancelScheduledNotification = createAsyncThunk(
  'notificationManagement/cancel_notification',
  async (id: string | number) => {
    const requestUrl = `api/admin/notifications/schedules/${id}/cancel`;
    const result = await axios.post(requestUrl);
    return result;
  },
  { serializeError: serializeAxiosError },
);

// Delivery Actions
export const getDeliveries = createAsyncThunk(
  'notificationManagement/fetch_deliveries',
  async (params: { scheduleId?: string | number; page: number; size: number; sort: string }) => {
    const requestUrl = params.scheduleId
      ? `api/admin/notifications/schedules/${params.scheduleId}/deliveries?page=${params.page}&size=${params.size}&sort=${params.sort}`
      : `api/admin/notifications/deliveries?page=${params.page}&size=${params.size}&sort=${params.sort}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const retryFailedDelivery = createAsyncThunk(
  'notificationManagement/retry_delivery',
  async (id: string | number) => {
    const requestUrl = `api/admin/notifications/deliveries/${id}/retry`;
    const result = await axios.post(requestUrl);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const NotificationManagementSlice = createSlice({
  name: 'notificationManagement',
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
      // Templates
      .addCase(getTemplates.pending, state => {
        state.loading = true;
      })
      .addCase(getTemplates.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.data as any;
        state.templates = responseData.content || responseData;
        state.totalItems = responseData.totalElements || (Array.isArray(responseData) ? responseData.length : 0);
      })
      .addCase(getTemplates.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getTemplate.pending, state => {
        state.loading = true;
      })
      .addCase(getTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(getTemplate.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(createTemplate.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
        state.templates.unshift(action.payload.data);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      })
      .addCase(updateTemplate.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
        const index = state.templates.findIndex(t => t.id === action.payload.data.id);
        if (index !== -1) {
          state.templates[index] = action.payload.data;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      })
      .addCase(deleteTemplate.pending, state => {
        state.updating = true;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        const url = action.meta.arg as string;
        const id = url.split('/').pop();
        state.templates = state.templates.filter(t => t.id.toString() !== id);
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message;
      })
      // Schedules
      .addCase(getSchedules.pending, state => {
        state.loading = true;
      })
      .addCase(getSchedules.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.data as any;
        state.schedules = responseData.content || responseData;
        state.totalItems = responseData.totalElements || (Array.isArray(responseData) ? responseData.length : 0);
      })
      .addCase(getSchedules.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getSchedule.pending, state => {
        state.loading = true;
      })
      .addCase(getSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(getSchedule.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(createSchedule.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
        state.schedules.unshift(action.payload.data);
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      })
      .addCase(updateSchedule.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
        const index = state.schedules.findIndex(s => s.id === action.payload.data.id);
        if (index !== -1) {
          state.schedules[index] = action.payload.data;
        }
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      })
      .addCase(sendNotificationNow.pending, state => {
        state.updating = true;
      })
      .addCase(sendNotificationNow.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        // Refresh schedules after sending
      })
      .addCase(sendNotificationNow.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message;
      })
      .addCase(cancelScheduledNotification.pending, state => {
        state.updating = true;
      })
      .addCase(cancelScheduledNotification.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        // Refresh schedules after cancelling
      })
      .addCase(cancelScheduledNotification.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message;
      })
      // Deliveries
      .addCase(getDeliveries.pending, state => {
        state.loading = true;
      })
      .addCase(getDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.data as any;
        state.deliveries = responseData.content || responseData;
        state.totalItems = responseData.totalElements || (Array.isArray(responseData) ? responseData.length : 0);
      })
      .addCase(getDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(retryFailedDelivery.pending, state => {
        state.updating = true;
      })
      .addCase(retryFailedDelivery.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
      })
      .addCase(retryFailedDelivery.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset, resetUpdateSuccess } = NotificationManagementSlice.actions;

export default NotificationManagementSlice.reducer;
