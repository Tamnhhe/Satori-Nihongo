import axios from 'axios';
import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  roleDistribution: Array<{
    role: string;
    count: number;
  }>;
}

export interface SystemAlert {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface AdminDashboardStats {
  userStats: UserStats;
  systemAlerts: SystemAlert[];
  recentActivity: RecentActivity[];
}

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  stats: null as AdminDashboardStats | null,
};

export type AdminDashboardState = Readonly<typeof initialState>;

// Actions
export const getAdminDashboardStats = createAsyncThunk(
  'adminDashboard/fetch_stats',
  async () => {
    // For now, we'll use existing endpoints and mock some data
    // In a real implementation, you'd create a dedicated admin dashboard endpoint
    const usersResponse = await axios.get<any>('api/admin/users?size=1');

    // Mock data for demonstration - replace with real API calls
    const mockStats: AdminDashboardStats = {
      userStats: {
        totalUsers: usersResponse.headers['x-total-count'] || 0,
        activeUsers: Math.floor((usersResponse.headers['x-total-count'] || 0) * 0.8),
        newRegistrations: Math.floor((usersResponse.headers['x-total-count'] || 0) * 0.1),
        roleDistribution: [
          { role: 'ADMIN', count: 2 },
          { role: 'GIANG_VIEN', count: 15 },
          { role: 'HOC_VIEN', count: (usersResponse.headers['x-total-count'] || 0) - 17 },
        ],
      },
      systemAlerts: [
        // Mock alerts - replace with real system monitoring
      ],
      recentActivity: [
        {
          id: '1',
          action: 'User Created',
          user: 'admin',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'New user account created',
        },
        {
          id: '2',
          action: 'Course Updated',
          user: 'teacher1',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: 'Course content modified',
        },
        {
          id: '3',
          action: 'System Backup',
          user: 'system',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          details: 'Daily backup completed',
        },
      ],
    };

    return { data: mockStats };
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const AdminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState: initialState as AdminDashboardState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addMatcher(isPending(getAdminDashboardStats), state => {
        state.errorMessage = null;
        state.loading = true;
      })
      .addMatcher(isRejected(getAdminDashboardStats), (state, action) => {
        state.errorMessage = action.error.message;
        state.loading = false;
      });
  },
});

export const { reset } = AdminDashboardSlice.actions;

// Reducer
export default AdminDashboardSlice.reducer;
