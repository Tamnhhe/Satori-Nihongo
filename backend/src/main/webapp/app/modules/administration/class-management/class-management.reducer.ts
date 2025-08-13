import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  deleteSuccess: false,
  enrollmentResult: null,
  // Schedule management state
  classSchedules: [],
  scheduleLoading: false,
  scheduleSuccess: false,
  conflictCheckResult: null,
  scheduleErrorMessage: null,
};

const apiUrl = 'api/admin/course-classes';

// Async thunks
export const getEntities = createAsyncThunk(
  'classManagement/fetch_entity_list',
  async ({
    page,
    size,
    sort,
    searchTerm,
    statusFilter,
    enrollmentFilter,
  }: IQueryParams & {
    searchTerm?: string;
    statusFilter?: string;
    enrollmentFilter?: string;
  }) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (sort) params.append('sort', sort);
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (statusFilter) params.append('statusFilter', statusFilter);
    if (enrollmentFilter) params.append('enrollmentFilter', enrollmentFilter);

    const requestUrl = `${apiUrl}?${params.toString()}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'classManagement/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<any>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'classManagement/create_entity',
  async (entity: any) => {
    const result = await axios.post<any>(apiUrl, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'classManagement/update_entity',
  async (entity: any) => {
    const result = await axios.put<any>(`${apiUrl}/${entity.id}`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'classManagement/delete_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<any>(requestUrl);
    return result;
  },
  { serializeError: serializeAxiosError },
);

// Student enrollment actions
export const addStudentToClass = createAsyncThunk(
  'classManagement/add_student',
  async ({ classId, studentId }: { classId: number; studentId: number }) => {
    const result = await axios.post<any>(`${apiUrl}/${classId}/students/${studentId}`);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const removeStudentFromClass = createAsyncThunk(
  'classManagement/remove_student',
  async ({ classId, studentId }: { classId: number; studentId: number }) => {
    const result = await axios.delete<any>(`${apiUrl}/${classId}/students/${studentId}`);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const addMultipleStudentsToClass = createAsyncThunk(
  'classManagement/add_multiple_students',
  async ({ classId, studentIds, allowWaitlist }: { classId: number; studentIds: number[]; allowWaitlist?: boolean }) => {
    const requestBody = {
      studentIds,
      allowWaitlist: allowWaitlist || false,
    };
    const result = await axios.post<any>(`${apiUrl}/${classId}/students/bulk`, requestBody);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const addStudentToClassWithWaitlist = createAsyncThunk(
  'classManagement/add_student_with_waitlist',
  async ({ classId, studentId, forceAdd }: { classId: number; studentId: number; forceAdd?: boolean }) => {
    const params = forceAdd ? '?forceAdd=true' : '';
    const result = await axios.post<any>(`${apiUrl}/${classId}/students/${studentId}${params}`);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const getAvailableStudents = createAsyncThunk(
  'classManagement/get_available_students',
  async ({ classId, page, size, sort }: { classId: number } & IQueryParams) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (sort) params.append('sort', sort);

    const requestUrl = `${apiUrl}/${classId}/available-students?${params.toString()}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const searchAvailableStudents = createAsyncThunk(
  'classManagement/search_available_students',
  async ({ classId, searchTerm, page, size, sort }: { classId: number; searchTerm: string } & IQueryParams) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (sort) params.append('sort', sort);
    params.append('searchTerm', searchTerm);

    const requestUrl = `${apiUrl}/${classId}/available-students/search?${params.toString()}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// Class Schedule Management Actions
export const getClassSchedules = createAsyncThunk(
  'classManagement/get_class_schedules',
  async ({ classId, page, size, sort }: { classId: number } & IQueryParams) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (sort) params.append('sort', sort);

    const requestUrl = `${apiUrl}/${classId}/schedules?${params.toString()}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createClassSchedule = createAsyncThunk(
  'classManagement/create_class_schedule',
  async (scheduleData: any) => {
    const result = await axios.post<any>(`${apiUrl}/${scheduleData.classId}/schedules`, scheduleData);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateClassSchedule = createAsyncThunk(
  'classManagement/update_class_schedule',
  async ({ id, scheduleData }: { id: number; scheduleData: any }) => {
    const result = await axios.put<any>(`${apiUrl}/${scheduleData.classId}/schedules/${id}`, scheduleData);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteClassSchedule = createAsyncThunk(
  'classManagement/delete_class_schedule',
  async (scheduleId: number) => {
    const result = await axios.delete<any>(`api/admin/class-schedules/${scheduleId}`);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const checkClassScheduleConflicts = createAsyncThunk(
  'classManagement/check_class_schedule_conflicts',
  async (scheduleData: any) => {
    const result = await axios.post<any>(`${apiUrl}/${scheduleData.classId}/schedules/check-conflicts`, scheduleData);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const createRecurringClassSchedules = createAsyncThunk(
  'classManagement/create_recurring_class_schedules',
  async (scheduleData: any) => {
    const result = await axios.post<any>(`${apiUrl}/${scheduleData.classId}/schedules/recurring`, scheduleData);
    return result;
  },
  { serializeError: serializeAxiosError },
);

// Slice
export const ClassManagementSlice = createSlice({
  name: 'classManagement',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    resetUpdateSuccess(state) {
      state.updateSuccess = false;
    },
    resetDeleteSuccess(state) {
      state.deleteSuccess = false;
    },
    resetEnrollmentResult(state) {
      state.enrollmentResult = null;
    },
    resetScheduleSuccess(state) {
      state.scheduleSuccess = false;
    },
    resetConflictCheck(state) {
      state.conflictCheckResult = null;
    },
  },
  extraReducers(builder) {
    builder
      // Get entity
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      // Delete entity
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = false;
        state.deleteSuccess = true;
        state.entity = {};
      })
      // Get entities
      .addCase(getEntities.pending, state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.deleteSuccess = false;
        state.loading = true;
      })
      .addCase(getEntities.fulfilled, (state, action) => {
        const { data, headers } = action.payload;
        state.loading = false;
        state.entities = data;
        state.totalItems = parseInt(headers['x-total-count'], 10);
      })
      .addCase(getEntities.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // Create/Update entities
      .addCase(createEntity.pending, state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      })
      .addCase(createEntity.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addCase(createEntity.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message;
      })
      .addCase(updateEntity.pending, state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      })
      .addCase(updateEntity.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addCase(updateEntity.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message;
      })
      // Student enrollment actions
      .addCase(addStudentToClass.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addCase(removeStudentFromClass.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addCase(addMultipleStudentsToClass.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data.courseClass || action.payload.data;
        state.enrollmentResult = action.payload.data;
      })
      .addCase(addStudentToClassWithWaitlist.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      // Class Schedule Management
      .addCase(getClassSchedules.pending, state => {
        state.scheduleLoading = true;
        state.scheduleErrorMessage = null;
      })
      .addCase(getClassSchedules.fulfilled, (state, action) => {
        const { data, headers } = action.payload;
        state.scheduleLoading = false;
        state.classSchedules = data;
        state.totalItems = parseInt(headers['x-total-count'], 10);
      })
      .addCase(getClassSchedules.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleErrorMessage = action.error.message;
      })
      .addCase(createClassSchedule.pending, state => {
        state.scheduleLoading = true;
        state.scheduleSuccess = false;
        state.scheduleErrorMessage = null;
      })
      .addCase(createClassSchedule.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleSuccess = true;
        // Add new schedule(s) to the list
        if (Array.isArray(action.payload.data)) {
          state.classSchedules = [...state.classSchedules, ...action.payload.data];
        } else {
          state.classSchedules = [...state.classSchedules, action.payload.data];
        }
      })
      .addCase(createClassSchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleErrorMessage = action.error.message;
      })
      .addCase(updateClassSchedule.pending, state => {
        state.scheduleLoading = true;
        state.scheduleSuccess = false;
        state.scheduleErrorMessage = null;
      })
      .addCase(updateClassSchedule.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleSuccess = true;
        // Update the schedule in the list
        const updatedSchedule = action.payload.data;
        state.classSchedules = state.classSchedules.map(schedule => (schedule.id === updatedSchedule.id ? updatedSchedule : schedule));
      })
      .addCase(updateClassSchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleErrorMessage = action.error.message;
      })
      .addCase(deleteClassSchedule.pending, state => {
        state.scheduleLoading = true;
        state.scheduleErrorMessage = null;
      })
      .addCase(deleteClassSchedule.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleSuccess = true;
        // Remove the deleted schedule from the list
        const deletedId = action.meta.arg;
        state.classSchedules = state.classSchedules.filter(schedule => schedule.id !== deletedId);
      })
      .addCase(deleteClassSchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleErrorMessage = action.error.message;
      })
      .addCase(checkClassScheduleConflicts.pending, state => {
        state.scheduleLoading = true;
        state.conflictCheckResult = null;
      })
      .addCase(checkClassScheduleConflicts.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.conflictCheckResult = action.payload.data;
      })
      .addCase(checkClassScheduleConflicts.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleErrorMessage = action.error.message;
      })
      .addCase(createRecurringClassSchedules.pending, state => {
        state.scheduleLoading = true;
        state.scheduleSuccess = false;
        state.scheduleErrorMessage = null;
      })
      .addCase(createRecurringClassSchedules.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleSuccess = true;
        // Add all recurring schedules to the list
        state.classSchedules = [...state.classSchedules, ...action.payload.data];
      })
      .addCase(createRecurringClassSchedules.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleErrorMessage = action.error.message;
      });
  },
});

export const { reset, resetUpdateSuccess, resetDeleteSuccess, resetEnrollmentResult, resetScheduleSuccess, resetConflictCheck } =
  ClassManagementSlice.actions;

// Reducer
export default ClassManagementSlice.reducer;
