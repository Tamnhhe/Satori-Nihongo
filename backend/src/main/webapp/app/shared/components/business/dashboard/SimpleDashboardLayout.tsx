import React from 'react';
import { useAppSelector } from 'app/config/store';
import { Storage } from 'react-jhipster';
import { useAppDispatch } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { logout } from 'app/shared/reducers/authentication';

interface SimpleDashboardLayoutProps {
  children: React.ReactNode;
}

const SimpleDashboardLayout: React.FC<SimpleDashboardLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLanguageChange = (locale: string) => {
    Storage.session.set('locale', locale);
    dispatch(setLocale(locale));
  };

  const getUserDisplayName = () => {
    return account?.firstName && account?.lastName ? `${account.firstName} ${account.lastName}` : account?.login || 'Người dùng';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '16px 24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                marginRight: '16px',
                cursor: 'pointer',
              }}
            >
              ☰
            </button>
            <h2 style={{ margin: 0 }}>🏫 Satori Nihongo</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Xin chào, {getUserDisplayName()}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <nav
            style={{
              width: '280px',
              backgroundColor: 'white',
              borderRight: '1px solid #e0e0e0',
              padding: '20px 0',
            }}
          >
            <div style={{ padding: '0 20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    marginRight: '12px',
                  }}
                >
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{getUserDisplayName()}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {account?.authorities?.includes('ROLE_ADMIN') ? 'Quản trị viên' : 'Giáo viên'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '0 20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <a
                  href="/"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#333',
                    borderRadius: '8px',
                    backgroundColor: window.location.pathname === '/' ? '#e3f2fd' : 'transparent',
                  }}
                >
                  📊 Trang chủ
                </a>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <a
                  href="/teacher-profile"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#333',
                    borderRadius: '8px',
                    backgroundColor: window.location.pathname.includes('/teacher-profile') ? '#e3f2fd' : 'transparent',
                  }}
                >
                  👨‍🏫 Quản lý giáo viên
                </a>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <a
                  href="/lesson"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#333',
                    borderRadius: '8px',
                    backgroundColor: window.location.pathname.includes('/lesson') ? '#e3f2fd' : 'transparent',
                  }}
                >
                  📚 Quản lý bài học
                </a>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <a
                  href="/course-class"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#333',
                    borderRadius: '8px',
                    backgroundColor: window.location.pathname.includes('/course-class') ? '#e3f2fd' : 'transparent',
                  }}
                >
                  🏫 Quản lý lớp học
                </a>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <a
                  href="/course"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#333',
                    borderRadius: '8px',
                    backgroundColor: window.location.pathname.includes('/course') ? '#e3f2fd' : 'transparent',
                  }}
                >
                  📖 Quản lý khóa học
                </a>
              </div>

              {account?.authorities?.includes('ROLE_ADMIN') && (
                <>
                  <div style={{ margin: '20px 0', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#666', fontSize: '14px' }}>QUẢN TRỊ HỆ THỐNG</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <a
                      href="/admin/user-management"
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: '#333',
                        borderRadius: '8px',
                        backgroundColor: window.location.pathname.includes('/admin/user-management') ? '#e3f2fd' : 'transparent',
                      }}
                    >
                      👥 Quản lý người dùng
                    </a>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <a
                      href="/admin/configuration"
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: '#333',
                        borderRadius: '8px',
                        backgroundColor: window.location.pathname.includes('/admin/configuration') ? '#e3f2fd' : 'transparent',
                      }}
                    >
                      ⚙️ Cài đặt hệ thống
                    </a>
                  </div>
                </>
              )}
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: '24px',
            backgroundColor: '#f5f5f5',
            overflow: 'auto',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default SimpleDashboardLayout;
