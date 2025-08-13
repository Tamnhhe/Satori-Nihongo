import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';

interface CourseManagementState extends EntityState<ICourse> {
  viewMode?: 'grid' | 'list';
  selectedEntities?: number[];
}

const initialState: CourseManagementState = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  viewMode: 'grid',
  selectedEntities: [],
};

const apiUrl = 'api/courses';

// Course interface
export interface ICourse {
  id?: number;
  title?: string;
  description?: string;
  courseCode?: string;
  teacher?: {
    id?: number;
    fullName?: string;
    username?: string;
  };
  enrollmentCount?: number;
  lessonsCount?: number;
  quizzesCount?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}

// Enhanced course interface with statistics
export interface ICourseWithStats extends ICourse {
  enrollmentCount: number;
  lessonsCount: number;
  quizzesCount: number;
  completionRate: number;
  averageScore: number;
}

// Async thunks
export const getEntities = createAsyncThunk('courseManagement/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<ICourse[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'courseManagement/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<ICourse>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'courseManagement/create_entity',
  async (entity: ICourse) => {
    const result = await axios.post<ICourse>(`${apiUrl}/manage`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'courseManagement/update_entity',
  async (entity: ICourse) => {
    const result = await axios.put<ICourse>(`${apiUrl}/manage/${entity.id}`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'courseManagement/partial_update_entity',
  async (entity: ICourse) => {
    const result = await axios.patch<ICourse>(`${apiUrl}/manage/${entity.id}`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'courseManagement/delete_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/manage/${id}`;
    const result = await axios.delete(requestUrl);
    return result;
  },
  { serializeError: serializeAxiosError },
);

// Get courses with statistics
export const getCoursesWithStats = createAsyncThunk(
  'courseManagement/fetch_courses_with_stats',
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}/manage?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<ICourseWithStats[]>(requestUrl);
  },
);

// Get courses by teacher
export const getCoursesByTeacher = createAsyncThunk(
  'courseManagement/fetch_courses_by_teacher',
  async ({ teacherId, page, size, sort }: IQueryParams & { teacherId: number }) => {
    const requestUrl = `${apiUrl}/teacher/${teacherId}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<ICourse[]>(requestUrl);
  },
);

// Slice
export const CourseManagementSlice = createSlice({
  name: 'courseManagement',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    setViewMode(state, action: PayloadAction<'grid' | 'list'>) {
      state.viewMode = action.payload;
    },
    setSelectedCourses(state, action: PayloadAction<number[]>) {
      state.selectedEntities = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(
        action => action.type.endsWith('/pending'),
        state => {
          state.errorMessage = null;
          state.updateSuccess = false;
          state.loading = true;
        },
      )
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.errorMessage = action.error?.message || 'An error occurred';
        },
      )
      .addMatcher(
        action =>
          action.type.endsWith('/fulfilled') && (action.type.includes('fetch_entity_list') || action.type.includes('fetch_courses')),
        (state, action: any) => {
          const { data, headers } = action.payload;
          state.loading = false;
          state.entities = data;
          state.totalItems = parseInt(headers['x-total-count'], 10);
        },
      )
      .addMatcher(
        action => action.type.endsWith('/fulfilled') && (action.type.includes('create') || action.type.includes('update')),
        (state, action: any) => {
          state.updating = false;
          state.loading = false;
          state.updateSuccess = true;
          state.entity = action.payload.data;
        },
      );
  },
});

export const { reset, setViewMode, setSelectedCourses } = CourseManagementSlice.actions;

// Reducer
export default CourseManagementSlice.reducer;
