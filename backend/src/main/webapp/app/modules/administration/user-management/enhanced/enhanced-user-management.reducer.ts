import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser, defaultValue } from 'app/shared/model/user.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import userManagementService, { IUserSearchParams, IUserBulkAction, IUserExportParams } from './user-management.service';

export interface IEnhancedUserManagementState {
  loading: boolean;
  errorMessage: string | null;
  users: ReadonlyArray<IUser>;
  user: IUser;
  updating: boolean;
  updateSuccess: boolean;
  totalItems: number;
  // Enhanced state
  searchParams: IUserSearchParams;
  selectedUsers: string[];
  bulkActionLoading: boolean;
  exportLoading: boolean;
  importLoading: boolean;
  importResult: any;
  userStatistics: any;
  filters: {
    roles: string[];
    statuses: string[];
  };
}

const initialState: IEnhancedUserManagementState = {
  loading: false,
  errorMessage: null,
  users: [],
  user: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
  searchParams: {},
  selectedUsers: [],
  bulkActionLoading: false,
  exportLoading: false,
  importLoading: false,
  importResult: null,
  userStatistics: null,
  filters: {
    roles: ['ADMIN', 'GIANG_VIEN', 'HOC_VIEN'],
    statuses: ['active', 'inactive'],
  },
};

// Enhanced async actions
export const searchUsers = createAsyncThunk(
  'enhancedUserManagement/search_users',
  async (params: IUserSearchParams) => {
    return await userManagementService.searchUsers(params);
  },
  { serializeError: serializeAxiosError },
);

export const getUserWithProfile = createAsyncThunk(
  'enhancedUserManagement/get_user_with_profile',
  async (login: string) => {
    return await userManagementService.getUserWithProfile(login);
  },
  { serializeError: serializeAxiosError },
);

export const performBulkAction = createAsyncThunk(
  'enhancedUserManagement/bulk_action',
  async (bulkAction: IUserBulkAction, thunkAPI) => {
    const result = await userManagementService.performBulkAction(bulkAction);
    // Refresh users after bulk action
    const state = thunkAPI.getState() as any;
    thunkAPI.dispatch(searchUsers(state.enhancedUserManagement.searchParams));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const exportUsers = createAsyncThunk(
  'enhancedUserManagement/export_users',
  async (params: IUserExportParams) => {
    const blob = await userManagementService.exportUsers(params);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export.${params.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  },
  { serializeError: serializeAxiosError },
);

export const importUsers = createAsyncThunk(
  'enhancedUserManagement/import_users',
  async (file: File, thunkAPI) => {
    const result = await userManagementService.importUsers(file);
    // Refresh users after import
    const state = thunkAPI.getState() as any;
    thunkAPI.dispatch(searchUsers(state.enhancedUserManagement.searchParams));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateUserRole = createAsyncThunk(
  'enhancedUserManagement/update_user_role',
  async ({ userId, role }: { userId: string; role: string }, thunkAPI) => {
    const result = await userManagementService.updateUserRole(userId, role);
    // Refresh users after role update
    const state = thunkAPI.getState() as any;
    thunkAPI.dispatch(searchUsers(state.enhancedUserManagement.searchParams));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateUserStatus = createAsyncThunk(
  'enhancedUserManagement/update_user_status',
  async ({ userId, activated }: { userId: string; activated: boolean }, thunkAPI) => {
    const result = await userManagementService.updateUserStatus(userId, activated);
    // Refresh users after status update
    const state = thunkAPI.getState() as any;
    thunkAPI.dispatch(searchUsers(state.enhancedUserManagement.searchParams));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const getUserStatistics = createAsyncThunk(
  'enhancedUserManagement/get_user_statistics',
  async () => {
    return await userManagementService.getUserStatistics();
  },
  { serializeError: serializeAxiosError },
);

export const advancedSearch = createAsyncThunk(
  'enhancedUserManagement/advanced_search',
  async (criteria: any) => {
    return await userManagementService.advancedSearch(criteria);
  },
  { serializeError: serializeAxiosError },
);

export const updateUser = createAsyncThunk(
  'enhancedUserManagement/update_user',
  async (user: any, thunkAPI) => {
    // Use axios directly for now
    const response = await axios.put('api/admin/users', user);
    // Refresh users after update
    const state = thunkAPI.getState() as any;
    thunkAPI.dispatch(searchUsers(state.enhancedUserManagement.searchParams));
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const EnhancedUserManagementSlice = createSlice({
  name: 'enhancedUserManagement',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    setSearchParams(state, action) {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    setSelectedUsers(state, action) {
      state.selectedUsers = action.payload;
    },
    toggleUserSelection(state, action) {
      const userId = action.payload;
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId);
      } else {
        state.selectedUsers = [...state.selectedUsers, userId];
      }
    },
    selectAllUsers(state) {
      state.selectedUsers = state.users.map(user => user.id?.toString() || '');
    },
    clearSelection(state) {
      state.selectedUsers = [];
    },
    clearImportResult(state) {
      state.importResult = null;
    },
  },
  extraReducers(builder) {
    builder
      // Search users
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalItems = action.payload.totalItems;
      })
      // Get user with profile
      .addCase(getUserWithProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      // Bulk actions
      .addCase(performBulkAction.fulfilled, (state, action) => {
        state.bulkActionLoading = false;
        state.updateSuccess = true;
        state.selectedUsers = [];
      })
      // Export
      .addCase(exportUsers.fulfilled, (state, action) => {
        state.exportLoading = false;
      })
      // Import
      .addCase(importUsers.fulfilled, (state, action) => {
        state.importLoading = false;
        state.importResult = action.payload;
      })
      // Update user role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
      })
      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
      })
      // User statistics
      .addCase(getUserStatistics.fulfilled, (state, action) => {
        state.userStatistics = action.payload;
      })
      // Advanced search
      .addCase(advancedSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalItems = action.payload.totalItems;
      })
      // Pending states
      .addMatcher(isPending(searchUsers, getUserWithProfile, advancedSearch), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(performBulkAction), state => {
        state.bulkActionLoading = true;
        state.errorMessage = null;
      })
      .addMatcher(isPending(exportUsers), state => {
        state.exportLoading = true;
        state.errorMessage = null;
      })
      .addMatcher(isPending(importUsers), state => {
        state.importLoading = true;
        state.errorMessage = null;
      })
      .addMatcher(isPending(updateUserRole, updateUserStatus, updateUser), state => {
        state.updating = true;
        state.errorMessage = null;
        state.updateSuccess = false;
      })
      // Rejected states
      .addMatcher(
        isRejected(
          searchUsers,
          getUserWithProfile,
          performBulkAction,
          exportUsers,
          importUsers,
          updateUserRole,
          updateUserStatus,
          getUserStatistics,
          advancedSearch,
          updateUser,
        ),
        (state, action) => {
          state.loading = false;
          state.updating = false;
          state.bulkActionLoading = false;
          state.exportLoading = false;
          state.importLoading = false;
          state.updateSuccess = false;
          state.errorMessage = action.error.message || 'An error occurred';
        },
      );
  },
});

export const { reset, setSearchParams, setSelectedUsers, toggleUserSelection, selectAllUsers, clearSelection, clearImportResult } =
  EnhancedUserManagementSlice.actions;

export default EnhancedUserManagementSlice.reducer;
