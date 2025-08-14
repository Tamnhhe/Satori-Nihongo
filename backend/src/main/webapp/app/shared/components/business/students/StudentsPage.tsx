import React from 'react';
import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography, Button, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PageHeader from 'app/shared/components/ui/PageHeader';
import DataTable, { DataTableColumn } from 'app/shared/components/ui/DataTable';
import { list as listStudents, type StudentProfile } from 'app/shared/api/studentProfiles';

const StudentsPage: React.FC = () => {
  const [rows, setRows] = React.useState<StudentProfile[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, headers } = await listStudents({ page, size: rowsPerPage });
      setRows(data);
      const totalHeader = (headers as any)['x-total-count'] ?? (headers as any)['X-Total-Count'];
      setTotal(totalHeader ? parseInt(totalHeader as string, 10) : data.length);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: DataTableColumn<StudentProfile>[] = [
    { id: 'id', label: 'ID', minWidth: 80, sortable: true },
    { id: 'studentId', label: 'Mã học viên', minWidth: 140, sortable: true },
    { id: 'gpa', label: 'GPA', minWidth: 80, sortable: true, align: 'right' },
    {
      id: 'actions',
      label: 'Thao tác',
      minWidth: 160,
      align: 'right',
      render: row => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" variant="text" component={RouterLink} to={`/student-profile/${row.id}`}>
            Chi tiết
          </Button>
          <Button size="small" variant="text" component={RouterLink} to={`/student-profile/${row.id}/edit`}>
            Sửa
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="global.entities.studentManagement"
        subtitle="Xem danh sách học viên, theo dõi và điều chỉnh thông tin"
        breadcrumbs={[{ label: 'Trang chủ', to: '/' }, { label: 'Học viên' }]}
        actions={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={fetchData} disabled={loading}>
              Làm mới
            </Button>
            <Button size="small" variant="contained" component={RouterLink} to="/student-profile/new">
              Thêm học viên
            </Button>
          </Stack>
        }
      />

      <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">Danh sách học viên</Typography>
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
            <DataTable<StudentProfile>
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
              initialSortBy="id"
              initialSortDir="desc"
              emptyMessage="Không có học viên"
              dense
              stickyHeader
              total={total}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentsPage;
