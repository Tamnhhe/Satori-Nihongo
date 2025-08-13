import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import configureStore from 'redux-mock-store';
import { AdminDashboard } from './admin-dashboard';

expect.extend(toHaveNoViolations);

const mockStore = configureStore([]);

const mockInitialState = {
  adminDashboard: {
    loading: false,
    userStats: {
      totalUsers: 150,
      activeUsers: 120,
      newRegistrations: 25,
      roleDistribution: [
        { role: 'ADMIN', count: 5 },
        { role: 'GIANG_VIEN', count: 20 },
        { role: 'HOC_VIEN', count: 125 },
      ],
    },
    systemHealth: {
      status: 'UP',
      diskSpace: { free: 85, total: 100 },
      database: { status: 'UP', responseTime: 45 },
      memory: { used: 60, max: 100 },
    },
    recentActivity: [
      {
        id: '1',
        type: 'USER_REGISTRATION',
        description: 'New user registered: john.doe@example.com',
        timestamp: '2024-01-15T10:30:00Z',
        severity: 'info',
      },
      {
        id: '2',
        type: 'COURSE_CREATED',
        description: 'New course created: Advanced Japanese',
        timestamp: '2024-01-15T09:15:00Z',
        severity: 'success',
      },
    ],
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

describe('AdminDashboard Component', () => {
  it('should render dashboard with user statistics', () => {
    renderWithProviders(<AdminDashboard />);

    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument(); // Total users
    expect(screen.getByText('120')).toBeInTheDocument(); // Active users
    expect(screen.getByText('25')).toBeInTheDocument(); // New registrations
  });

  it('should display system health metrics', () => {
    renderWithProviders(<AdminDashboard />);

    expect(screen.getByTestId('system-health-widget')).toBeInTheDocument();
    expect(screen.getByText('UP')).toBeInTheDocument();
    expect(screen.getByText('85% free')).toBeInTheDocument();
  });

  it('should show recent activity feed', () => {
    renderWithProviders(<AdminDashboard />);

    expect(screen.getByTestId('recent-activity-widget')).toBeInTheDocument();
    expect(screen.getByText(/New user registered/)).toBeInTheDocument();
    expect(screen.getByText(/New course created/)).toBeInTheDocument();
  });

  it('should display role distribution chart', () => {
    renderWithProviders(<AdminDashboard />);

    expect(screen.getByTestId('role-distribution-chart')).toBeInTheDocument();
    expect(screen.getByText('ADMIN: 5')).toBeInTheDocument();
    expect(screen.getByText('GIANG_VIEN: 20')).toBeInTheDocument();
    expect(screen.getByText('HOC_VIEN: 125')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const loadingState = {
      ...mockInitialState,
      adminDashboard: {
        ...mockInitialState.adminDashboard,
        loading: true,
      },
    };

    renderWithProviders(<AdminDashboard />, loadingState);

    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton-loader')).toHaveLength(4);
  });

  it('should handle error state', () => {
    const errorState = {
      ...mockInitialState,
      adminDashboard: {
        ...mockInitialState.adminDashboard,
        error: 'Failed to load dashboard data',
      },
    };

    renderWithProviders(<AdminDashboard />, errorState);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
  });

  it('should refresh data when refresh button is clicked', async () => {
    const store = mockStore(mockInitialState);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      </Provider>,
    );

    const refreshButton = screen.getByTestId('refresh-button');
    refreshButton.click();

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: expect.stringContaining('fetchDashboardData'),
        }),
      );
    });
  });

  it('should display quick action buttons', () => {
    renderWithProviders(<AdminDashboard />);

    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create course/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system settings/i })).toBeInTheDocument();
  });

  it('should be responsive on mobile devices', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    renderWithProviders(<AdminDashboard />);

    const dashboard = screen.getByTestId('admin-dashboard');
    expect(dashboard).toHaveClass('dashboard-mobile');
  });

  it('should update data in real-time', async () => {
    const store = mockStore(mockInitialState);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      </Provider>,
    );

    // Simulate real-time update
    await waitFor(
      () => {
        const actions = store.getActions();
        expect(actions).toContainEqual(
          expect.objectContaining({
            type: expect.stringContaining('startRealTimeUpdates'),
          }),
        );
      },
      { timeout: 5000 },
    );
  });

  it('should be accessible', async () => {
    const { container } = renderWithProviders(<AdminDashboard />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    renderWithProviders(<AdminDashboard />);

    expect(screen.getByRole('heading', { level: 1, name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /user statistics/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /system health/i })).toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    renderWithProviders(<AdminDashboard />);

    const quickActionButtons = screen.getAllByRole('button');
    quickActionButtons[0].focus();

    // Tab through quick action buttons
    for (let i = 0; i < quickActionButtons.length - 1; i++) {
      expect(quickActionButtons[i]).toHaveFocus();
      fireEvent.keyDown(quickActionButtons[i], { key: 'Tab' });
    }
  });

  it('should match snapshot', () => {
    const { container } = renderWithProviders(<AdminDashboard />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
