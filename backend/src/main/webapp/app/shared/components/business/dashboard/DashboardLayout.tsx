import React from 'react';
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomHeader from 'app/shared/components/business/navigation/CustomHeader';
import NavigationSidebar from 'app/shared/components/business/navigation/NavigationSidebar';
import { useAppDispatch } from 'app/config/store';
import { Storage } from 'react-jhipster';
import { setLocale } from 'app/shared/reducers/locale';
import { logout } from 'app/shared/reducers/authentication';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout composes the fixed AppBar (CustomHeader) and a responsive Drawer (NavigationSidebar)
 * and renders routed page content in the main area. It supports:
 * - Persistent drawer on desktop, temporary drawer on tablet/mobile
 * - Global logout and language change wired to the Redux store
 * - Proper content offset using Toolbar spacer for the fixed AppBar
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(isDesktop);

  React.useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const handleMenuToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLanguageChange = (locale: string) => {
    Storage.session.set('locale', locale);
    dispatch(setLocale(locale));
  };

  const drawerVariant: 'permanent' | 'persistent' | 'temporary' = isDesktop ? 'persistent' : 'temporary';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Fixed AppBar header */}
      <CustomHeader onMenuToggle={handleMenuToggle} onLogout={handleLogout} onLanguageChange={handleLanguageChange} />

      {/* Responsive navigation drawer */}
      <NavigationSidebar open={sidebarOpen} onClose={handleSidebarClose} variant={drawerVariant} />

      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        {/* Spacer to offset fixed AppBar height */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
