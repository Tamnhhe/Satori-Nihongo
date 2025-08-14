import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import DashboardLayout from 'app/shared/components/business/dashboard/DashboardLayout';
import TeacherDashboard from 'app/shared/components/business/dashboard/TeacherDashboard';
import AdminDashboard from 'app/shared/components/business/dashboard/AdminDashboard';

// Import existing JHipster components that we'll keep
import SatoriLogin from 'app/modules/login/SatoriLogin';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Settings from 'app/modules/account/settings/settings';
import Password from 'app/modules/account/password/password';

// Import entity routes - these will be enhanced later
import TeacherProfileRoutes from 'app/entities/teacher-profile';
import LessonRoutes from 'app/entities/lesson';
import CourseRoutes from 'app/entities/course';
import CourseClassRoutes from 'app/entities/course-class';
// import StudentRoutes from 'app/entities/student'; // TODO: Create student entity routes

// Admin routes
import UserManagement from 'app/modules/administration/user-management';
import Docs from 'app/modules/administration/docs/docs';
import Configuration from 'app/modules/administration/configuration/configuration';
import Health from 'app/modules/administration/health/health';
import Logs from 'app/modules/administration/logs/logs';
import Metrics from 'app/modules/administration/metrics/metrics';

interface PrivateRouteProps {
  children: React.ReactNode;
  hasAnyAuthorities?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, hasAnyAuthorities = [] }) => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);

  const hasRequiredAuthority = hasAnyAuthorities.length === 0 || hasAnyAuthority(account.authorities, hasAnyAuthorities);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredAuthority) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const BusinessRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const isTeacher = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, ['ROLE_TEACHER']));

  // Determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    if (isAdmin) {
      return <AdminDashboard />;
    } else if (isTeacher) {
      return <TeacherDashboard />;
    } else {
      return <TeacherDashboard />; // Default to teacher dashboard for now
    }
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<SatoriLogin />} />
        <Route path="/account/register" element={<Register />} />
        <Route path="/account/activate" element={<Activate />} />
        <Route path="/account/reset/request" element={<PasswordResetInit />} />
        <Route path="/account/reset/finish" element={<PasswordResetFinish />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        {/* Dashboard Routes */}
        <Route path="/" element={getDashboardComponent()} />
        <Route path="/dashboard" element={getDashboardComponent()} />

        {/* Account Management Routes */}
        <Route path="/account/settings" element={<Settings />} />
        <Route path="/account/password" element={<Password />} />

        {/* Teacher Routes */}
        <Route
          path="/teacher-profile/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
              <TeacherProfileRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/lesson/*"
          element={
            <PrivateRoute hasAnyAuthorities={['ROLE_TEACHER', AUTHORITIES.ADMIN]}>
              <LessonRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/course-class/*"
          element={
            <PrivateRoute hasAnyAuthorities={['ROLE_TEACHER', AUTHORITIES.ADMIN]}>
              <CourseClassRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/*"
          element={
            <PrivateRoute hasAnyAuthorities={['ROLE_TEACHER', AUTHORITIES.ADMIN]}>
              <div style={{ padding: '24px' }}>
                <h2>Quản lý học viên (Coming Soon)</h2>
                <p>Tính năng quản lý học viên sẽ được phát triển trong giai đoạn tiếp theo.</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/course/*"
          element={
            <PrivateRoute hasAnyAuthorities={['ROLE_TEACHER', AUTHORITIES.ADMIN]}>
              <CourseRoutes />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/user-management/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <UserManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/docs"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Docs />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/configuration"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Configuration />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/health"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Health />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/logs"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Logs />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/metrics"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Metrics />
            </PrivateRoute>
          }
        />

        {/* Future Business Routes */}
        <Route
          path="/schedule"
          element={
            <PrivateRoute hasAnyAuthorities={['ROLE_TEACHER', AUTHORITIES.ADMIN]}>
              <div style={{ padding: '24px' }}>
                <h2>Lịch dạy học (Coming Soon)</h2>
                <p>Tính năng quản lý lịch dạy học sẽ được phát triển trong giai đoạn tiếp theo.</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <div style={{ padding: '24px' }}>
                <h2>Báo cáo & Phân tích (Coming Soon)</h2>
                <p>Tính năng báo cáo và phân tích chi tiết sẽ được phát triển trong giai đoạn tiếp theo.</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <div style={{ padding: '24px' }}>
                <h2>Báo cáo (Coming Soon)</h2>
                <p>Tính năng tạo và xem báo cáo sẽ được phát triển trong giai đoạn tiếp theo.</p>
              </div>
            </PrivateRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default BusinessRoutes;
