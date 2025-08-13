import React from 'react';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

// Import the old JHipster routes as fallback
import AppRoutes from 'app/routes';

// Import our new business routes
import BusinessRoutes from 'app/BusinessRoutes';

/**
 * Migration wrapper component that allows gradual transition from JHipster UI to custom business UI
 *
 * Features:
 * - Environment-based UI switching
 * - Role-based UI selection
 * - Feature flag support for A/B testing
 * - Fallback to JHipster UI for incomplete features
 */
const UIRouter: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);
  const isAdmin = useAppSelector(state => hasAnyAuthority(account.authorities, [AUTHORITIES.ADMIN]));
  const isTeacher = useAppSelector(state => hasAnyAuthority(account.authorities, ['ROLE_TEACHER']));

  // Feature flags for gradual rollout
  const useNewUI =
    process.env.NODE_ENV !== 'production' || // Always use new UI in development
    localStorage.getItem('satori-use-new-ui') === 'true' || // User preference
    isAdmin || // Admins get new UI first
    isTeacher; // Teachers get new UI

  // You can add more sophisticated logic here:
  // - User preferences
  // - A/B testing groups
  // - Specific role requirements
  // - Feature completion status

  if (useNewUI && isAuthenticated) {
    return <BusinessRoutes />;
  }

  // Fallback to original JHipster UI
  return <AppRoutes />;
};

export default UIRouter;
