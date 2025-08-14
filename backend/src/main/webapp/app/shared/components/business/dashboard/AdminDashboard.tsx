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
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  HealthAndSafety as HealthIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  Cloud as CloudIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import StatCard from 'app/shared/components/ui/StatCard';
import DataTable, { DataTableColumn } from 'app/shared/components/ui/DataTable';

type TeacherRow = {
  id: number;
  name: string;
  level: string;
  students: number;
  rating: number;
  status: 'active' | 'inactive';
  email: string;
};

const AdminDashboard: React.FC = () => {
  // Mock platform stats (replace with API)
  const platformStats = {
    totalUsers: 1247,
    activeTeachers: 36,
    totalCourses: 92,
    monthlyRevenue: 45, // in millions VNĐ
  };

  const topCourses = [
    { id: 1, name: 'Hiragana cơ bản - Phần 1', teacher: 'Sensei Tanaka', completion: 87, revenue: 12 },
    { id: 2, name: 'Kanji N5 - Số đếm', teacher: 'Sensei Yamada', completion: 92, revenue: 9 },
    { id: 3, name: 'Ngữ pháp N4 - Verbs', teacher: 'Sensei Suzuki', completion: 84, revenue: 7 },
  ];

  const teachers: TeacherRow[] = [
    { id: 1, name: 'Nguyễn Văn An', level: 'N5', students: 15, rating: 4.8, status: 'active', email: 'an.nguyen@email.com' },
    { id: 2, name: 'Trần Thị Bình', level: 'N4', students: 18, rating: 4.5, status: 'active', email: 'binh.tran@email.com' },
    { id: 3, name: 'Phạm Nhật Minh', level: 'N3', students: 10, rating: 4.6, status: 'inactive', email: 'minh.pham@email.com' },
  ];

  const systemHealth = {
    serverPerformance: 92,
    storageUsage: 68,
    apiLatencyMs: 145,
    onlineUsers: 284,
  };

  const teacherColumns: DataTableColumn<TeacherRow>[] = [
    {
      id: 'name',
      label: 'Giáo viên',
      minWidth: 220,
      sortable: true,
      render: row => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 32, height: 32 }}>{row.name.charAt(0)}</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 'level',
      label: 'Cấp độ',
      minWidth: 80,
      sortable: true,
      render: row => <Chip size="small" color="primary" variant="outlined" label={row.level} />,
    },
    { id: 'students', label: 'Học viên', minWidth: 80, align: 'right', sortable: true },
    {
      id: 'rating',
      label: 'Đánh giá',
      minWidth: 110,
      align: 'right',
      sortable: true,
      render: row => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
          <StarIcon sx={{ color: 'warning.main' }} fontSize="small" />
          <Typography variant="body2">{row.rating.toFixed(1)}</Typography>
        </Stack>
      ),
    },
    {
      id: 'status',
      label: 'Trạng thái',
      minWidth: 110,
      sortable: true,
      render: row => (
        <Chip
          size="small"
          label={row.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
          color={row.status === 'active' ? 'success' : 'warning'}
          variant="outlined"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Thao tác',
      minWidth: 160,
      align: 'right',
      render: row => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" variant="text" component={RouterLink} to="/teacher-profile">
            Chi tiết
          </Button>
          <Button size="small" variant="text" color="primary" component={RouterLink} to="/schedule">
            Lịch
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 0, md: 0 } }}>
      {/* Header and quick admin actions */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Bảng điều khiển quản trị
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Theo dõi và quản lý toàn bộ nền tảng Satori Nihongo
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="primary" startIcon={<PeopleIcon />} component={RouterLink} to="/admin/user-management">
            Quản lý người dùng
          </Button>
          <Button variant="outlined" color="primary" startIcon={<SettingsIcon />} component={RouterLink} to="/admin/configuration">
            Cài đặt hệ thống
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
        <StatCard
          title="Tổng người dùng"
          value={platformStats.totalUsers.toLocaleString()}
          diffLabel="+12% so với tháng trước"
          icon={<PeopleIcon />}
          color="primary"
        />
        <StatCard
          title="Giáo viên hoạt động"
          value={platformStats.activeTeachers}
          diffLabel="+3 tuần này"
          icon={<SchoolIcon />}
          color="success"
        />
        <StatCard title="Tổng khóa học" value={platformStats.totalCourses} diffLabel="+5 mới" icon={<MenuBookIcon />} color="warning" />
        <StatCard
          title="Doanh thu tháng"
          value={`${platformStats.monthlyRevenue}M VNĐ`}
          diffLabel="+15% mục tiêu"
          icon={<TrendingUpIcon />}
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
        {/* Teachers management (DataTable) */}
        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardHeader
            title={<Typography variant="h6">Quản lý giáo viên</Typography>}
            action={
              <Button size="small" variant="text" component={RouterLink} to="/teacher-profile">
                Xem tất cả
              </Button>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            <DataTable<TeacherRow>
              rows={teachers}
              columns={teacherColumns}
              getRowId={row => row.id}
              initialSortBy="name"
              dense
              stickyHeader
            />
          </CardContent>
        </Card>

        {/* Top courses */}
        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardHeader title={<Typography variant="h6">Khóa học hiệu quả</Typography>} />
          <Divider />
          <List disablePadding>
            {topCourses.map((c, idx) => (
              <React.Fragment key={c.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" size="small" aria-label="view course" component={RouterLink} to="/analytics/courses">
                      <VisibilityIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 32, height: 32 }}>{`#${idx + 1}`}</Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {c.name}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={0.25}>
                        <Typography variant="caption" color="text.secondary">
                          Giảng viên: {c.teacher}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip size="small" label={`Hoàn thành ${c.completion}%`} color="success" variant="outlined" />
                          <Chip size="small" label={`${c.revenue}M VNĐ`} color="warning" variant="outlined" />
                        </Stack>
                      </Stack>
                    }
                  />
                </ListItem>
                {idx < topCourses.length - 1 ? <Divider component="li" /> : null}
              </React.Fragment>
            ))}
          </List>
        </Card>
      </Box>

      {/* System health */}
      <Card elevation={0} sx={{ mt: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <HealthIcon color="success" />
              <Typography variant="h6">Tình trạng hệ thống</Typography>
            </Stack>
          }
          action={
            <Button size="small" variant="text" component={RouterLink} to="/admin/health">
              Xem chi tiết
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Hiệu suất máy chủ
              </Typography>
              <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.5 }}>
                <Typography variant="h6">{systemHealth.serverPerformance}%</Typography>
                <Chip size="small" color="success" variant="outlined" label="Tốt" />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={systemHealth.serverPerformance}
                sx={{ height: 8, borderRadius: 4 }}
                color="success"
              />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Dung lượng lưu trữ
              </Typography>
              <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.5 }}>
                <Typography variant="h6">{systemHealth.storageUsage}%</Typography>
                <Chip size="small" color="warning" variant="outlined" label="Cảnh báo" />
              </Stack>
              <LinearProgress variant="determinate" value={systemHealth.storageUsage} sx={{ height: 8, borderRadius: 4 }} color="warning" />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Độ trễ API
              </Typography>
              <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.5 }}>
                <Typography variant="h6">{systemHealth.apiLatencyMs} ms</Typography>
                <Chip size="small" color="success" variant="outlined" label="Nhanh" />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                <Typography variant="caption">Giám sát qua /management/metrics</Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Người dùng trực tuyến
              </Typography>
              <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.5 }}>
                <Typography variant="h6">{systemHealth.onlineUsers}</Typography>
                <Chip size="small" color="primary" variant="outlined" label="Hoạt động" />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                <CloudIcon fontSize="small" />
                <Typography variant="caption">Thời gian thực</Typography>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Quick admin links */}
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
              <Typography variant="subtitle1">Cấu hình</Typography>
              <Typography variant="body2" color="text.secondary">
                Cài đặt cấu hình hệ thống
              </Typography>
              <Button size="small" variant="text" component={RouterLink} to="/admin/configuration" startIcon={<SettingsIcon />}>
                Mở cấu hình
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Quản lý người dùng</Typography>
              <Typography variant="body2" color="text.secondary">
                Tạo, phân quyền, khóa tài khoản
              </Typography>
              <Button size="small" variant="text" component={RouterLink} to="/admin/user-management" startIcon={<PeopleIcon />}>
                Mở quản lý
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Phân tích</Typography>
              <Typography variant="body2" color="text.secondary">
                Chỉ số hoạt động và doanh thu
              </Typography>
              <Button size="small" variant="text" component={RouterLink} to="/analytics/platform" startIcon={<AnalyticsIcon />}>
                Xem phân tích
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Tài liệu</Typography>
              <Typography variant="body2" color="text.secondary">
                API và hướng dẫn hệ thống
              </Typography>
              <Button size="small" variant="text" component={RouterLink} to="/admin/docs" startIcon={<AssignmentIcon />}>
                Xem tài liệu
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
