import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';

export type Align = 'left' | 'right' | 'center' | 'justify' | 'inherit';

export interface DataTableColumn<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: Align;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId?: (row: T) => React.Key;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  initialSortBy?: string;
  initialSortDir?: 'asc' | 'desc';
  emptyMessage?: string;
  dense?: boolean;
  stickyHeader?: boolean;
  total?: number; // optional total count for server-side pagination
}

type Order = 'asc' | 'desc';

// Generic comparator
function descendingComparator<T>(a: T, b: T, orderBy: keyof T | string): number {
  const aVal = (a as any)[orderBy as any];
  const bVal = (b as any)[orderBy as any];

  if (bVal < aVal) return -1;
  if (bVal > aVal) return 1;
  return 0;
}

function getComparator<T>(order: Order, orderBy: keyof T | string) {
  return order === 'desc' ? (a: T, b: T) => descendingComparator(a, b, orderBy) : (a: T, b: T) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number): T[] {
  const stabilized = array.map((el, index) => [el, index] as [T, number]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map(el => el[0]);
}

/**
 * DataTable - A lightweight MUI Table wrapper with client-side sorting and pagination.
 * Avoids @mui/x-data-grid dependency while providing a simple, reusable table API.
 */
function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  const {
    rows,
    columns,
    getRowId,
    page: controlledPage,
    rowsPerPage: controlledRpp,
    onPageChange,
    onRowsPerPageChange,
    initialSortBy,
    initialSortDir = 'asc',
    emptyMessage = 'Không có dữ liệu',
    dense = false,
    stickyHeader = false,
    total,
  } = props;

  const [order, setOrder] = React.useState<Order>(initialSortDir);
  const [orderBy, setOrderBy] = React.useState<string | undefined>(initialSortBy);
  const [page, setPage] = React.useState<number>(controlledPage ?? 0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(controlledRpp ?? 10);

  // sync controlled props if provided
  React.useEffect(() => {
    if (typeof controlledPage === 'number') setPage(controlledPage);
  }, [controlledPage]);

  React.useEffect(() => {
    if (typeof controlledRpp === 'number') setRowsPerPage(controlledRpp);
  }, [controlledRpp]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const next = parseInt(event.target.value, 10);
    if (onRowsPerPageChange) onRowsPerPageChange(next);
    else {
      setRowsPerPage(next);
      setPage(0);
    }
  };

  const visibleRows = React.useMemo(() => {
    const data = orderBy ? stableSort(rows, getComparator(order, orderBy)) : rows.slice();
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [rows, order, orderBy, page, rowsPerPage]);

  return (
    <Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      <TableContainer sx={{ maxHeight: stickyHeader ? 480 : 'none' }}>
        <Table stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {columns.map(col => {
                const isSortable = col.sortable;
                const active = orderBy === col.id;
                return (
                  <TableCell
                    key={String(col.id)}
                    align={col.align ?? 'left'}
                    sx={{ minWidth: col.minWidth }}
                    sortDirection={active ? order : false}
                  >
                    {isSortable ? (
                      <TableSortLabel active={active} direction={active ? order : 'asc'} onClick={() => handleRequestSort(String(col.id))}>
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row, idx) => {
                const rowKey = getRowId ? getRowId(row) : ((row as any).id ?? idx);
                return (
                  <TableRow hover role="row" tabIndex={-1} key={rowKey}>
                    {columns.map(col => {
                      const content = col.render ? col.render(row) : (row as any)[col.id as any];
                      return (
                        <TableCell key={String(col.id)} align={col.align ?? 'left'}>
                          {content}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50]}
          count={total ?? rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Paper>
  );
}

export default DataTable;
