import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  assignmentSuccess: false,
  availableTeachers: [] as any[],
  availableClasses: [] as any[],
};

export type CourseAssignmentState = Readonly<typeof initialState>;

// API endpoints
const apiUrl = 'api/course-assignment';
const teachersApiUrl = 'api/admin/users';
const classesApiUrl = 'api/course-classes';

// Async thunks
export const assignCourseToTeacher = createAsyncThunk(
  'courseAssignment/assign_teacher',
  async (assignmentData: any) => {
    const response = await axios.post(`${apiUrl}/assign-teacher`, assignmentData);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const assignCourseToClasses = createAsyncThunk(
  'courseAssignment/assign_classes',
  async (assignmentData: any) => {
    const response = await axios.post(`${apiUrl}/assign-classes`, assignmentData);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const getAvailableTeachers = createAsyncThunk(
  'courseAssignment/fetch_teachers',
  async () => {
    const response = await axios.get(`${teachersApiUrl}?role=GIANG_VIEN&size=1000`);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const getAvailableClasses = createAsyncThunk(
  'courseAssignment/fetch_classes',
  async () => {
    const response = await axios.get(`${classesApiUrl}?size=1000`);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

// Slice
export const CourseAssignmentSlice = createSlice({
  name: 'courseAssignment',
  initialState,
  reducers: {
    reset() {
      return {
        ...initialState,
      };
    },
    clearAssignmentSuccess(state) {
      state.assignmentSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      // Assign course to teacher
      .addCase(assignCourseToTeacher.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.assignmentSuccess = false;
      })
      .addCase(assignCourseToTeacher.fulfilled, state => {
        state.loading = false;
        state.assignmentSuccess = true;
        state.errorMessage = null;
      })
      .addCase(assignCourseToTeacher.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to assign course to teacher';
        state.assignmentSuccess = false;
      })
      // Assign course to classes
      .addCase(assignCourseToClasses.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.assignmentSuccess = false;
      })
      .addCase(assignCourseToClasses.fulfilled, state => {
        state.loading = false;
        state.assignmentSuccess = true;
        state.errorMessage = null;
      })
      .addCase(assignCourseToClasses.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to assign course to classes';
        state.assignmentSuccess = false;
      })
      // Get available teachers
      .addCase(getAvailableTeachers.pending, state => {
        state.loading = true;
      })
      .addCase(getAvailableTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.availableTeachers = action.payload;
      })
      .addCase(getAvailableTeachers.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch teachers';
      })
      // Get available classes
      .addCase(getAvailableClasses.pending, state => {
        state.loading = true;
      })
      .addCase(getAvailableClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.availableClasses = action.payload;
      })
      .addCase(getAvailableClasses.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch classes';
      });
  },
});

export const { reset, clearAssignmentSuccess } = CourseAssignmentSlice.actions;

export default CourseAssignmentSlice.reducer;
