import React from 'react';
import { useAppSelector } from 'app/config/store';

const TeacherDashboard: React.FC = () => {
  const account = useAppSelector(state => state.authentication.account);

  // Mock data - replace with actual API calls
  const stats = {
    todayLessons: 12,
    activeStudents: 48,
    averageRating: 4.8,
    completedLessons: 85,
  };

  const upcomingLessons = [
    {
      id: 1,
      title: 'Hiragana cơ bản',
      time: '14:00',
      students: 8,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Kanji N5',
      time: '16:30',
      students: 12,
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Ngữ pháp trung cấp',
      time: '10:00',
      students: 6,
      status: 'in-progress',
    },
    {
      id: 4,
      title: 'Hội thoại thực tế',
      time: '15:00',
      students: 10,
      status: 'upcoming',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      text: 'Học viên mới đăng ký: Yamada Taro',
      time: '5 phút trước',
      type: 'student',
    },
    {
      id: 2,
      text: 'Lịch học thay đổi: Kanji N5',
      time: '1 giờ trước',
      type: 'schedule',
    },
    {
      id: 3,
      text: 'Đánh giá mới từ Suzuki San',
      time: '2 giờ trước',
      type: 'rating',
    },
    {
      id: 4,
      text: 'Cập nhật hệ thống hoàn tất',
      time: '1 ngày trước',
      type: 'system',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#1976d2';
      case 'in-progress':
        return '#4caf50';
      case 'completed':
        return '#666';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'in-progress':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1>Chào mừng, {account?.firstName || 'Sensei'}! 👋</h1>
        <p>Quản lý lớp học và theo dõi tiến độ học viên của bạn</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Buổi học tuần này</h3>
          <h2 style={{ color: '#1976d2' }}>{stats.todayLessons}</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>+2 so với tuần trước</p>
          <div style={{ fontSize: '12px', color: '#4caf50' }}>↗ +16.7%</div>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Học viên hoạt động</h3>
          <h2 style={{ color: '#4caf50' }}>{stats.activeStudents}</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>+5 học viên mới</p>
          <div style={{ fontSize: '12px', color: '#4caf50' }}>↗ +12.5%</div>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Đánh giá trung bình</h3>
          <h2 style={{ color: '#ff9800' }}>{stats.averageRating}</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Từ thể đánh giá</p>
          <div style={{ fontSize: '12px', color: '#4caf50' }}>↗ +4.2%</div>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Bài học hoàn thành</h3>
          <h2 style={{ color: '#9c27b0' }}>{stats.completedLessons}%</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Tỉ lệ hoàn thành khóa học</p>
          <div style={{ fontSize: '12px', color: '#4caf50' }}>↗ +8.3%</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2>Thao tác nhanh</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '180px',
            }}
          >
            <a href="/lesson/new" style={{ color: 'white', textDecoration: 'none' }}>
              ➕ Tạo bài học mới
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
              minWidth: '180px',
            }}
          >
            <a href="/schedule" style={{ color: 'white', textDecoration: 'none' }}>
              📅 Lên lịch buổi học
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
              minWidth: '180px',
            }}
          >
            <a href="/student" style={{ color: 'white', textDecoration: 'none' }}>
              👥 Xem báo cáo
            </a>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Upcoming Lessons */}
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Buổi học sắp tới</h3>
            <a href="/schedule" style={{ color: '#1976d2', textDecoration: 'none' }}>
              📅 Xem lịch
            </a>
          </div>
          <div>
            {upcomingLessons.map(lesson => (
              <div
                key={lesson.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(lesson.status),
                      marginRight: '12px',
                    }}
                  ></div>
                  <div>
                    <div style={{ fontWeight: '500' }}>{lesson.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Hôm nay • {lesson.time} • {lesson.students} học viên
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      backgroundColor: lesson.status === 'in-progress' ? '#e8f5e8' : '#e3f2fd',
                      color: lesson.status === 'in-progress' ? '#4caf50' : '#1976d2',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {getStatusText(lesson.status)}
                  </span>
                  <button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      color: '#1976d2',
                      border: '1px solid #1976d2',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {lesson.status === 'in-progress' ? 'Tham gia' : 'Bắt đầu lớp'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Activities */}
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ marginRight: '8px' }}>🔔</span>
            <h3>Thông báo</h3>
          </div>
          <div>
            {recentActivities.map(activity => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ff9800',
                    marginRight: '12px',
                    marginTop: '4px',
                    flexShrink: 0,
                  }}
                ></div>
                <div>
                  <div style={{ fontSize: '14px', lineHeight: '1.4' }}>{activity.text}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'transparent',
              color: '#1976d2',
              border: '1px solid #1976d2',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Xem tất cả thông báo
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Tiến độ dạy học tháng này</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Số giờ dạy đã hoàn thành</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '8px' }}>45/60 giờ</span>
              <span style={{ color: '#4caf50', fontSize: '12px' }}>75%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
              <div style={{ width: '75%', height: '100%', backgroundColor: '#1976d2', borderRadius: '3px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Học viên hoàn thành khóa học</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '8px' }}>32/40 học viên</span>
              <span style={{ color: '#4caf50', fontSize: '12px' }}>80%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
              <div style={{ width: '80%', height: '100%', backgroundColor: '#4caf50', borderRadius: '3px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Mục tiêu doanh thu</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '8px' }}>12M/15M VNĐ</span>
              <span style={{ color: '#ff9800', fontSize: '12px' }}>80%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
              <div style={{ width: '80%', height: '100%', backgroundColor: '#ff9800', borderRadius: '3px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
