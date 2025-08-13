import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState: EntityState<IQuizManagement> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = 'api/admin/quizzes';

// Async thunks
export const getQuizzes = createAsyncThunk('quizManagement/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}/management?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<IQuizManagement[]>(requestUrl);
});

export const getQuizForBuilder = createAsyncThunk(
  'quizManagement/fetch_quiz_builder',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/builder/${id}`;
    return axios.get<IQuizBuilder>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createQuizWithBuilder = createAsyncThunk(
  'quizManagement/create_quiz_builder',
  async (entity: IQuizBuilder) => {
    const result = await axios.post<IQuizBuilder>(`${apiUrl}/builder`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateQuizWithBuilder = createAsyncThunk(
  'quizManagement/update_quiz_builder',
  async (entity: IQuizBuilder) => {
    const result = await axios.put<IQuizBuilder>(`${apiUrl}/builder/${entity.id}`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const reorderQuestions = createAsyncThunk(
  'quizManagement/reorder_questions',
  async ({ quizId, questionOrders }: { quizId: number; questionOrders: IQuestionOrder[] }) => {
    const result = await axios.post<IQuizBuilder>(`${apiUrl}/${quizId}/reorder`, questionOrders);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const getAvailableQuestions = createAsyncThunk(
  'quizManagement/fetch_available_questions',
  async ({ page, size, sort, search, type }: IQueryParams & { search?: string; type?: string }) => {
    let requestUrl = `${apiUrl}/questions?`;
    if (page !== undefined) requestUrl += `page=${page}&`;
    if (size !== undefined) requestUrl += `size=${size}&`;
    if (sort) requestUrl += `sort=${sort}&`;
    if (search) requestUrl += `search=${search}&`;
    if (type) requestUrl += `type=${type}&`;
    requestUrl += `cacheBuster=${new Date().getTime()}`;

    return axios.get<IQuestion[]>(requestUrl);
  },
);

export const getQuizSettings = createAsyncThunk(
  'quizManagement/fetch_quiz_settings',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}/settings`;
    return axios.get<IQuizSettings>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const updateQuizSettings = createAsyncThunk(
  'quizManagement/update_quiz_settings',
  async (entity: IQuizSettings) => {
    const result = await axios.put<IQuizSettings>(`${apiUrl}/${entity.quizId}/settings`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const QuizManagementSlice = createSlice({
  name: 'quizManagement',
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
      .addCase(getQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
        state.totalItems = parseInt(action.payload.headers['x-total-count'], 10);
      })
      .addCase(getQuizForBuilder.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(createQuizWithBuilder.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addCase(updateQuizWithBuilder.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addCase(reorderQuestions.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addCase(getAvailableQuestions.fulfilled, (state, action) => {
        state.loading = false;
        // Store available questions in a separate field if needed
      })
      .addCase(getQuizSettings.fulfilled, (state, action) => {
        state.loading = false;
        // Store settings in entity or separate field
      })
      .addCase(updateQuizSettings.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
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
        (state, action) => {
          state.loading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.errorMessage = (action as any).error?.message ?? 'Request failed';
        },
      );
  },
});

export const { reset, resetUpdateSuccess } = QuizManagementSlice.actions;

// Reducer
export default QuizManagementSlice.reducer;

// Types
export interface IQuizManagement {
  id?: number;
  title?: string;
  description?: string;
  quizType?: string;
  isTest?: boolean;
  isPractice?: boolean;
  isActive?: boolean;
  timeLimitMinutes?: number;
  activationTime?: string;
  deactivationTime?: string;
  questionCount?: number;
  courseNames?: string[];
  lessonNames?: string[];
}

export interface IQuizBuilder {
  id?: number;
  title?: string;
  description?: string;
  isTest?: boolean;
  isPractice?: boolean;
  quizType?: string;
  timeLimitMinutes?: number;
  questions?: IQuizQuestionBuilder[];
  courseIds?: number[];
  lessonIds?: number[];
}

export interface IQuizQuestionBuilder {
  questionId?: number;
  position?: number;
  content?: string;
  type?: string;
  correctAnswer?: string;
  imageUrl?: string;
  suggestion?: string;
  answerExplanation?: string;
}

export interface IQuestionOrder {
  questionId: number;
  position: number;
}

export interface IQuestion {
  id?: number;
  content?: string;
  type?: string;
  correctAnswer?: string;
  imageUrl?: string;
  suggestion?: string;
  answerExplanation?: string;
}

export interface IQuizSettings {
  quizId?: number;
  timeLimitMinutes?: number;
  isActive?: boolean;
  activationTime?: string;
  deactivationTime?: string;
  maxAttempts?: number;
  showResultsImmediately?: boolean;
  randomizeQuestions?: boolean;
  randomizeAnswers?: boolean;
}
