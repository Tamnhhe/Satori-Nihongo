import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Star as StarIcon,
  MenuBook as MenuBookIcon,
  Notifications as NotificationsIcon,
  PlayArrow as PlayArrowIcon,
  CalendarMonth as CalendarIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useAppSelector } from 'app/config/store';
import { Link as RouterLink } from 'react-router-dom';
import StatCard from 'app/shared/components/ui/StatCard';

const TeacherDashboard: React.FC = () => {
  const account = useAppSelector(state => state.authentication.account);

  // Mock KPI stats (replace with API calls)
  const stats = {
    weeklyLessons: 12,
    activeStudents: 48,
    averageRating: 4.8,
    completionRate: 85,
  };

  // Mock upcoming lessons (replace with API)
  const upcomingLessons = [
    { id: 1, title: 'Hiragana cơ bản', time: 'Hôm nay • 14:00', students: 8, status: 'upcoming' },
    { id: 2, title: 'Kanji N5', time: 'Hôm nay • 16:30', students: 12, status: 'upcoming' },
    { id: 3, title: 'Ngữ pháp trung cấp', time: 'Hôm nay • 10:00', students: 6, status: 'in-progress' },
    { id: 4, title: 'Hội thoại thực tế', time: 'Ngày mai • 15:00', students: 10, status: 'upcoming' },
  ];

  // Mock notifications (replace with API)
  const notifications = [
    { id: 1, title: 'Học viên mới đăng ký', desc: 'Yamada Taro đăng ký lớp N5', time: '5 phút trước' },
    { id: 2, title: 'Lịch học thay đổi', desc: 'Lớp Kanji N5 chuyển 14:00 → 16:30', time: '1 giờ trước' },
    { id: 3, title: 'Đánh giá mới', desc: 'Suzuki-san đánh giá 5⭐ cho bài giảng', time: '2 giờ trước' },
  ];

  // Progress mock (replace with API)
  const monthlyProgress = {
    hours: { label: 'Số giờ dạy đã hoàn thành', current: 45, total: 60, color: 'primary' as const },
    completion: { label: 'Học viên hoàn thành khóa', current: 32, total: 40, color: 'success' as const },
    revenue: { label: 'Mục tiêu doanh thu', current: 12, total: 15, color: 'warning' as const },
  };

  const getUserDisplayName = () => {
    return account?.firstName && account?.lastName ? `${account.firstName} ${account.lastName}` : account?.login || 'Sensei';
  };

  const statusChip = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Chip size="small" label="Đang diễn ra" color="success" variant="outlined" />;
      case 'upcoming':
      default:
        return <Chip size="small" label="Sắp diễn ra" color="primary" variant="outlined" />;
    }
  };

  const startOrJoinLabel = (status: string) => (status === 'in-progress' ? 'Tham gia' : 'Bắt đầu');

  return (
    <Box sx={{ p: { xs: 0, md: 0 } }}>
      {/* Page header with quick actions */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Chào mừng, {getUserDisplayName()} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý lớp học và theo dõi tiến độ học viên của bạn
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} component={RouterLink} to="/lesson/new">
            Tạo bài học mới
          </Button>
          <Button variant="outlined" color="primary" startIcon={<CalendarIcon />} component={RouterLink} to="/schedule">
            Xem lịch
          </Button>
        </Stack>
      </Box>

      {/* KPI cards (CSS Grid) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 1,
        }}
      >
        <StatCard title="Buổi học tuần này" value={stats.weeklyLessons} diffLabel="+16.7%" icon={<ScheduleIcon />} color="primary" />
        <StatCard title="Học viên hoạt động" value={stats.activeStudents} diffLabel="+12.5%" icon={<PeopleIcon />} color="success" />
        <StatCard title="Đánh giá trung bình" value={stats.averageRating} diffLabel="+4.2%" icon={<StarIcon />} color="warning" />
        <StatCard
          title="Tỉ lệ hoàn thành"
          value={`${stats.completionRate}%`}
          diffLabel="+8.3%"
          icon={<AssessmentIcon />}
          color="secondary"
        />
      </Box>

      {/* Main content two columns */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
          mt: 0,
        }}
      >
        {/* Upcoming lessons */}
        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardHeader
            title={<Typography variant="h6">Buổi học sắp tới</Typography>}
            action={
              <Button size="small" variant="text" component={RouterLink} to="/schedule">
                Xem lịch
              </Button>
            }
          />
          <Divider />
          <List disablePadding>
            {upcomingLessons.map(lesson => (
              <React.Fragment key={lesson.id}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                      {statusChip(lesson.status)}
                      <Tooltip title={startOrJoinLabel(lesson.status)}>
                        <IconButton color="primary" size="small">
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 36, height: 36 }}>
                      <MenuBookIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {lesson.title}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                        <Typography variant="caption" color="text.secondary">
                          {lesson.time}
                        </Typography>
                        <Chip size="small" label={`${lesson.students} học viên`} variant="outlined" />
                      </Stack>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Card>

        {/* Notifications */}
        <Card elevation={0} sx={{ height: '100%', borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardHeader
            title={
              <Stack direction="row" spacing={1} alignItems="center">
                <NotificationsIcon color="primary" />
                <Typography variant="h6">Thông báo</Typography>
              </Stack>
            }
            action={
              <Button size="small" variant="text" component={RouterLink} to="/reports">
                Xem tất cả
              </Button>
            }
          />
          <Divider />
          <List disablePadding sx={{ py: 0.5 }}>
            {notifications.map(n => (
              <React.Fragment key={n.id}>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', width: 28, height: 28 }}>
                      <NotificationsIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
                        {n.title}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={0.25}>
                        <Typography variant="caption" color="text.secondary">
                          {n.desc}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {n.time}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Card>
      </Box>

      {/* Progress section */}
      <Card elevation={0} sx={{ mt: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
        <CardHeader title={<Typography variant="h6">Tiến độ dạy học tháng này</Typography>} />
        <Divider />
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {monthlyProgress.hours.label}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.5 }}>
                <Typography variant="h6">
                  {monthlyProgress.hours.current}/{monthlyProgress.hours.total} giờ
                </Typography>
                <Chip
                  size="small"
                  color="success"
                  variant="outlined"
                  label={`${Math.round((monthlyProgress.hours.current / monthlyProgress.hours.total) * 100)}%`}
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(monthlyProgress.hours.current / monthlyProgress.hours.total) * 100}
                sx={{ height: 8, borderRadius: 4 }}
                color={monthlyProgress.hours.color}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {monthlyProgress.completion.label}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.5 }}>
                <Typography variant="h6">
                  {monthlyProgress.completion.current}/{monthlyProgress.completion.total} học viên
                </Typography>
                <Chip
                  size="small"
                  color="success"
                  variant="outlined"
                  label={`${Math.round((monthlyProgress.completion.current / monthlyProgress.completion.total) * 100)}%`}
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(monthlyProgress.completion.current / monthlyProgress.completion.total) * 100}
                sx={{ height: 8, borderRadius: 4 }}
                color={monthlyProgress.completion.color}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {monthlyProgress.revenue.label}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.5 }}>
                <Typography variant="h6">
                  {monthlyProgress.revenue.current}M/{monthlyProgress.revenue.total}M VNĐ
                </Typography>
                <Chip
                  size="small"
                  color="warning"
                  variant="outlined"
                  label={`${Math.round((monthlyProgress.revenue.current / monthlyProgress.revenue.total) * 100)}%`}
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(monthlyProgress.revenue.current / monthlyProgress.revenue.total) * 100}
                sx={{ height: 8, borderRadius: 4 }}
                color={monthlyProgress.revenue.color}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Quick links */}
      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Mẫu bài học</Typography>
              <Typography variant="body2" color="text.secondary">
                Thư viện mẫu để tạo bài học nhanh
              </Typography>
              <Button size="small" variant="text" component={RouterLink} to="/lesson-templates">
                Mở thư viện
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Quản lý lớp học</Typography>
              <Typography variant="body2" color="text.secondary">
                Xem danh sách lớp và lịch dạy
              </Typography>
              <Button size="small" variant="text" component={RouterLink} to="/course-class">
                Đi đến lớp học
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Học viên</Typography>
              <Typography variant="body2" color="text.secondary">
                Theo dõi tiến độ học viên
              </Typography>
              <Button size="small" variant="text" component={RouterLink} to="/student">
                Xem danh sách
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Báo cáo</Typography>
              <Typography variant="body2" color="text.secondary">
                Các báo cáo và thống kê cơ bản
              </Typography>
              <Button size="small" variant="text" component={RouterLink} to="/reports">
                Xem báo cáo
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
