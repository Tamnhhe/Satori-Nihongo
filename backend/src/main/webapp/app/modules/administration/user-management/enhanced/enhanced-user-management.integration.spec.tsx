import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedUserManagement } from './enhanced-user-management';
import { renderWithProviders } from '../../../../shared/util/test-utils';
import {
  createMockAxios,
  setupCommonApiMocks,
  API_ENDPOINTS,
  generateMockUsers,
  mockPaginatedResponse,
  simulateServerError,
  simulateNetworkError,
  validateApiRequest,
  validatePaginationParams,
  MockAxiosType,
} from '../../../../shared/util/api-test-utils';

describe('EnhancedUserManagement Integration Tests', () => {
  let mockAxios: MockAxiosType;

  beforeEach(() => {
    mockAxios = createMockAxios();
    setupCommonApiMocks(mockAxios);
  });

  describe('API Integration', () => {
    it('should fetch users on component mount', async () => {
      const mockUsers = generateMockUsers(5);
      mockAxios.onGet(API_ENDPOINTS.USERS).reply(200, mockPaginatedResponse(mockUsers));

      renderWithProviders(<EnhancedUserManagement />);

      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].fullName)).toBeInTheDocument();
        expect(screen.getByText(mockUsers[1].fullName)).toBeInTheDocument();
      });

      // Verify API call was made
      expect(mockAxios.history.get).toHaveLength(1);
      expect(mockAxios.history.get[0].url).toContain(API_ENDPOINTS.USERS);
    });

    it('should handle pagination API calls', async () => {
      const mockUsers = generateMockUsers(25);
      const firstPage = mockUsers.slice(0, 20);
      const secondPage = mockUsers.slice(20);

      mockAxios.onGet(API_ENDPOINTS.USERS).reply(config => {
        const params = new URLSearchParams(config.url?.split('?')[1]);
        const page = parseInt(params.get('page') || '0', 10);
        const size = parseInt(params.get('size') || '20', 10);

        if (page === 0) {
          return [200, mockPaginatedResponse(firstPage, 0, size, 25)];
        } else {
          return [200, mockPaginatedResponse(secondPage, 1, size, 25)];
        }
      });

      const user = userEvent.setup();
      renderWithProviders(<EnhancedUserManagement />);

      // Wait for first page to load
      await waitFor(() => {
        expect(screen.getByText(firstPage[0].fullName)).toBeInTheDocument();
      });

      // Click next page
      const nextPageButton = screen.getByTestId('next-page-button');
      await user.click(nextPageButton);

      // Wait for second page to load
      await waitFor(() => {
        expect(screen.getByText(secondPage[0].fullName)).toBeInTheDocument();
      });

      // Verify pagination API calls
      expect(mockAxios.history.get).toHaveLength(2);
      validatePaginationParams(mockAxios.history.get[0], 0, 20);
      validatePaginationParams(mockAxios.history.get[1], 1, 20);
    });

    it('should handle search API calls', async () => {
      const mockUsers = generateMockUsers(3);
      const searchTerm = 'john';

      mockAxios.onGet(API_ENDPOINTS.USERS).reply(config => {
        const params = new URLSearchParams(config.url?.split('?')[1]);
        const search = params.get('search');

        if (search === searchTerm) {
          const filteredUsers = mockUsers.filter(user => user.fullName.toLowerCase().includes(searchTerm));
          return [200, mockPaginatedResponse(filteredUsers)];
        }

        return [200, mockPaginatedResponse(mockUsers)];
      });

      const user = userEvent.setup();
      renderWithProviders(<EnhancedUserManagement />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].fullName)).toBeInTheDocument();
      });

      // Perform search
      const searchInput = screen.getByPlaceholderText(/search users/i);
      await user.type(searchInput, searchTerm);

      // Wait for search results
      await waitFor(() => {
        expect(mockAxios.history.get.length).toBeGreaterThan(1);
      });

      // Verify search API call
      const searchCall = mockAxios.history.get.find(call => call.url?.includes(`search=${searchTerm}`));
      expect(searchCall).toBeDefined();
    });

    it('should handle user creation API calls', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        fullName: 'New User',
        role: 'HOC_VIEN',
      };

      mockAxios.onPost(API_ENDPOINTS.USERS).reply(201, { id: 'new-user-id', ...newUser });

      const user = userEvent.setup();
      renderWithProviders(<EnhancedUserManagement />);

      // Open create user modal
      const createButton = screen.getByTestId('create-user-button');
      await user.click(createButton);

      // Fill form
      await user.type(screen.getByTestId('username-input'), newUser.username);
      await user.type(screen.getByTestId('email-input'), newUser.email);
      await user.type(screen.getByTestId('fullName-input'), newUser.fullName);
      await user.selectOptions(screen.getByTestId('role-select'), newUser.role);

      // Submit form
      const saveButton = screen.getByTestId('save-user-button');
      await user.click(saveButton);

      // Wait for API call
      await waitFor(() => {
        expect(mockAxios.history.post).toHaveLength(1);
      });

      // Verify API request
      validateApiRequest(mockAxios.history.post[0], newUser);
    });

    it('should handle user update API calls', async () => {
      const mockUsers = generateMockUsers(1);
      const updatedUser = { ...mockUsers[0], fullName: 'Updated Name' };

      mockAxios.onGet(API_ENDPOINTS.USERS).reply(200, mockPaginatedResponse(mockUsers));
      mockAxios.onPut(`${API_ENDPOINTS.USERS}/${mockUsers[0].id}`).reply(200, updatedUser);

      const user = userEvent.setup();
      renderWithProviders(<EnhancedUserManagement />);

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].fullName)).toBeInTheDocument();
      });

      // Click edit button
      const editButton = screen.getByTestId('edit-user-button');
      await user.click(editButton);

      // Update name
      const nameInput = screen.getByTestId('fullName-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      // Save changes
      const saveButton = screen.getByTestId('save-user-button');
      await user.click(saveButton);

      // Wait for API call
      await waitFor(() => {
        expect(mockAxios.history.put).toHaveLength(1);
      });

      // Verify API request
      expect(mockAxios.history.put[0].url).toBe(`${API_ENDPOINTS.USERS}/${mockUsers[0].id}`);
      validateApiRequest(mockAxios.history.put[0], updatedUser);
    });

    it('should handle user deletion API calls', async () => {
      const mockUsers = generateMockUsers(2);

      mockAxios.onGet(API_ENDPOINTS.USERS).reply(200, mockPaginatedResponse(mockUsers));
      mockAxios.onDelete(`${API_ENDPOINTS.USERS}/${mockUsers[0].id}`).reply(204);

      const user = userEvent.setup();
      renderWithProviders(<EnhancedUserManagement />);

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].fullName)).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByTestId('delete-user-button');
      await user.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByTestId('confirm-delete-button');
      await user.click(confirmButton);

      // Wait for API call
      await waitFor(() => {
        expect(mockAxios.history.delete).toHaveLength(1);
      });

      // Verify API request
      expect(mockAxios.history.delete[0].url).toBe(`${API_ENDPOINTS.USERS}/${mockUsers[0].id}`);
    });

    it('should handle bulk actions API calls', async () => {
      const mockUsers = generateMockUsers(3);
      const selectedUserIds = [mockUsers[0].id, mockUsers[1].id];

      mockAxios.onGet(API_ENDPOINTS.USERS).reply(200, mockPaginatedResponse(mockUsers));
      mockAxios.onPost(API_ENDPOINTS.USER_BULK_ACTIONS).reply(200, { success: true });

      const user = userEvent.setup();
      renderWithProviders(<EnhancedUserManagement />);

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].fullName)).toBeInTheDocument();
      });

      // Select users
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // First user
      await user.click(checkboxes[2]); // Second user

      // Perform bulk action
      const bulkActivateButton = screen.getByTestId('bulk-activate-button');
      await user.click(bulkActivateButton);

      // Wait for API call
      await waitFor(() => {
        expect(mockAxios.history.post).toHaveLength(1);
      });

      // Verify bulk action API request
      const bulkRequest = mockAxios.history.post[0];
      expect(bulkRequest.url).toBe(API_ENDPOINTS.USER_BULK_ACTIONS);
      validateApiRequest(bulkRequest, {
        action: 'activate',
        userIds: selectedUserIds,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API server errors gracefully', async () => {
      simulateServerError(mockAxios, API_ENDPOINTS.USERS, 500);

      renderWithProviders(<EnhancedUserManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByText(/failed to load users/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      simulateNetworkError(mockAxios, API_ENDPOINTS.USERS);

      renderWithProviders(<EnhancedUserManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should handle validation errors on user creation', async () => {
      mockAxios.onPost(API_ENDPOINTS.USERS).reply(400, {
        message: 'Validation failed',
        errors: {
          email: 'Email is already in use',
          username: 'Username is required',
        },
      });

      const user = userEvent.setup();
      renderWithProviders(<EnhancedUserManagement />);

      // Open create user modal
      const createButton = screen.getByTestId('create-user-button');
      await user.click(createButton);

      // Submit form with invalid data
      const saveButton = screen.getByTestId('save-user-button');
      await user.click(saveButton);

      // Wait for validation errors
      await waitFor(() => {
        expect(screen.getByText('Email is already in use')).toBeInTheDocument();
        expect(screen.getByText('Username is required')).toBeInTheDocument();
      });
    });

    it('should handle unauthorized access errors', async () => {
      mockAxios.onGet(API_ENDPOINTS.USERS).reply(403, {
        message: 'Access denied',
      });

      renderWithProviders(<EnhancedUserManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('access-denied-message')).toBeInTheDocument();
        expect(screen.getByText(/access denied/i)).toBeInTheDocument();
      });
    });

    it('should retry failed requests', async () => {
      let callCount = 0;
      mockAxios.onGet(API_ENDPOINTS.USERS).reply(() => {
        callCount++;
        if (callCount === 1) {
          return [500, { message: 'Server error' }];
        }
        return [200, mockPaginatedResponse(generateMockUsers(2))];
      });

      renderWithProviders(<EnhancedUserManagement />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });

      // Click retry button
      const retryButton = screen.getByTestId('retry-button');
      await userEvent.setup().click(retryButton);

      // Wait for successful retry
      await waitFor(() => {
        expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
        expect(screen.getByTestId('user-management-table')).toBeInTheDocument();
      });

      // Verify retry was attempted
      expect(callCount).toBe(2);
    });
  });

  describe('Loading States', () => {
    it('should show loading state during initial data fetch', async () => {
      // Delay the response to test loading state
      mockAxios.onGet(API_ENDPOINTS.USERS).reply(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve([200, mockPaginatedResponse(generateMockUsers(2))]), 100);
        });
      });

      renderWithProviders(<EnhancedUserManagement />);

      // Should show loading state initially
      expect(screen.getByTestId('table-loading')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId('table-loading')).not.toBeInTheDocument();
        expect(screen.getByTestId('user-management-table')).toBeInTheDocument();
      });
    });

    it('should show loading state during bulk actions', async () => {
      const mockUsers = generateMockUsers(2);
      mockAxios.onGet(API_ENDPOINTS.USERS).reply(200, mockPaginatedResponse(mockUsers));

      // Delay bulk action response
      mockAxios.onPost(API_ENDPOINTS.USER_BULK_ACTIONS).reply(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve([200, { success: true }]), 100);
        });
      });

      const user = userEvent.setup();
      renderWithProviders(<EnhancedUserManagement />);

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].fullName)).toBeInTheDocument();
      });

      // Select users and perform bulk action
      const checkbox = screen.getAllByRole('checkbox')[1];
      await user.click(checkbox);

      const bulkActivateButton = screen.getByTestId('bulk-activate-button');
      await user.click(bulkActivateButton);

      // Should show bulk action loading state
      expect(screen.getByTestId('bulk-action-loading')).toBeInTheDocument();

      // Wait for bulk action to complete
      await waitFor(() => {
        expect(screen.queryByTestId('bulk-action-loading')).not.toBeInTheDocument();
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should handle real-time user updates via WebSocket', async () => {
      const mockUsers = generateMockUsers(2);
      mockAxios.onGet(API_ENDPOINTS.USERS).reply(200, mockPaginatedResponse(mockUsers));

      renderWithProviders(<EnhancedUserManagement />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].fullName)).toBeInTheDocument();
      });

      // Simulate WebSocket update
      const updatedUser = { ...mockUsers[0], fullName: 'Updated via WebSocket' };

      // Trigger WebSocket event (this would be handled by the WebSocket service)
      window.dispatchEvent(
        new CustomEvent('user-updated', {
          detail: updatedUser,
        }),
      );

      // Should reflect the update
      await waitFor(() => {
        expect(screen.getByText('Updated via WebSocket')).toBeInTheDocument();
      });
    });
  });
});
