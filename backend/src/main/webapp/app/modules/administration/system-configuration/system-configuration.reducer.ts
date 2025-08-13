import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  configuration: null as ISystemConfiguration | null,
  validationErrors: {} as Record<string, string>,
  backupId: null as string | null,
  updateSuccess: false,
};

export type SystemConfigurationState = Readonly<typeof initialState>;

// Interfaces
export interface ISystemConfiguration {
  security: ISecurityConfiguration;
  oauth2: IOAuth2Configuration;
  featureToggles: Record<string, IFeatureToggle>;
  systemParameters: Record<string, string>;
}

export interface ISecurityConfiguration {
  contentSecurityPolicy: string;
  sessionTimeoutMinutes: number;
  requireHttps: boolean;
  enableCsrfProtection: boolean;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
}

export interface IOAuth2Configuration {
  enabled: boolean;
  redirectBaseUrl: string;
  providers: Record<string, IOAuth2Provider>;
  token: ITokenConfiguration;
  encryption: IEncryptionConfiguration;
}

export interface IOAuth2Provider {
  clientId: string;
  clientSecret: string;
  scope: string;
  enabled: boolean;
}

export interface ITokenConfiguration {
  refreshThresholdMinutes: number;
  defaultExpiryHours: number;
  cleanupDays: number;
}

export interface IEncryptionConfiguration {
  key: string;
}

export interface IFeatureToggle {
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

// Async actions
export const getSystemConfiguration = createAsyncThunk(
  'systemConfiguration/fetch_configuration',
  async () => {
    const response = await axios.get<ISystemConfiguration>('/api/admin/system-configuration');
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const updateSystemConfiguration = createAsyncThunk(
  'systemConfiguration/update_configuration',
  async (configuration: ISystemConfiguration) => {
    const response = await axios.put<ISystemConfiguration>('/api/admin/system-configuration', configuration);
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const validateConfiguration = createAsyncThunk(
  'systemConfiguration/validate_configuration',
  async (configuration: ISystemConfiguration) => {
    const response = await axios.post<Record<string, string>>('/api/admin/system-configuration/validate', configuration);
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const createConfigurationBackup = createAsyncThunk(
  'systemConfiguration/create_backup',
  async () => {
    const response = await axios.post<{ backupId: string }>('/api/admin/system-configuration/backup');
    return response.data.backupId;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const restoreConfigurationFromBackup = createAsyncThunk(
  'systemConfiguration/restore_backup',
  async (backupId: string) => {
    await axios.post('/api/admin/system-configuration/restore', { backupId });
    return backupId;
  },
  {
    serializeError: serializeAxiosError,
  },
);

// Slice
export const SystemConfigurationSlice = createSlice({
  name: 'systemConfiguration',
  initialState: initialState as SystemConfigurationState,
  reducers: {
    reset: () => initialState,
    clearValidationErrors(state) {
      state.validationErrors = {};
    },
    clearUpdateSuccess(state) {
      state.updateSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSystemConfiguration.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getSystemConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.configuration = action.payload;
      })
      .addCase(getSystemConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(updateSystemConfiguration.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.updateSuccess = false;
      })
      .addCase(updateSystemConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.configuration = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateSystemConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
        state.updateSuccess = false;
      })
      .addCase(validateConfiguration.fulfilled, (state, action) => {
        state.validationErrors = action.payload;
      })
      .addCase(createConfigurationBackup.fulfilled, (state, action) => {
        state.backupId = action.payload;
      })
      .addCase(restoreConfigurationFromBackup.fulfilled, state => {
        state.loading = false;
      });
  },
});

export const { reset, clearValidationErrors, clearUpdateSuccess } = SystemConfigurationSlice.actions;

export default SystemConfigurationSlice.reducer;
