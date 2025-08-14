import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Chip,
  Paper,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import PageHeader from 'app/shared/components/ui/PageHeader';
import StatCard from 'app/shared/components/ui/StatCard';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { getAnalytics, getDeliveryRate, getSystemHealth, type NotificationAnalyticsDTO } from 'app/shared/api/notificationAnalytics';

const AdminNotificationAnalyticsPage: React.FC = () => {
  const [startDate, setStartDate] = React.useState<string>(dayjs().subtract(30, 'day').format('YYYY-MM-DDTHH:mm'));
  const [endDate, setEndDate] = React.useState<string>(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [loading, setLoading] = React.useState<boolean>(false);

  const [analytics, setAnalytics] = React.useState<NotificationAnalyticsDTO | null>(null);
  const [deliveryRate, setDeliveryRate] = React.useState<number | null>(null);
  const [health, setHealth] = React.useState<Record<string, any> | null>(null);

  const toIso = (local?: string) => (local ? dayjs(local).toISOString() : undefined);

  const fetchAll = React.useCallback(async () => {
    setLoading(true);
    try {
      const [a, r, h] = await Promise.all([
        getAnalytics({ startDate: toIso(startDate), endDate: toIso(endDate) }),
        getDeliveryRate({ startDate: toIso(startDate), endDate: toIso(endDate) }),
        getSystemHealth(),
      ]);
      setAnalytics(a);
      setDeliveryRate(r);
      setHealth(h);
    } catch {
      toast.error('Không thể tải dữ liệu phân tích thông báo');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const total = analytics?.totalNotifications ?? 0;
  const delivered = analytics?.delivered ?? 0;
  const failed = analytics?.failed ?? 0;
  const bounced = analytics?.bounced ?? 0;

  return (
    <Box>
      <PageHeader
        title="global.entities.notificationAnalytics"
        subtitle="Chỉ số phân phối, tỷ lệ thành công và sức khỏe hệ thống"
        breadcrumbs={[{ label: 'Trang chủ', to: '/' }, { label: 'Phân tích' }, { label: 'Thông báo' }]}
        actions={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchAll} disabled={loading}>
              Làm mới
            </Button>
          </Stack>
        }
        bottom={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Bắt đầu"
              type="datetime-local"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="Kết thúc"
              type="datetime-local"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Stack>
        }
      />

      {loading ? <CircularProgress size={16} /> : null}

      {/* KPI cards */}
      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <StatCard title="Tổng số" value={total.toLocaleString()} diffLabel="30 ngày" color="primary" icon={<NotificationsIcon />} />
        <StatCard title="Đã gửi" value={delivered.toLocaleString()} diffLabel="thành công" color="success" icon={<CheckCircleIcon />} />
        <StatCard title="Thất bại" value={failed.toLocaleString()} diffLabel="gặp lỗi" color="warning" icon={<ErrorOutlineIcon />} />
        <StatCard
          title="Tỷ lệ phân phối"
          value={deliveryRate !== null ? `${(deliveryRate * 100).toFixed(1)}%` : '--'}
          diffLabel="trong khoảng thời gian"
          color="secondary"
          icon={<InsightsIcon />}
        />
      </Box>

      {/* Breakdown and health */}
      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardHeader title={<Typography variant="h6">Phân tích theo kênh & trạng thái</Typography>} />
          <Divider />
          <CardContent>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Theo kênh
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {analytics?.byChannel ? (
                    Object.entries(analytics.byChannel).map(([k, v]) => <Chip key={k} label={`${k}: ${v}`} variant="outlined" />)
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Không có dữ liệu
                    </Typography>
                  )}
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Theo trạng thái
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {analytics?.byStatus ? (
                    Object.entries(analytics.byStatus).map(([k, v]) => <Chip key={k} label={`${k}: ${v}`} variant="outlined" />)
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Không có dữ liệu
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardHeader title={<Typography variant="h6">Sức khỏe hệ thống</Typography>} />
          <Divider />
          <CardContent>
            {health ? (
              <Stack spacing={1.5}>
                {Object.entries(health).map(([k, v]) => (
                  <Paper key={k} variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="baseline" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {k}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Không có dữ liệu
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Timeline */}
      <Card elevation={0} sx={{ mt: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
        <CardHeader title={<Typography variant="h6">Dòng thời gian</Typography>} />
        <Divider />
        <CardContent>
          {analytics?.timeline && analytics.timeline.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 1,
              }}
            >
              {analytics.timeline.slice(-20).map((p, idx) => (
                <Paper key={`${p.timestamp}-${idx}`} variant="outlined" sx={{ p: 1, borderRadius: 1.5 }}>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(p.timestamp).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {p.count}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có dữ liệu dòng thời gian
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminNotificationAnalyticsPage;
