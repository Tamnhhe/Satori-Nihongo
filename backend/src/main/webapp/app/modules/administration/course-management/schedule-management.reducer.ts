import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  scheduleSuccess: false,
  schedules: [] as any[],
  totalItems: 0,
  conflictCheckResult: null as any,
};

export type ScheduleManagementState = Readonly<typeof initialState>;

// API endpoints
const apiUrl = 'api/course-assignment/schedules';

// Async thunks
export const createSchedule = createAsyncThunk(
  'scheduleManagement/create_schedule',
  async (scheduleData: any) => {
    const response = await axios.post(apiUrl, scheduleData);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const updateSchedule = createAsyncThunk(
  'scheduleManagement/update_schedule',
  async ({ id, scheduleData }: { id: number; scheduleData: any }) => {
    const response = await axios.put(`${apiUrl}/${id}`, scheduleData);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const deleteSchedule = createAsyncThunk(
  'scheduleManagement/delete_schedule',
  async (id: number) => {
    await axios.delete(`${apiUrl}/${id}`);
    return id;
  },
  { serializeError: serializeAxiosError },
);

export const getSchedulesByCourse = createAsyncThunk(
  'scheduleManagement/fetch_schedules_by_course',
  async ({ courseId, page = 0, size = 20 }: { courseId: number; page?: number; size?: number }) => {
    const response = await axios.get(`${apiUrl}/course/${courseId}?page=${page}&size=${size}`);
    return {
      schedules: response.data,
      totalItems: parseInt(response.headers['x-total-count'], 10) || response.data.length,
    };
  },
  { serializeError: serializeAxiosError },
);

export const getSchedulesByTeacher = createAsyncThunk(
  'scheduleManagement/fetch_schedules_by_teacher',
  async ({ teacherId, page = 0, size = 20 }: { teacherId: number; page?: number; size?: number }) => {
    const response = await axios.get(`${apiUrl}/teacher/${teacherId}?page=${page}&size=${size}`);
    return {
      schedules: response.data,
      totalItems: parseInt(response.headers['x-total-count'], 10) || response.data.length,
    };
  },
  { serializeError: serializeAxiosError },
);

export const checkScheduleConflicts = createAsyncThunk(
  'scheduleManagement/check_conflicts',
  async (scheduleData: any) => {
    const response = await axios.post(`${apiUrl}/check-conflicts`, scheduleData);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

// Slice
export const ScheduleManagementSlice = createSlice({
  name: 'scheduleManagement',
  initialState,
  reducers: {
    reset() {
      return {
        ...initialState,
      };
    },
    clearScheduleSuccess(state) {
      state.scheduleSuccess = false;
    },
    clearConflictResult(state) {
      state.conflictCheckResult = null;
    },
  },
  extraReducers(builder) {
    builder
      // Create schedule
      .addCase(createSchedule.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.scheduleSuccess = false;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduleSuccess = true;
        state.errorMessage = null;
        state.schedules.push(action.payload);
        state.totalItems += 1;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to create schedule';
        state.scheduleSuccess = false;
      })
      // Update schedule
      .addCase(updateSchedule.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.scheduleSuccess = false;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduleSuccess = true;
        state.errorMessage = null;
        const index = state.schedules.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to update schedule';
        state.scheduleSuccess = false;
      })
      // Delete schedule
      .addCase(deleteSchedule.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = state.schedules.filter(s => s.id !== action.payload);
        state.totalItems -= 1;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to delete schedule';
      })
      // Get schedules by course
      .addCase(getSchedulesByCourse.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getSchedulesByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload.schedules;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(getSchedulesByCourse.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch schedules';
      })
      // Get schedules by teacher
      .addCase(getSchedulesByTeacher.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getSchedulesByTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload.schedules;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(getSchedulesByTeacher.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch teacher schedules';
      })
      // Check schedule conflicts
      .addCase(checkScheduleConflicts.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.conflictCheckResult = null;
      })
      .addCase(checkScheduleConflicts.fulfilled, (state, action) => {
        state.loading = false;
        state.conflictCheckResult = action.payload;
      })
      .addCase(checkScheduleConflicts.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to check conflicts';
      });
  },
});

export const { reset, clearScheduleSuccess, clearConflictResult } = ScheduleManagementSlice.actions;

export default ScheduleManagementSlice.reducer;
