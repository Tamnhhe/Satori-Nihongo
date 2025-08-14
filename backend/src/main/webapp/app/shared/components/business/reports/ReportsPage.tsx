import React from 'react';
import { Box, Card, CardHeader, CardContent, Divider, Stack, Typography, Button, CircularProgress, TextField, Paper } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import GetAppIcon from '@mui/icons-material/Download';
import PageHeader from 'app/shared/components/ui/PageHeader';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import {
  getStudentAnalytics,
  getCoursePerformance,
  getCurrentProgressReport,
  getSemesterProgressReport,
  getProgressReport,
  type StudentAnalyticsDTO,
  type CoursePerformanceDTO,
  type ProgressReportDTO,
} from 'app/shared/api/studentAnalytics';

const ReportsPage: React.FC = () => {
  const [studentId, setStudentId] = React.useState<string>('');
  const [startDate, setStartDate] = React.useState<string>(dayjs().subtract(30, 'day').format('YYYY-MM-DDTHH:mm'));
  const [endDate, setEndDate] = React.useState<string>(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [loading, setLoading] = React.useState<boolean>(false);

  const [analytics, setAnalytics] = React.useState<StudentAnalyticsDTO | null>(null);
  const [coursePerf, setCoursePerf] = React.useState<Record<string, CoursePerformanceDTO> | null>(null);
  const [report, setReport] = React.useState<ProgressReportDTO | null>(null);

  const idNum = Number(studentId);
  const isValidId = !Number.isNaN(idNum) && idNum > 0;
  const toIso = (local: string) => (local ? dayjs(local).toISOString() : undefined);

  const fetchOverview = React.useCallback(async () => {
    if (!isValidId) {
      toast.warn('Vui lòng nhập Student ID hợp lệ');
      return;
    }
    setLoading(true);
    try {
      const [a, cp] = await Promise.all([getStudentAnalytics(idNum), getCoursePerformance(idNum)]);
      setAnalytics(a);
      setCoursePerf(cp);
      toast.success('Đã tải tổng quan học viên');
    } catch (e) {
      toast.error('Không thể tải tổng quan học viên');
    } finally {
      setLoading(false);
    }
  }, [idNum, isValidId]);

  const runCurrent = async () => {
    if (!isValidId) {
      toast.warn('Vui lòng nhập Student ID hợp lệ');
      return;
    }
    setLoading(true);
    try {
      const r = await getCurrentProgressReport(idNum);
      setReport(r);
      toast.success('Đã tạo báo cáo 30 ngày');
    } catch (e) {
      toast.error('Không thể tạo báo cáo 30 ngày');
    } finally {
      setLoading(false);
    }
  };

  const runSemester = async () => {
    if (!isValidId) {
      toast.warn('Vui lòng nhập Student ID hợp lệ');
      return;
    }
    setLoading(true);
    try {
      const r = await getSemesterProgressReport(idNum);
      setReport(r);
      toast.success('Đã tạo báo cáo học kỳ');
    } catch (e) {
      toast.error('Không thể tạo báo cáo học kỳ');
    } finally {
      setLoading(false);
    }
  };

  const runCustom = async () => {
    if (!isValidId) {
      toast.warn('Vui lòng nhập Student ID hợp lệ');
      return;
    }
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      toast.warn('Khoảng thời gian không hợp lệ');
      return;
    }
    setLoading(true);
    try {
      const startIso = dayjs(startDate).toISOString();
      const endIso = dayjs(endDate).toISOString();
      const r = await getProgressReport(idNum, startIso, endIso);
      setReport(r);
      toast.success('Đã tạo báo cáo tùy chọn');
    } catch (e) {
      toast.error('Không thể tạo báo cáo tùy chọn');
    } finally {
      setLoading(false);
    }
  };

  const downloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-student-${studentId}-${dayjs().format('YYYYMMDD-HHmmss')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <PageHeader
        title="global.entities.studentReports"
        subtitle="Tạo báo cáo tiến độ theo khoảng thời gian"
        breadcrumbs={[{ label: 'Trang chủ', to: '/' }, { label: 'Báo cáo' }]}
        bottom={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                label="Student ID"
                type="number"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                size="small"
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                label="Bắt đầu"
                type="datetime-local"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                label="Kết thúc"
                type="datetime-local"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchOverview}
                  disabled={loading || !isValidId}
                >
                  Tải tổng quan
                </Button>
                <Button size="small" variant="contained" onClick={runCurrent} disabled={loading || !isValidId}>
                  30 ngày
                </Button>
                <Button size="small" variant="contained" onClick={runSemester} disabled={loading || !isValidId}>
                  Học kỳ
                </Button>
                <Button size="small" variant="contained" onClick={runCustom} disabled={loading || !isValidId}>
                  Tùy chọn
                </Button>
              </Stack>
            </Box>
          </Box>
        }
      />

      <Box sx={{ mb: 2 }}>{loading ? <CircularProgress size={18} /> : null}</Box>

      {/* Overview */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
        <Box sx={{ flex: '1 1 400px' }}>
          <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
            <CardHeader title={<Typography variant="h6">Tổng quan</Typography>} />
            <Divider />
            <CardContent>
              {analytics ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ flex: '1 1 180px' }}>
                    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Tổng buổi học
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {analytics.totalLessons ?? '-'}
                      </Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: '1 1 180px' }}>
                    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Hoàn thành
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {analytics.completedLessons ?? '-'}
                      </Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: '1 1 180px' }}>
                    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Điểm trung bình
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {analytics.averageScore ?? '-'}
                      </Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: '1 1 180px' }}>
                    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Giờ học
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {analytics.studyHours ?? '-'}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có dữ liệu
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 400px' }}>
          <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
            <CardHeader title={<Typography variant="h6">Hiệu suất theo khóa</Typography>} />
            <Divider />
            <CardContent>
              {coursePerf ? (
                <Stack spacing={1}>
                  {Object.entries(coursePerf).map(([course, perf]) => (
                    <Paper key={course} variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {course}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Hoàn thành: {perf.completionRate ?? '-'}% • Điểm TB: {perf.averageScore ?? '-'}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có dữ liệu
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Report result */}
      <Card elevation={0} sx={{ mt: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
        <CardHeader
          title={<Typography variant="h6">Kết quả báo cáo</Typography>}
          action={
            <Button size="small" variant="text" startIcon={<GetAppIcon />} onClick={downloadJson} disabled={!report}>
              Tải JSON
            </Button>
          }
        />
        <Divider />
        <CardContent>
          {report ? (
            <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: 12, m: 0 }}>
              {JSON.stringify(report, null, 2)}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Chưa có báo cáo
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportsPage;
