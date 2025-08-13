import axios from 'axios';
import { IUser } from 'app/shared/model/user.model';

export interface IUserSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  role?: string;
  status?: string;
}

export interface IUserBulkAction {
  action: string;
  userIds: string[];
  data?: any;
}

export interface IUserExportParams {
  format: 'csv' | 'excel';
  filters?: IUserSearchParams;
}

export interface IUserImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

class UserManagementService {
  private readonly apiUrl = 'api/admin/users';
  private readonly userProfileUrl = 'api/user-profiles';

  // Enhanced user search with filtering
  async searchUsers(params: IUserSearchParams): Promise<{ users: IUser[]; totalItems: number }> {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);

    const response = await axios.get(`${this.apiUrl}/search?${queryParams.toString()}`);

    return {
      users: response.data,
      totalItems: parseInt(response.headers['x-total-count'], 10) || 0,
    };
  }

  // Get user with extended profile information
  async getUserWithProfile(login: string): Promise<IUser> {
    const response = await axios.get(`${this.apiUrl}/${login}/profile`);
    return response.data;
  }

  // Bulk user operations
  async performBulkAction(bulkAction: IUserBulkAction): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/bulk`, bulkAction);
    return response.data;
  }

  // Export users to CSV/Excel
  async exportUsers(params: IUserExportParams): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('format', params.format);

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await axios.get(`${this.apiUrl}/export?${queryParams.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  }

  // Import users from CSV
  async importUsers(file: File): Promise<IUserImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${this.apiUrl}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Update user role
  async updateUserRole(userId: string, role: string): Promise<IUser> {
    const response = await axios.patch(`${this.apiUrl}/${userId}/role`, { role });
    return response.data;
  }

  // Activate/Deactivate user
  async updateUserStatus(userId: string, activated: boolean): Promise<IUser> {
    const response = await axios.patch(`${this.apiUrl}/${userId}/status`, { activated });
    return response.data;
  }

  // Get user statistics for dashboard
  async getUserStatistics(): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/statistics`);
    return response.data;
  }

  // Get social accounts for a user
  async getUserSocialAccounts(userId: string): Promise<any[]> {
    const response = await axios.get(`${this.userProfileUrl}/${userId}/social-accounts`);
    return response.data;
  }

  // Unlink social account
  async unlinkSocialAccount(userId: string, provider: string): Promise<void> {
    await axios.delete(`${this.userProfileUrl}/${userId}/social-accounts/${provider}`);
  }

  // Advanced user search with multiple criteria
  async advancedSearch(criteria: {
    name?: string;
    email?: string;
    role?: string[];
    status?: string;
    dateRange?: { from: Date; to: Date };
    hasTeacherProfile?: boolean;
    hasStudentProfile?: boolean;
    hasSocialAccounts?: boolean;
  }): Promise<{ users: IUser[]; totalItems: number }> {
    const response = await axios.post(`${this.apiUrl}/advanced-search`, criteria);

    return {
      users: response.data.content || response.data,
      totalItems: response.data.totalElements || response.data.length,
    };
  }
}

export const userManagementService = new UserManagementService();
export default userManagementService;
