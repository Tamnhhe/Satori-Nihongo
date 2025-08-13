import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  monitoring: null as ISystemMonitoring | null,
  historicalMetrics: {} as Record<string, Array<{ timestamp: string; value: number }>>,
  lastUpdated: null as string | null,
};

export type SystemMonitoringState = Readonly<typeof initialState>;

// Interfaces
export interface ISystemMonitoring {
  health: ISystemHealth;
  performance: IPerformanceMetrics;
  recentErrors: IErrorLog[];
  activeAlerts: IAlert[];
  customMetrics: Record<string, any>;
}

export interface ISystemHealth {
  status: string;
  components: Record<string, IComponentHealth>;
  lastChecked: string;
}

export interface IComponentHealth {
  status: string;
  description?: string;
  details?: Record<string, any>;
  responseTime?: number;
}

export interface IPerformanceMetrics {
  cpu: ICpuMetrics;
  memory: IMemoryMetrics;
  disk: IDiskMetrics;
  network: INetworkMetrics;
  database: IDatabaseMetrics;
}

export interface ICpuMetrics {
  usage: number;
  loadAverage: number;
  cores: number;
}

export interface IMemoryMetrics {
  total: number;
  used: number;
  free: number;
  usagePercentage: number;
}

export interface IDiskMetrics {
  total: number;
  used: number;
  free: number;
  usagePercentage: number;
}

export interface INetworkMetrics {
  bytesReceived: number;
  bytesSent: number;
  packetsReceived: number;
  packetsSent: number;
}

export interface IDatabaseMetrics {
  activeConnections: number;
  maxConnections: number;
  connectionUsagePercentage: number;
  queryCount: number;
  averageQueryTime: number;
}

export interface IErrorLog {
  timestamp: string;
  level: string;
  message: string;
  logger: string;
  exception?: string;
}

export interface IAlert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  createdAt: string;
  acknowledged: boolean;
}

// Async actions
export const getSystemMonitoring = createAsyncThunk(
  'systemMonitoring/fetch_monitoring',
  async () => {
    const response = await axios.get<ISystemMonitoring>('/api/admin/system-monitoring');
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const acknowledgeAlert = createAsyncThunk(
  'systemMonitoring/acknowledge_alert',
  async (alertId: string) => {
    await axios.post(`/api/admin/system-monitoring/alerts/${alertId}/acknowledge`);
    return alertId;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const getHistoricalMetrics = createAsyncThunk(
  'systemMonitoring/fetch_historical_metrics',
  async (timeRange: string = '1h') => {
    const response = await axios.get<Record<string, Array<{ timestamp: string; value: number }>>>(
      `/api/admin/system-monitoring/metrics/historical?timeRange=${timeRange}`,
    );
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

// Slice
export const SystemMonitoringSlice = createSlice({
  name: 'systemMonitoring',
  initialState: initialState as SystemMonitoringState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getSystemMonitoring.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getSystemMonitoring.fulfilled, (state, action) => {
        state.loading = false;
        state.monitoring = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getSystemMonitoring.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(acknowledgeAlert.fulfilled, (state, action) => {
        if (state.monitoring?.activeAlerts) {
          const alertIndex = state.monitoring.activeAlerts.findIndex(alert => alert.id === action.payload);
          if (alertIndex !== -1) {
            state.monitoring.activeAlerts[alertIndex].acknowledged = true;
          }
        }
      })
      .addCase(getHistoricalMetrics.fulfilled, (state, action) => {
        state.historicalMetrics = action.payload;
      });
  },
});

export const { reset } = SystemMonitoringSlice.actions;

export default SystemMonitoringSlice.reducer;
