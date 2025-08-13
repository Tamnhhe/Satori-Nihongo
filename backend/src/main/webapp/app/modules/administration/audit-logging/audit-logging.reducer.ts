import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  auditLogs: [] as IAuditLog[],
  securityEvents: [] as ISecurityEvent[],
  auditStatistics: {} as Record<string, any>,
  securityStatistics: {} as Record<string, any>,
  totalItems: 0,
  totalSecurityItems: 0,
};

export type AuditLoggingState = Readonly<typeof initialState>;

// Interfaces
export interface IAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  result: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface ISecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  severity: string;
  source: string;
  userId: string;
  username: string;
  ipAddress: string;
  userAgent: string;
  description: string;
  details: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  metadata?: Record<string, any>;
}

export interface IAuditSearchCriteria {
  startDate?: string;
  endDate?: string;
  userId?: string;
  username?: string;
  actions?: string[];
  resources?: string[];
  ipAddress?: string;
  results?: string[];
  searchText?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

// Async actions
export const searchAuditLogs = createAsyncThunk(
  'auditLogging/search_audit_logs',
  async (criteria: IAuditSearchCriteria) => {
    const response = await axios.post<{ content: IAuditLog[]; totalElements: number }>('/api/admin/audit/logs/search', criteria);
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const getSecurityEvents = createAsyncThunk(
  'auditLogging/get_security_events',
  async (params: { page?: number; size?: number; severity?: string; includeResolved?: boolean }) => {
    const { page = 0, size = 20, severity, includeResolved = false } = params;
    const response = await axios.get<{ content: ISecurityEvent[]; totalElements: number }>(
      `/api/admin/audit/security-events?page=${page}&size=${size}${severity ? `&severity=${severity}` : ''}&includeResolved=${includeResolved}`,
    );
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const getAuditStatistics = createAsyncThunk(
  'auditLogging/get_audit_statistics',
  async (params: { startDate: string; endDate: string }) => {
    const response = await axios.get<Record<string, any>>(
      `/api/admin/audit/statistics?startDate=${params.startDate}&endDate=${params.endDate}`,
    );
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const getSecurityStatistics = createAsyncThunk(
  'auditLogging/get_security_statistics',
  async () => {
    const response = await axios.get<Record<string, any>>('/api/admin/audit/security-statistics');
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const resolveSecurityEvent = createAsyncThunk(
  'auditLogging/resolve_security_event',
  async (params: { eventId: string; resolvedBy: string }) => {
    await axios.post(`/api/admin/audit/security-events/${params.eventId}/resolve`, {
      resolvedBy: params.resolvedBy,
    });
    return params.eventId;
  },
  {
    serializeError: serializeAxiosError,
  },
);

// Slice
export const AuditLoggingSlice = createSlice({
  name: 'auditLogging',
  initialState: initialState as AuditLoggingState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(searchAuditLogs.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(searchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload.content;
        state.totalItems = action.payload.totalElements;
      })
      .addCase(searchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getSecurityEvents.fulfilled, (state, action) => {
        state.securityEvents = action.payload.content;
        state.totalSecurityItems = action.payload.totalElements;
      })
      .addCase(getAuditStatistics.fulfilled, (state, action) => {
        state.auditStatistics = action.payload;
      })
      .addCase(getSecurityStatistics.fulfilled, (state, action) => {
        state.securityStatistics = action.payload;
      })
      .addCase(resolveSecurityEvent.fulfilled, (state, action) => {
        const eventIndex = state.securityEvents.findIndex(event => event.id === action.payload);
        if (eventIndex !== -1) {
          state.securityEvents[eventIndex].resolved = true;
          state.securityEvents[eventIndex].resolvedAt = new Date().toISOString();
        }
      });
  },
});

export const { reset } = AuditLoggingSlice.actions;

export default AuditLoggingSlice.reducer;
