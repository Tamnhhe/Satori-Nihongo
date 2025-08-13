import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Input,
  InputGroup,
  ButtonGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
} from 'reactstrap';
import { Translate, translate, getSortState, getPaginationState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
  faEllipsisV,
  faEdit,
  faTrash,
  faSync,
  faPlus,
  faSearch,
  faTh,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import {
  getEntities,
  getCoursesWithStats,
  deleteEntity,
  createEntity,
  updateEntity,
  reset,
  setViewMode,
  ICourse,
  ICourseWithStats,
} from './course-management.reducer';
import CourseEditModal from './course-edit-modal';
import CourseAssignmentModal from './course-assignment-modal';
import ScheduleCalendarView from './schedule-calendar-view';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

const CourseManagementGrid = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showScheduleView, setShowScheduleView] = useState(false);

  const account = useAppSelector(state => state.authentication.account);
  const courseList = useAppSelector(state => state.courseManagement.entities);
  const loading = useAppSelector(state => state.courseManagement.loading);
  const totalItems = useAppSelector(state => state.courseManagement.totalItems);
  const updateSuccess = useAppSelector(state => state.courseManagement.updateSuccess);
  const viewMode = useAppSelector(state => state.courseManagement.viewMode) || 'grid';

  const isAdmin = hasAnyAuthority(account.authorities, [AUTHORITIES.ADMIN]);
  const isTeacher = hasAnyAuthority(account.authorities, [AUTHORITIES.TEACHER]);

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(location, ITEMS_PER_PAGE, 'id'), location.search),
  );

  const getAllEntities = () => {
    if (isAdmin) {
      dispatch(
        getCoursesWithStats({
          page: paginationState.activePage - 1,
          size: paginationState.itemsPerPage,
          sort: `${paginationState.sort},${paginationState.order}`,
        }),
      );
    } else {
      dispatch(
        getEntities({
          page: paginationState.activePage - 1,
          size: paginationState.itemsPerPage,
          sort: `${paginationState.sort},${paginationState.order}`,
        }),
      );
    }
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
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
  }, [location.search]);

  useEffect(() => {
    if (updateSuccess) {
      setShowEditModal(false);
      setSelectedCourse(null);
      getAllEntities();
      dispatch(reset());
    }
  }, [updateSuccess]);

  const sort = (p: string) => () => {
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

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setShowEditModal(true);
  };

  const handleEditCourse = (course: ICourse) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleDeleteCourse = async (courseId: number) => {
    await dispatch(deleteEntity(courseId));
    setShowDeleteConfirm(null);
    getAllEntities();
  };

  const handleSaveCourse = async (course: ICourse) => {
    if (course.id) {
      await dispatch(updateEntity(course));
    } else {
      await dispatch(createEntity(course));
    }
  };

  const handleAssignCourse = (course: ICourse) => {
    setSelectedCourse(course);
    setShowAssignmentModal(true);
  };

  const handleManageSchedule = (course: ICourse) => {
    setSelectedCourse(course);
    setShowScheduleView(true);
  };

  const filteredCourses = courseList.filter(
    (course: ICourse) =>
      !search ||
      course.title?.toLowerCase().includes(search.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
      course.teacher?.fullName?.toLowerCase().includes(search.toLowerCase()),
  );

  const getSortIcon = (fieldName: string) => {
    const iconStyle = { color: 'inherit' };
    return paginationState.sort === fieldName ? (
      paginationState.order === ASC ? (
        <FontAwesomeIcon icon={faSortUp} style={iconStyle} />
      ) : (
        <FontAwesomeIcon icon={faSortDown} style={iconStyle} />
      )
    ) : (
      <FontAwesomeIcon icon={faSort} style={iconStyle} />
    );
  };

  const renderGridView = () => (
    <Row>
      {filteredCourses.map((course: ICourseWithStats) => (
        <Col md="6" lg="4" key={course.id} className="mb-4">
          <Card className="h-100">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 text-truncate" title={course.title}>
                {course.title}
              </h6>
              <UncontrolledDropdown>
                <DropdownToggle tag="button" className="btn btn-sm btn-outline-secondary">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem onClick={() => handleEditCourse(course)}>
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    <Translate contentKey="entity.action.edit">Edit</Translate>
                  </DropdownItem>
                  {isAdmin && (
                    <>
                      <DropdownItem onClick={() => handleAssignCourse(course)}>
                        <FontAwesomeIcon icon="user-plus" className="me-2" />
                        <Translate contentKey="courseManagement.assignment.assign">Assign Course</Translate>
                      </DropdownItem>
                      <DropdownItem onClick={() => handleManageSchedule(course)}>
                        <FontAwesomeIcon icon="calendar" className="me-2" />
                        <Translate contentKey="courseManagement.schedule.manage">Manage Schedule</Translate>
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => setShowDeleteConfirm(course.id)} className="text-danger">
                        <FontAwesomeIcon icon={faTrash} className="me-2" />
                        <Translate contentKey="entity.action.delete">Delete</Translate>
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </CardHeader>
            <CardBody>
              <div className="mb-2">
                <small className="text-muted">
                  <Translate contentKey="courseManagement.courseCode">Course Code</Translate>:
                </small>
                <div>{course.courseCode || '-'}</div>
              </div>

              <div className="mb-2">
                <small className="text-muted">
                  <Translate contentKey="courseManagement.teacher">Teacher</Translate>:
                </small>
                <div>{course.teacher?.fullName || '-'}</div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  <Translate contentKey="courseManagement.description">Description</Translate>:
                </small>
                <div className="text-truncate" title={course.description}>
                  {course.description || '-'}
                </div>
              </div>

              {isAdmin && (
                <div className="row text-center">
                  <div className="col-4">
                    <div className="fw-bold text-primary">{course.enrollmentCount || 0}</div>
                    <small className="text-muted">
                      <Translate contentKey="courseManagement.stats.students">Students</Translate>
                    </small>
                  </div>
                  <div className="col-4">
                    <div className="fw-bold text-success">{course.lessonsCount || 0}</div>
                    <small className="text-muted">
                      <Translate contentKey="courseManagement.stats.lessons">Lessons</Translate>
                    </small>
                  </div>
                  <div className="col-4">
                    <div className="fw-bold text-info">{course.quizzesCount || 0}</div>
                    <small className="text-muted">
                      <Translate contentKey="courseManagement.stats.quizzes">Quizzes</Translate>
                    </small>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderListView = () => (
    <div className="table-responsive">
      <Table hover>
        <thead>
          <tr>
            <th className="hand" onClick={sort('title')}>
              <Translate contentKey="courseManagement.title">Title</Translate>
              {getSortIcon('title')}
            </th>
            <th className="hand" onClick={sort('courseCode')}>
              <Translate contentKey="courseManagement.courseCode">Course Code</Translate>
              {getSortIcon('courseCode')}
            </th>
            <th>
              <Translate contentKey="courseManagement.teacher">Teacher</Translate>
            </th>
            {isAdmin && (
              <>
                <th className="text-center">
                  <Translate contentKey="courseManagement.stats.students">Students</Translate>
                </th>
                <th className="text-center">
                  <Translate contentKey="courseManagement.stats.lessons">Lessons</Translate>
                </th>
                <th className="text-center">
                  <Translate contentKey="courseManagement.stats.quizzes">Quizzes</Translate>
                </th>
              </>
            )}
            <th className="text-end">
              <Translate contentKey="entity.action.actions">Actions</Translate>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course: ICourseWithStats) => (
            <tr key={course.id}>
              <td>
                <div className="fw-bold">{course.title}</div>
                <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                  {course.description}
                </small>
              </td>
              <td>
                <Badge color="secondary">{course.courseCode || '-'}</Badge>
              </td>
              <td>{course.teacher?.fullName || '-'}</td>
              {isAdmin && (
                <>
                  <td className="text-center">
                    <Badge color="primary">{course.enrollmentCount || 0}</Badge>
                  </td>
                  <td className="text-center">
                    <Badge color="success">{course.lessonsCount || 0}</Badge>
                  </td>
                  <td className="text-center">
                    <Badge color="info">{course.quizzesCount || 0}</Badge>
                  </td>
                </>
              )}
              <td className="text-end">
                <ButtonGroup size="sm">
                  <Button color="info" onClick={() => handleEditCourse(course)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  {isAdmin && (
                    <>
                      <Button color="warning" onClick={() => handleAssignCourse(course)}>
                        <FontAwesomeIcon icon="user-plus" />
                      </Button>
                      <Button color="success" onClick={() => handleManageSchedule(course)}>
                        <FontAwesomeIcon icon="calendar" />
                      </Button>
                      <Button color="danger" onClick={() => setShowDeleteConfirm(course.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <div>
      <h2 id="course-management-page-heading" data-cy="courseManagementPageHeading">
        <Translate contentKey="courseManagement.home.title">Course Management</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon={faSync} spin={loading} />
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.refresh">Refresh</Translate>
            </span>
          </Button>
          {(isAdmin || isTeacher) && (
            <Button color="primary" onClick={handleCreateCourse}>
              <FontAwesomeIcon icon={faPlus} />
              <span className="d-none d-md-inline">
                <Translate contentKey="courseManagement.home.createLabel">Create new Course</Translate>
              </span>
            </Button>
          )}
        </div>
      </h2>

      <Row className="mb-3">
        <Col md="6">
          <InputGroup>
            <Input
              type="text"
              placeholder={translate('courseManagement.home.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button color="outline-secondary">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </InputGroup>
        </Col>
        <Col md="6" className="d-flex justify-content-end">
          <ButtonGroup>
            <Button color={viewMode === 'grid' ? 'primary' : 'outline-primary'} onClick={() => dispatch(setViewMode('grid'))}>
              <FontAwesomeIcon icon={faTh} />
            </Button>
            <Button color={viewMode === 'list' ? 'primary' : 'outline-primary'} onClick={() => dispatch(setViewMode('list'))}>
              <FontAwesomeIcon icon={faList} />
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      {filteredCourses && filteredCourses.length > 0 ? (
        <>
          {viewMode === 'grid' ? renderGridView() : renderListView()}

          {totalItems ? (
            <div className="d-flex justify-content-center">
              <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
            </div>
          ) : null}

          {totalItems ? (
            <div className="d-flex justify-content-center">
              <JhiPagination
                activePage={paginationState.activePage}
                onSelect={handlePagination}
                maxButtons={5}
                itemsPerPage={paginationState.itemsPerPage}
                totalItems={totalItems}
              />
            </div>
          ) : null}
        </>
      ) : (
        !loading && (
          <Alert color="warning">
            <Translate contentKey="courseManagement.home.notFound">No courses found</Translate>
          </Alert>
        )
      )}

      <CourseEditModal
        isOpen={showEditModal}
        course={selectedCourse}
        teachers={[]} // Teachers will be loaded from the enhanced user management API
        onSave={handleSaveCourse}
        onClose={() => setShowEditModal(false)}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
                </h5>
              </div>
              <div className="modal-body">
                <Translate contentKey="courseManagement.delete.question" interpolate={{ id: showDeleteConfirm }}>
                  Are you sure you want to delete this course?
                </Translate>
              </div>
              <div className="modal-footer">
                <Button color="secondary" onClick={() => setShowDeleteConfirm(null)}>
                  <Translate contentKey="entity.action.cancel">Cancel</Translate>
                </Button>
                <Button color="danger" onClick={() => handleDeleteCourse(showDeleteConfirm)}>
                  <Translate contentKey="entity.action.delete">Delete</Translate>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Assignment Modal */}
      {selectedCourse && (
        <CourseAssignmentModal
          isOpen={showAssignmentModal}
          toggle={() => setShowAssignmentModal(false)}
          courseId={selectedCourse.id}
          courseTitle={selectedCourse.title}
          currentTeacherId={selectedCourse.teacher?.id}
        />
      )}

      {/* Schedule Management View */}
      {selectedCourse && showScheduleView && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Translate contentKey="scheduleManagement.title">Schedule Management</Translate>
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowScheduleView(false)} />
              </div>
              <div className="modal-body p-0">
                <ScheduleCalendarView courseId={selectedCourse.id} courseTitle={selectedCourse.title} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementGrid;
