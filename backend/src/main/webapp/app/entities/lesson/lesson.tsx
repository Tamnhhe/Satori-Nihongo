import React, { useEffect, useState, useMemo } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Translate, JhiItemCount, JhiPagination, getPaginationState } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { getEntities } from './lesson.reducer';

import { Box, Stack, Button, Chip, Typography, Card, CardContent } from '@mui/material';
import PageHeader from 'app/shared/components/ui/PageHeader';
import DataTable, { DataTableColumn } from 'app/shared/components/ui/DataTable';
import EmptyState from 'app/shared/components/ui/EmptyState';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ILesson } from 'app/shared/model/lesson.model';

export const Lesson = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const lessonList = useAppSelector(state => state.lesson.entities);
  const loading = useAppSelector(state => state.lesson.loading);
  const totalItems = useAppSelector(state => state.lesson.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const handleSort = (p: string) => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = (currentPage: number) =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  // Columns for DataTable
  type LessonRow = ILesson;

  const columns: DataTableColumn<LessonRow>[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        minWidth: 80,
        sortable: true,
        render: row => (
          <Button component={RouterLink} to={`/lesson/${row.id}`} size="small">
            {row.id}
          </Button>
        ),
      },
      {
        id: 'title',
        label: 'Title',
        minWidth: 180,
        sortable: true,
        render: row => <Typography variant="body2">{row.title}</Typography>,
      },
      {
        id: 'content',
        label: 'Content',
        minWidth: 220,
        sortable: true,
        render: row => (
          <Typography variant="body2" color="text.secondary" noWrap title={row.content || ''}>
            {row.content}
          </Typography>
        ),
      },
      {
        id: 'videoUrl',
        label: 'Video Url',
        minWidth: 160,
        sortable: true,
        render: row => <Chip size="small" label={row.videoUrl || '-'} variant="outlined" color={row.videoUrl ? 'primary' : 'default'} />,
      },
      {
        id: 'slideUrl',
        label: 'Slide Url',
        minWidth: 160,
        sortable: true,
        render: row => <Chip size="small" label={row.slideUrl || '-'} variant="outlined" color={row.slideUrl ? 'primary' : 'default'} />,
      },
      {
        id: 'course',
        label: 'Course',
        minWidth: 120,
        render: row =>
          row.course ? (
            <Button component={RouterLink} to={`/course/${row.course.id}`} size="small" variant="text">
              {row.course.id}
            </Button>
          ) : (
            '-'
          ),
      },
      {
        id: 'actions',
        label: '',
        minWidth: 220,
        align: 'right',
        render: row => (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              component={RouterLink}
              to={`/lesson/${row.id}`}
              size="small"
              color="info"
              variant="outlined"
              startIcon={<VisibilityIcon />}
            >
              <Translate contentKey="entity.action.view">View</Translate>
            </Button>
            <Button
              component={RouterLink}
              to={`/lesson/${row.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
              size="small"
              color="primary"
              variant="outlined"
              startIcon={<EditIcon />}
            >
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </Button>
            <Button
              onClick={() =>
                (window.location.href = `/lesson/${row.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
              }
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
            >
              <Translate contentKey="entity.action.delete">Delete</Translate>
            </Button>
          </Stack>
        ),
      },
    ],
    [paginationState.activePage, paginationState.order, paginationState.sort],
  );

  return (
    <Box>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Lessons' }]}
        title={<Translate contentKey="onlineSatoriPlatformApp.lesson.home.title">Lessons</Translate>}
        subtitle={<Translate contentKey="onlineSatoriPlatformApp.lesson.home.subtitle">Manage lessons</Translate>}
        actions={
          <>
            <Button onClick={handleSyncList} disabled={loading} startIcon={<RefreshIcon />} variant="outlined">
              <Translate contentKey="onlineSatoriPlatformApp.lesson.home.refreshListLabel">Refresh List</Translate>
            </Button>
            <Button component={RouterLink} to="/lesson/new" variant="contained" startIcon={<AddIcon />}>
              <Translate contentKey="onlineSatoriPlatformApp.lesson.home.createLabel">Create new Lesson</Translate>
            </Button>
          </>
        }
      />

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          {lessonList && lessonList.length > 0 ? (
            <DataTable<LessonRow>
              rows={lessonList as LessonRow[]}
              columns={columns}
              // We keep server-side pagination below (JhiPagination),
              // so disable client pagination inside DataTable by showing only current page rows
              // and ignoring its TablePagination. Easiest: set rowsPerPage to a large value and single page.
              // Alternatively, DataTable could expose a pagination disable option in future.
              rowsPerPage={lessonList.length}
              page={0}
              onPageChange={() => {}}
              onRowsPerPageChange={() => {}}
              emptyMessage="No Lessons found"
              stickyHeader
              dense
            />
          ) : (
            !loading && (
              <EmptyState
                title={(<Translate contentKey="onlineSatoriPlatformApp.lesson.home.notFound">No Lessons found</Translate>) as any}
                description={
                  (
                    <Translate contentKey="onlineSatoriPlatformApp.lesson.home.emptyHelp">
                      Create your first lesson to get started
                    </Translate>
                  ) as any
                }
                icon={<MenuBookIcon />}
                actionLabel={<Translate contentKey="onlineSatoriPlatformApp.lesson.home.createLabel">Create new Lesson</Translate>}
                onAction={() => navigate('/lesson/new')}
              />
            )
          )}
        </CardContent>
      </Card>

      {totalItems ? (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </Box>
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
};

export default Lesson;
