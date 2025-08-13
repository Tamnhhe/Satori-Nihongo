import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import configureStore from 'redux-mock-store';
import { EnhancedUserManagement } from './enhanced-user-management';

expect.extend(toHaveNoViolations);

const mockStore = configureStore([]);

const mockUsers = [
  {
    id: '1',
    username: 'john.doe',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    role: 'HOC_VIEN',
    isActive: true,
    lastLogin: '2024-01-15T10:30:00Z',
    createdDate: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'jane.teacher',
    email: 'jane.teacher@example.com',
    fullName: 'Jane Teacher',
    role: 'GIANG_VIEN',
    isActive: true,
    lastLogin: '2024-01-15T09:15:00Z',
    createdDate: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    username: 'admin.user',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: 'ADMIN',
    isActive: false,
    lastLogin: '2024-01-10T14:20:00Z',
    createdDate: '2023-12-01T00:00:00Z',
  },
];

const mockInitialState = {
  enhancedUserManagement: {
    loading: false,
    users: mockUsers,
    totalItems: 3,
    pagination: {
      page: 0,
      size: 20,
      sort: 'createdDate,desc',
    },
    filters: {
      search: '',
      role: '',
      status: '',
    },
    selectedUsers: [],
    bulkActionLoading: false,
  },
  authentication: {
    account: {
      authorities: ['ROLE_ADMIN'],
      login: 'admin',
    },
  },
};

const renderWithProviders = (component: React.ReactElement, initialState = mockInitialState) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe('EnhancedUserManagement Component', () => {
  it('should render user management table with users', () => {
    renderWithProviders(<EnhancedUserManagement />);

    expect(screen.getByTestId('user-management-table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Teacher')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('should display user roles with proper badges', () => {
    renderWithProviders(<EnhancedUserManagement />);

    expect(screen.getByTestId('role-badge-HOC_VIEN')).toBeInTheDocument();
    expect(screen.getByTestId('role-badge-GIANG_VIEN')).toBeInTheDocument();
    expect(screen.getByTestId('role-badge-ADMIN')).toBeInTheDocument();
  });

  it('should show user status indicators', () => {
    renderWithProviders(<EnhancedUserManagement />);

    const activeIndicators = screen.getAllByTestId('status-active');
    const inactiveIndicators = screen.getAllByTestId('status-inactive');

    expect(activeIndicators).toHaveLength(2);
    expect(inactiveIndicators).toHaveLength(1);
  });

  it('should handle search functionality', async () => {
    const store = mockStore(mockInitialState);
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EnhancedUserManagement />
        </BrowserRouter>
      </Provider>,
    );

    const searchInput = screen.getByPlaceholderText(/search users/i);
    await user.type(searchInput, 'john');

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: expect.stringContaining('setSearchFilter'),
        }),
      );
    });
  });

  it('should handle role filtering', async () => {
    const store = mockStore(mockInitialState);
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EnhancedUserManagement />
        </BrowserRouter>
      </Provider>,
    );

    const roleFilter = screen.getByTestId('role-filter');
    await user.selectOptions(roleFilter, 'GIANG_VIEN');

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: expect.stringContaining('setRoleFilter'),
        }),
      );
    });
  });

  it('should handle status filtering', async () => {
    const store = mockStore(mockInitialState);
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EnhancedUserManagement />
        </BrowserRouter>
      </Provider>,
    );

    const statusFilter = screen.getByTestId('status-filter');
    await user.selectOptions(statusFilter, 'active');

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: expect.stringContaining('setStatusFilter'),
        }),
      );
    });
  });

  it('should handle user selection for bulk actions', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EnhancedUserManagement />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // First user checkbox (index 0 is select all)

    expect(screen.getByTestId('bulk-actions-toolbar')).toBeInTheDocument();
    expect(screen.getByText('1 user selected')).toBeInTheDocument();
  });

  it('should handle select all functionality', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EnhancedUserManagement />);

    const selectAllCheckbox = screen.getByTestId('select-all-checkbox');
    await user.click(selectAllCheckbox);

    expect(screen.getByText('3 users selected')).toBeInTheDocument();
  });

  it('should open user edit modal when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EnhancedUserManagement />);

    const editButtons = screen.getAllByTestId('edit-user-button');
    await user.click(editButtons[0]);

    expect(screen.getByTestId('user-edit-modal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('should handle user deletion', async () => {
    const store = mockStore(mockInitialState);
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EnhancedUserManagement />
        </BrowserRouter>
      </Provider>,
    );

    const deleteButtons = screen.getAllByTestId('delete-user-button');
    await user.click(deleteButtons[0]);

    // Confirm deletion
    const confirmButton = screen.getByTestId('confirm-delete-button');
    await user.click(confirmButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: expect.stringContaining('deleteUser'),
        }),
      );
    });
  });

  it('should handle bulk actions', async () => {
    const store = mockStore({
      ...mockInitialState,
      enhancedUserManagement: {
        ...mockInitialState.enhancedUserManagement,
        selectedUsers: ['1', '2'],
      },
    });
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EnhancedUserManagement />
        </BrowserRouter>
      </Provider>,
    );

    const bulkActionButton = screen.getByTestId('bulk-activate-button');
    await user.click(bulkActionButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: expect.stringContaining('bulkActivateUsers'),
        }),
      );
    });
  });

  it('should handle pagination', async () => {
    const store = mockStore(mockInitialState);
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EnhancedUserManagement />
        </BrowserRouter>
      </Provider>,
    );

    const nextPageButton = screen.getByTestId('next-page-button');
    await user.click(nextPageButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: expect.stringContaining('setPage'),
        }),
      );
    });
  });

  it('should handle sorting', async () => {
    const store = mockStore(mockInitialState);
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EnhancedUserManagement />
        </BrowserRouter>
      </Provider>,
    );

    const nameColumnHeader = screen.getByTestId('sort-fullName');
    await user.click(nameColumnHeader);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: expect.stringContaining('setSort'),
        }),
      );
    });
  });

  it('should show loading state', () => {
    const loadingState = {
      ...mockInitialState,
      enhancedUserManagement: {
        ...mockInitialState.enhancedUserManagement,
        loading: true,
      },
    };

    renderWithProviders(<EnhancedUserManagement />, loadingState);

    expect(screen.getByTestId('table-loading')).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton-row')).toHaveLength(5);
  });

  it('should show empty state when no users', () => {
    const emptyState = {
      ...mockInitialState,
      enhancedUserManagement: {
        ...mockInitialState.enhancedUserManagement,
        users: [],
        totalItems: 0,
      },
    };

    renderWithProviders(<EnhancedUserManagement />, emptyState);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('should be accessible', async () => {
    const { container } = renderWithProviders(<EnhancedUserManagement />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper table headers and ARIA labels', () => {
    renderWithProviders(<EnhancedUserManagement />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /full name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /role/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EnhancedUserManagement />);

    const firstEditButton = screen.getAllByTestId('edit-user-button')[0];
    firstEditButton.focus();

    await user.keyboard('{Tab}');
    expect(screen.getAllByTestId('delete-user-button')[0]).toHaveFocus();
  });

  it('should match snapshot', () => {
    const { container } = renderWithProviders(<EnhancedUserManagement />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
