import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Box, Button, Chip, Badge } from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Language as LanguageIcon,
  School as SchoolIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Translate } from 'react-jhipster';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

interface CustomHeaderProps {
  onMenuToggle: () => void;
  onLogout: () => void;
  onLanguageChange: (locale: string) => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ onMenuToggle, onLogout, onLanguageChange }) => {
  const theme = useTheme();
  const [accountMenuAnchor, setAccountMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = React.useState<null | HTMLElement>(null);

  // Get user info from Redux store
  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  // Mock notification count - replace with actual data
  const notificationCount = 3;

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAccountMenuAnchor(null);
    setLanguageMenuAnchor(null);
    setNotificationMenuAnchor(null);
  };

  const handleLanguageSelect = (locale: string) => {
    onLanguageChange(locale);
    handleMenuClose();
  };

  const getUserRole = () => {
    if (isAdmin) return 'Quản trị viên';
    if (account?.authorities?.includes('ROLE_TEACHER')) return 'Giáo viên';
    return 'Người dùng';
  };

  const getUserDisplayName = () => {
    return account?.firstName && account?.lastName ? `${account.firstName} ${account.lastName}` : account?.login || 'Người dùng';
  };

  if (!isAuthenticated) {
    return (
      <AppBar position="fixed" elevation={1}>
        <Toolbar>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Satori Nihongo
          </Typography>
          <Button color="inherit" href="/login">
            <Translate contentKey="global.menu.account.login">Đăng nhập</Translate>
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar>
        {/* Menu toggle button */}
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuToggle} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        {/* Logo and title */}
        <SchoolIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Satori Nihongo
        </Typography>

        {/* User role chip */}
        <Chip
          label={getUserRole()}
          size="small"
          color={isAdmin ? 'secondary' : 'primary'}
          variant="outlined"
          sx={{
            mr: 2,
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
            '& .MuiChip-label': { color: 'white' },
          }}
        />

        {/* Quick action buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
          {!isAdmin && (
            <Button color="inherit" size="small" href="/lesson/create" sx={{ mr: 1 }}>
              Tạo bài học
            </Button>
          )}
          <Button color="inherit" size="small" href="/schedule">
            Xem lịch
          </Button>
        </Box>

        {/* Language selector */}
        <IconButton color="inherit" onClick={handleLanguageMenuOpen} sx={{ mr: 1 }}>
          <LanguageIcon />
        </IconButton>

        {/* Notifications */}
        <IconButton color="inherit" onClick={handleNotificationMenuOpen} sx={{ mr: 1 }}>
          <Badge badgeContent={notificationCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* User account menu */}
        <IconButton edge="end" color="inherit" onClick={handleAccountMenuOpen}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: theme.palette.secondary.main,
              fontSize: '0.875rem',
            }}
          >
            {getUserDisplayName().charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        {/* Account Menu */}
        <Menu
          anchorEl={accountMenuAnchor}
          open={Boolean(accountMenuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {getUserDisplayName()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {account?.email}
            </Typography>
          </Box>
          <MenuItem onClick={handleMenuClose} component="a" href="/account/settings">
            <AccountCircle sx={{ mr: 1 }} />
            Thông tin cá nhân
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component="a" href="/account/password">
            Đổi mật khẩu
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onLogout();
            }}
          >
            <LogoutIcon sx={{ mr: 1 }} />
            Đăng xuất
          </MenuItem>
        </Menu>

        {/* Language Menu */}
        <Menu anchorEl={languageMenuAnchor} open={Boolean(languageMenuAnchor)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleLanguageSelect('vi')} selected={currentLocale === 'vi'}>
            🇻🇳 Tiếng Việt
          </MenuItem>
          <MenuItem onClick={() => handleLanguageSelect('en')} selected={currentLocale === 'en'}>
            🇺🇸 English
          </MenuItem>
          <MenuItem onClick={() => handleLanguageSelect('ja')} selected={currentLocale === 'ja'}>
            🇯🇵 日本語
          </MenuItem>
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationMenuAnchor}
          open={Boolean(notificationMenuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { minWidth: 300, maxWidth: 400 },
          }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6">Thông báo ({notificationCount})</Typography>
          </Box>
          <MenuItem onClick={handleMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Học viên mới đăng ký
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Yamada Taro đã đăng ký khóa N5 • 5 phút trước
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Lịch học thay đổi
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lớp Kanji N5 chuyển từ 14:00 sang 16:30 • 1 giờ trước
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Cập nhật hệ thống
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hệ thống sẽ bảo trì vào 2:00 AM ngày mai • 2 giờ trước
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default CustomHeader;
