import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';

expect.extend(toHaveNoViolations);

const mockMenuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/admin/dashboard',
  },
  {
    key: 'users',
    label: 'User Management',
    icon: 'users',
    path: '/admin/users',
    children: [
      { key: 'user-list', label: 'User List', path: '/admin/users/list' },
      { key: 'user-roles', label: 'User Roles', path: '/admin/users/roles' },
    ],
  },
  {
    key: 'courses',
    label: 'Course Management',
    icon: 'book',
    path: '/admin/courses',
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Sidebar Component', () => {
  it('should render with menu items', () => {
    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Course Management')).toBeInTheDocument();
  });

  it('should handle collapsed state', () => {
    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={true} />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('sidebar-collapsed');

    // Labels should be hidden in collapsed state
    expect(screen.queryByText('Dashboard')).not.toBeVisible();
  });

  it('should toggle collapse when toggle button is clicked', async () => {
    const handleToggle = jest.fn();
    const user = userEvent.setup();

    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} onToggle={handleToggle} />);

    const toggleButton = screen.getByTestId('sidebar-toggle');
    await user.click(toggleButton);

    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it('should expand submenu when parent item is clicked', async () => {
    const user = userEvent.setup();

    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} />);

    const userManagementItem = screen.getByText('User Management');
    await user.click(userManagementItem);

    expect(screen.getByText('User List')).toBeInTheDocument();
    expect(screen.getByText('User Roles')).toBeInTheDocument();
  });

  it('should highlight active menu item', () => {
    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} activeKey="dashboard" />);

    const dashboardItem = screen.getByTestId('menu-item-dashboard');
    expect(dashboardItem).toHaveClass('menu-item-active');
  });

  it('should render icons for menu items', () => {
    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} />);

    expect(screen.getByTestId('menu-icon-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon-users')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon-book')).toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();

    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} />);

    const firstMenuItem = screen.getByTestId('menu-item-dashboard');
    firstMenuItem.focus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('menu-item-users')).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('menu-item-courses')).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByTestId('menu-item-users')).toHaveFocus();
  });

  it('should expand submenu with Enter key', async () => {
    const user = userEvent.setup();

    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} />);

    const userManagementItem = screen.getByTestId('menu-item-users');
    userManagementItem.focus();

    await user.keyboard('{Enter}');
    expect(screen.getByText('User List')).toBeInTheDocument();
  });

  it('should show tooltips in collapsed mode', async () => {
    const user = userEvent.setup();

    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={true} />);

    const dashboardIcon = screen.getByTestId('menu-icon-dashboard');
    await user.hover(dashboardIcon);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Dashboard');
  });

  it('should handle user profile section', () => {
    const userProfile = {
      name: 'John Doe',
      role: 'Administrator',
      avatar: '/avatar.jpg',
    };

    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} userProfile={userProfile} />);

    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  it('should be accessible', async () => {
    const { container } = renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} aria-label="Main navigation" />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('role', 'navigation');

    const menuList = screen.getByRole('list');
    expect(menuList).toBeInTheDocument();

    const menuItems = screen.getAllByRole('listitem');
    expect(menuItems).toHaveLength(3);
  });

  it('should handle responsive behavior', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    renderWithRouter(<Sidebar menuItems={mockMenuItems} collapsed={false} />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('sidebar-mobile');
  });

  it('should match snapshot', () => {
    const { container } = renderWithRouter(
      <div>
        <Sidebar menuItems={mockMenuItems} collapsed={false} activeKey="dashboard" />
        <Sidebar menuItems={mockMenuItems} collapsed={true} />
      </div>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
