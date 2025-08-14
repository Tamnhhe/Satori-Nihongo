import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography, Collapse, Avatar } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  ExpandLess,
  ExpandMore,
  Class as ClassIcon,
  TrendingUp as TrendingUpIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { Translate } from 'react-jhipster';

interface NavigationSidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  roles?: string[];
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ open, onClose, variant = 'persistent' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['dashboard']);

  // Get user info from Redux store
  const account = useAppSelector(state => state.authentication.account);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const isTeacher = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, ['ROLE_TEACHER']));

  const drawerWidth = 280;

  // Define menu structure based on user roles
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Trang chủ',
      icon: <DashboardIcon />,
      path: '/',
    },
    // Teacher-specific menus
    ...(isTeacher
      ? [
          {
            id: 'lessons',
            title: 'Quản lý bài học',
            icon: <MenuBookIcon />,
            children: [
              {
                id: 'lesson-list',
                title: 'Danh sách bài học',
                icon: <AssignmentIcon />,
                path: '/lesson',
              },
              {
                id: 'lesson-create',
                title: 'Tạo bài học mới',
                icon: <AssignmentIcon />,
                path: '/lesson/new',
              },
              {
                id: 'lesson-templates',
                title: 'Mẫu bài học',
                icon: <MenuBookIcon />,
                path: '/lesson-templates',
              },
            ],
          },
          {
            id: 'classes',
            title: 'Quản lý lớp học',
            icon: <ClassIcon />,
            children: [
              {
                id: 'class-list',
                title: 'Danh sách lớp',
                icon: <ClassIcon />,
                path: '/course-class',
              },
              {
                id: 'class-schedule',
                title: 'Lịch dạy',
                icon: <ScheduleIcon />,
                path: '/schedule',
              },
              {
                id: 'attendance',
                title: 'Điểm danh',
                icon: <PersonIcon />,
                path: '/attendance',
              },
            ],
          },
          {
            id: 'students',
            title: 'global.entities.studentManagement',
            icon: <SchoolIcon />,
            children: [
              {
                id: 'student-list',
                title: 'Danh sách học viên',
                icon: <PeopleIcon />,
                path: '/student',
              },
              {
                id: 'student-progress',
                title: 'Tiến độ học tập',
                icon: <TrendingUpIcon />,
                path: '/student-progress',
              },
              {
                id: 'assessments',
                title: 'Đánh giá & Kiểm tra',
                icon: <AssessmentIcon />,
                path: '/assessment',
              },
            ],
          },
          {
            id: 'teacher-profile',
            title: 'Hồ sơ giáo viên',
            icon: <PersonIcon />,
            path: '/teacher-profile',
          },
        ]
      : []),
    // Admin-specific menus
    ...(isAdmin
      ? [
          {
            id: 'admin',
            title: 'Quản trị hệ thống',
            icon: <AdminIcon />,
            children: [
              {
                id: 'user-management',
                title: 'Quản lý người dùng',
                icon: <PeopleIcon />,
                path: '/admin/user-management',
              },
              {
                id: 'teacher-management',
                title: 'Quản lý giáo viên',
                icon: <PersonIcon />,
                path: '/teacher-profile',
              },
              {
                id: 'course-management',
                title: 'Quản lý khóa học',
                icon: <MenuBookIcon />,
                path: '/course',
              },
              {
                id: 'system-settings',
                title: 'Cài đặt hệ thống',
                icon: <SettingsIcon />,
                path: '/admin/configuration',
              },
            ],
          },
          {
            id: 'analytics',
            title: 'Báo cáo & Phân tích',
            icon: <AnalyticsIcon />,
            children: [
              {
                id: 'platform-analytics',
                title: 'Thống kê nền tảng',
                icon: <TrendingUpIcon />,
                path: '/analytics/platform',
              },
              {
                id: 'teacher-performance',
                title: 'Hiệu suất giáo viên',
                icon: <PersonIcon />,
                path: '/analytics/teachers',
              },
              {
                id: 'student-analytics',
                title: 'Phân tích học viên',
                icon: <SchoolIcon />,
                path: '/analytics/students',
              },
              {
                id: 'course-analytics',
                title: 'Phân tích khóa học',
                icon: <MenuBookIcon />,
                path: '/analytics/courses',
              },
              {
                id: 'notification-analytics',
                title: 'global.entities.notificationAnalytics',
                icon: <NotificationsIcon />,
                path: '/analytics/notifications',
              },
            ],
          },
          {
            id: 'notifications',
            title: 'Quản lý thông báo',
            icon: <NotificationsIcon />,
            path: '/admin/notifications',
          },
        ]
      : []),
    // Common menus
    {
      id: 'reports',
      title: 'global.entities.studentReports',
      icon: <AssessmentIcon />,
      path: '/reports',
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      // Toggle expansion for items with children
      setExpandedItems(prev => (prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]));
    } else if (item.path) {
      // Navigate to the path
      navigate(item.path);
      if (variant === 'temporary') {
        onClose();
      }
    }
  };

  const isSelected = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isParentSelected = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(child => isSelected(child.path));
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const selected = isSelected(item.path) || isParentSelected(item.children);

    return (
      <React.Fragment key={item.id}>
        <ListItemButton
          onClick={() => handleItemClick(item)}
          selected={selected}
          sx={{
            pl: 2 + level * 2,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText
            primary={
              typeof item.title === 'string' && item.title.startsWith('global.') ? (
                <Translate contentKey={item.title} />
              ) : (
                <span>{item.title}</span>
              )
            }
            primaryTypographyProps={{
              fontSize: level > 0 ? '0.875rem' : '1rem',
              fontWeight: selected ? 600 : 400,
            }}
          />
          {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const getUserDisplayName = () => {
    return account?.firstName && account?.lastName ? `${account.firstName} ${account.lastName}` : account?.login || 'Người dùng';
  };

  const getUserRole = () => {
    if (isAdmin) return 'Quản trị viên';
    if (isTeacher) return 'Giáo viên';
    return 'Người dùng';
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Profile Section */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              bgcolor: 'primary.main',
            }}
          >
            {getUserDisplayName().charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {getUserDisplayName()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getUserRole()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List sx={{ pt: 1 }}>{menuItems.map(item => renderMenuItem(item))}</List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Satori Nihongo Platform v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: variant === 'persistent' ? 64 : 0, // Account for AppBar height
          height: variant === 'persistent' ? 'calc(100% - 64px)' : '100%',
        },
      }}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default NavigationSidebar;
