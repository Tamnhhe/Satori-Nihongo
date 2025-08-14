import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageHeader from 'app/shared/components/ui/PageHeader';
import DataTable, { DataTableColumn } from 'app/shared/components/ui/DataTable';
import dayjs from 'dayjs';
import { list as listSchedules, create as createSchedule, remove as removeSchedule, type ScheduleDTO } from 'app/shared/api/schedules';

type NewScheduleForm = {
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  courseId?: string;
};

const SchedulePage: React.FC = () => {
  const [rows, setRows] = React.useState<ScheduleDTO[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Create dialog state
  const [openCreate, setOpenCreate] = React.useState<boolean>(false);
  const [createForm, setCreateForm] = React.useState<NewScheduleForm>({
    date: dayjs().format('YYYY-MM-DD'),
    startTime: dayjs().hour(9).minute(0).format('HH:mm'),
    endTime: dayjs().hour(10).minute(0).format('HH:mm'),
    location: '',
    courseId: '',
  });
  const [creating, setCreating] = React.useState<boolean>(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, headers } = await listSchedules({ page, size: rowsPerPage });
      setRows(data);
      const totalHeader = headers['x-total-count'] ?? headers['X-Total-Count'];
      setTotal(totalHeader ? parseInt(totalHeader as string, 10) : data.length);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onOpenCreate = () => setOpenCreate(true);
  const onCloseCreate = () => setOpenCreate(false);

  const toIsoDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return undefined;
    // Construct ISO using local date and time
    const composed = dayjs(`${dateStr}T${timeStr}`);
    return composed.isValid() ? composed.toISOString() : undefined;
  };

  const submitCreate = async () => {
    setCreating(true);
    try {
      const payload: Partial<ScheduleDTO> = {
        date: createForm.date ? dayjs(createForm.date).toISOString() : undefined,
        startTime: toIsoDateTime(createForm.date, createForm.startTime),
        endTime: toIsoDateTime(createForm.date, createForm.endTime),
        location: createForm.location ?? undefined,
        course: createForm.courseId ? { id: Number(createForm.courseId) } : undefined,
      };
      await createSchedule(payload);
      setOpenCreate(false);
      // Refresh first page to show newest entries if backend sorts by id desc
      setPage(0);
      fetchData();
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Basic confirm; can be replaced by a nicer dialog later

    const ok = window.confirm('Xóa lịch dạy này?');
    if (!ok) return;
    await removeSchedule(id);
    fetchData();
  };

  const columns: DataTableColumn<ScheduleDTO>[] = [
    {
      id: 'date',
      label: 'Ngày',
      minWidth: 120,
      sortable: true,
      render: row => (row.date ? dayjs(row.date).format('DD/MM/YYYY') : '-'),
    },
    {
      id: 'timeRange',
      label: 'Thời gian',
      minWidth: 160,
      render(row) {
        const s = row.startTime ? dayjs(row.startTime).format('HH:mm') : '--:--';
        const e = row.endTime ? dayjs(row.endTime).format('HH:mm') : '--:--';
        return `${s} - ${e}`;
      },
    },
    { id: 'location', label: 'Địa điểm', minWidth: 160 },
    {
      id: 'course',
      label: 'Khóa học',
      minWidth: 180,
      render: row => row.course?.name ?? (row.course?.id ? `#${row.course.id}` : '-'),
    },
    {
      id: 'actions',
      label: 'Thao tác',
      minWidth: 120,
      align: 'right',
      render: row => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {/* Placeholder for edit in phase-2 */}
          <Tooltip title="Xóa">
            <IconButton size="small" onClick={() => handleDelete(row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="global.entities.teachingSchedule"
        subtitle="Quản lý lịch dạy theo ngày và giờ"
        breadcrumbs={[{ label: 'Trang chủ', to: '/' }, { label: 'Lịch dạy học' }]}
        actions={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData} disabled={loading}>
              Làm mới
            </Button>
            <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={onOpenCreate}>
              Thêm lịch
            </Button>
          </Stack>
        }
      />

      <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">Danh sách lịch dạy</Typography>
              {loading ? <CircularProgress size={16} /> : null}
            </Stack>
          }
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Tổng số: {total.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ p: 2, pt: 0 }}>
            <DataTable<ScheduleDTO>
              rows={rows}
              columns={columns}
              getRowId={row => row.id}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={next => setPage(next)}
              onRowsPerPageChange={rpp => {
                setRowsPerPage(rpp);
                setPage(0);
              }}
              initialSortBy="date"
              initialSortDir="desc"
              emptyMessage="Không có lịch dạy"
              dense
              stickyHeader
              total={total}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={openCreate} onClose={onCloseCreate} fullWidth maxWidth="sm">
        <DialogTitle>Thêm lịch dạy</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Ngày"
              type="date"
              value={createForm.date ?? ''}
              onChange={e => setCreateForm(f => ({ ...f, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Bắt đầu"
                type="time"
                value={createForm.startTime ?? ''}
                onChange={e => setCreateForm(f => ({ ...f, startTime: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                fullWidth
              />
              <TextField
                label="Kết thúc"
                type="time"
                value={createForm.endTime ?? ''}
                onChange={e => setCreateForm(f => ({ ...f, endTime: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                fullWidth
              />
            </Stack>
            <TextField
              label="Địa điểm"
              value={createForm.location ?? ''}
              onChange={e => setCreateForm(f => ({ ...f, location: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Khóa học (ID)"
              type="number"
              value={createForm.courseId ?? ''}
              onChange={e => setCreateForm(f => ({ ...f, courseId: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseCreate}>Hủy</Button>
          <Button onClick={submitCreate} variant="contained" disabled={creating}>
            {creating ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchedulePage;
