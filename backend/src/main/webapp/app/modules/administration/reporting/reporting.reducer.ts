import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { IReportConfiguration, IReportData, IScheduledReportExecution } from 'app/shared/model/reporting.model';

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  templates: [] as IReportConfiguration[],
  generatedReport: null as IReportData | null,
  scheduledReports: [] as IReportConfiguration[],
  executionHistory: [] as IScheduledReportExecution[],
  exportLoading: false,
};

export type ReportingState = Readonly<typeof initialState>;

// Actions
export const getReportTemplates = createAsyncThunk('reporting/fetch_templates', async () => {
  const requestUrl = 'api/admin/reports/templates';
  return axios.get<IReportConfiguration[]>(requestUrl);
});

export const generateReport = createAsyncThunk('reporting/generate_report', async (config: IReportConfiguration) => {
  const requestUrl = 'api/admin/reports/generate';
  return axios.post<IReportData>(requestUrl, config);
});

export const exportReport = createAsyncThunk('reporting/export_report', async (request: { report: IReportData; format: string }) => {
  const requestUrl = 'api/admin/reports/export';
  return axios.post(requestUrl, request, {
    responseType: 'blob',
  });
});

export const scheduleReport = createAsyncThunk('reporting/schedule_report', async (config: IReportConfiguration) => {
  const requestUrl = 'api/admin/reports/schedule';
  return axios.post(requestUrl, config);
});

export const getScheduledReports = createAsyncThunk('reporting/fetch_scheduled', async () => {
  const requestUrl = 'api/admin/reports/scheduled';
  return axios.get<IReportConfiguration[]>(requestUrl);
});

export const unscheduleReport = createAsyncThunk('reporting/unschedule_report', async (scheduleId: string) => {
  const requestUrl = `api/admin/reports/scheduled/${scheduleId}`;
  return axios.delete(requestUrl);
});

export const getExecutionHistory = createAsyncThunk('reporting/fetch_execution_history', async () => {
  const requestUrl = 'api/admin/reports/execution-history';
  return axios.get<IScheduledReportExecution[]>(requestUrl);
});

export const validateReportConfiguration = createAsyncThunk('reporting/validate_config', async (config: IReportConfiguration) => {
  const requestUrl = 'api/admin/reports/validate';
  return axios.post(requestUrl, config);
});

// Slice
export const ReportingSlice = createSlice({
  name: 'reporting',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    clearGeneratedReport(state) {
      state.generatedReport = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getReportTemplates.pending, state => {
        state.loading = true;
      })
      .addCase(getReportTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.data;
      })
      .addCase(getReportTemplates.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(generateReport.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedReport = action.payload.data;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(exportReport.pending, state => {
        state.exportLoading = true;
      })
      .addCase(exportReport.fulfilled, state => {
        state.exportLoading = false;
      })
      .addCase(exportReport.rejected, (state, action) => {
        state.exportLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(scheduleReport.pending, state => {
        state.loading = true;
      })
      .addCase(scheduleReport.fulfilled, state => {
        state.loading = false;
      })
      .addCase(scheduleReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getScheduledReports.fulfilled, (state, action) => {
        state.scheduledReports = action.payload.data;
      })
      .addCase(getExecutionHistory.fulfilled, (state, action) => {
        state.executionHistory = action.payload.data;
      });
  },
});

export const { reset, clearGeneratedReport } = ReportingSlice.actions;

// Reducer
export const reportingReducer = ReportingSlice.reducer;
