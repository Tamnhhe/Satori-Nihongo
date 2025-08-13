import React from 'react';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

const AdminDashboard: React.FC = () => {
  const account = useAppSelector(state => state.authentication.account);

  // Mock data
  const platformStats = {
    totalUsers: 1247,
    activeTeachers: 36,
    totalCourses: 92,
    monthlyRevenue: '45M',
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1>Bảng điều khiển quản trị 📊</h1>
        <p>Theo dõi và quản lý toàn bộ nền tảng Satori Nihongo</p>
      </div>

      {/* Platform Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Tổng người dùng</h3>
          <h2 style={{ color: '#1976d2' }}>{platformStats.totalUsers.toLocaleString()}</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Tăng 12% so với tháng trước</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Giáo viên hoạt động</h3>
          <h2 style={{ color: '#4caf50' }}>{platformStats.activeTeachers}</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>3 giáo viên mới tuần này</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Tổng khóa học</h3>
          <h2 style={{ color: '#ff9800' }}>{platformStats.totalCourses}</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>5 khóa học mới</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Doanh thu tháng</h3>
          <h2 style={{ color: '#9c27b0' }}>{platformStats.monthlyRevenue} VNĐ</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Vượt mục tiêu 15%</p>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2>Quản lý nhanh</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <a href="/admin/user-management" style={{ color: 'white', textDecoration: 'none' }}>
              Quản lý người dùng
            </a>
          </button>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <a href="/teacher-profile" style={{ color: 'white', textDecoration: 'none' }}>
              Quản lý giáo viên
            </a>
          </button>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <a href="/analytics/platform" style={{ color: 'white', textDecoration: 'none' }}>
              Xem báo cáo chi tiết
            </a>
          </button>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#9c27b0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <a href="/admin/configuration" style={{ color: 'white', textDecoration: 'none' }}>
              Cài đặt hệ thống
            </a>
          </button>
        </div>
      </div>

      {/* Teacher Management */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Quản lý giáo viên</h3>
          <div style={{ marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Giáo viên</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Cấp độ</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Học viên</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Đánh giá</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '8px',
                        }}
                      >
                        N
                      </div>
                      <div>
                        <div>Nguyễn Văn An</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>an.nguyen@email.com</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <span
                      style={{ padding: '4px 8px', backgroundColor: '#e3f2fd', color: '#1976d2', borderRadius: '4px', fontSize: '12px' }}
                    >
                      N5
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>15</td>
                  <td style={{ padding: '8px' }}>4.8 ⭐</td>
                  <td style={{ padding: '8px' }}>
                    <span
                      style={{ padding: '4px 8px', backgroundColor: '#e8f5e8', color: '#4caf50', borderRadius: '4px', fontSize: '12px' }}
                    >
                      Hoạt động
                    </span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '8px',
                        }}
                      >
                        T
                      </div>
                      <div>
                        <div>Trần Thị Bình</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>binh.tran@email.com</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <span
                      style={{ padding: '4px 8px', backgroundColor: '#e3f2fd', color: '#1976d2', borderRadius: '4px', fontSize: '12px' }}
                    >
                      N4
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>18</td>
                  <td style={{ padding: '8px' }}>4.5 ⭐</td>
                  <td style={{ padding: '8px' }}>
                    <span
                      style={{ padding: '4px 8px', backgroundColor: '#e8f5e8', color: '#4caf50', borderRadius: '4px', fontSize: '12px' }}
                    >
                      Hoạt động
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '16px' }}>
            <a href="/teacher-profile" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Xem tất cả →
            </a>
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Khóa học hiệu quả nhất</h3>
          <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginRight: '8px',
                  }}
                >
                  #1
                </span>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Hiragana cơ bản - Phần 1</span>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Giảng viên: Sensei Tanaka</div>
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>Tỉ lệ hoàn thành: 87%</div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', marginBottom: '8px' }}>
                <div style={{ width: '87%', height: '100%', backgroundColor: '#4caf50', borderRadius: '2px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#666' }}>24 học viên</span>
                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>12M VNĐ</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginRight: '8px',
                  }}
                >
                  #2
                </span>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Kanji N5 - Số đếm</span>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Giảng viên: Sensei Yamada</div>
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>Tỉ lệ hoàn thành: 92%</div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', marginBottom: '8px' }}>
                <div style={{ width: '92%', height: '100%', backgroundColor: '#4caf50', borderRadius: '2px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#666' }}>18 học viên</span>
                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>9M VNĐ</span>
              </div>
            </div>
          </div>
          <div>
            <a href="/analytics/courses" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Xem chi tiết →
            </a>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Tình trạng hệ thống</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Hiệu suất máy chủ</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '8px' }}>92%</span>
              <span style={{ color: '#4caf50', fontSize: '12px' }}>Tốt</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
              <div style={{ width: '92%', height: '100%', backgroundColor: '#4caf50', borderRadius: '3px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Dung lượng lưu trữ</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '8px' }}>68%</span>
              <span style={{ color: '#ff9800', fontSize: '12px' }}>Cảnh báo</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
              <div style={{ width: '68%', height: '100%', backgroundColor: '#ff9800', borderRadius: '3px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Tốc độ phản hồi API</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '8px' }}>145ms</span>
              <span style={{ color: '#4caf50', fontSize: '12px' }}>Nhanh</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: '#4caf50', borderRadius: '3px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Người dùng trực tuyến</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '8px' }}>284</span>
              <span style={{ color: '#1976d2', fontSize: '12px' }}>Hoạt động</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
              <div style={{ width: '75%', height: '100%', backgroundColor: '#1976d2', borderRadius: '3px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
