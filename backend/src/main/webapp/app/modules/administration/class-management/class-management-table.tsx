import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Table,
  Badge,
  Input,
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Progress,
  InputGroup,
  InputGroupText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faUserPlus,
  faSearch,
  faSync,
  faUsers,
  faCalendar,
  faBook,
  faSort,
  faSortUp,
  faSortDown,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import { Translate, translate, getPaginationState } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { getEntities, deleteEntity, reset } from './class-management.reducer';
import ClassEditModal from './class-edit-modal';
import StudentEnrollmentModal from './student-enrollment-modal';

export const ClassManagementTable = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(location, ITEMS_PER_PAGE, 'id'), location.search),
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [enrollmentFilter, setEnrollmentFilter] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [enrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, classEntity: null });

  const classManagementState = useAppSelector(state => state.classManagement);
  const { entities: classes, loading, totalItems, updateSuccess } = classManagementState;

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: pagination.activePage - 1,
        size: pagination.itemsPerPage,
        sort: `${pagination.sort},${pagination.order}`,
        searchTerm,
        statusFilter,
        enrollmentFilter,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [pagination.activePage, pagination.order, pagination.sort, searchTerm, statusFilter, enrollmentFilter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [location.search]);

  useEffect(() => {
    if (updateSuccess) {
      getAllEntities();
      dispatch(reset());
    }
  }, [updateSuccess]);

  const sort = p => () => {
    setPagination({
      ...pagination,
      order: pagination.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const confirmDelete = classEntity => {
    setDeleteModal({ isOpen: true, classEntity });
  };

  const handleDelete = () => {
    if (deleteModal.classEntity) {
      dispatch(deleteEntity(deleteModal.classEntity.id));
      setDeleteModal({ isOpen: false, classEntity: null });
    }
  };

  const handleEdit = classEntity => {
    setSelectedClass(classEntity);
    setEditModalVisible(true);
  };

  const handleEnrollment = classEntity => {
    setSelectedClass(classEntity);
    setEnrollmentModalVisible(true);
  };

  const getStatusBadge = status => {
    const statusConfig = {
      UPCOMING: { color: 'primary', text: translate('classManagement.status.upcoming') },
      ACTIVE: { color: 'success', text: translate('classManagement.status.active') },
      COMPLETED: { color: 'secondary', text: translate('classManagement.status.completed') },
      CANCELLED: { color: 'danger', text: translate('classManagement.status.cancelled') },
    };
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const getEnrollmentProgress = (currentEnrollment, capacity) => {
    if (!capacity) return null;
    const percentage = Math.min((currentEnrollment / capacity) * 100, 100);
    const color = percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : 'success';
    return (
      <div>
        <Progress value={percentage} color={color} className="mb-1" />
        <small>
          {currentEnrollment}/{capacity}
        </small>
      </div>
    );
  };

  const getSortIcon = columnName => {
    if (pagination.sort === columnName) {
      return pagination.order === ASC ? faSortUp : faSortDown;
    }
    return faSort;
  };

  // Calculate summary statistics
  const totalClasses = classes?.length || 0;
  const activeClasses = classes?.filter(c => c.status === 'ACTIVE').length || 0;
  const totalEnrollment = classes?.reduce((sum, c) => sum + (c.currentEnrollment || 0), 0) || 0;
  const fullyEnrolledClasses = classes?.filter(c => c.isFullyEnrolled).length || 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 id="class-management-heading">
          <Translate contentKey="classManagement.home.title">Class Management</Translate>
        </h2>
        <div className="d-flex gap-2">
          <Button color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon={faSync} spin={loading} /> <Translate contentKey="entity.action.refresh">Refresh</Translate>
          </Button>
          <Button color="primary" onClick={() => handleEdit(null)}>
            <FontAwesomeIcon icon={faPlus} /> <Translate contentKey="classManagement.home.createLabel">Create new Class</Translate>
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <Row className="mb-4">
        <Col md="3">
          <Card>
            <CardBody className="text-center">
              <FontAwesomeIcon icon={faBook} size="2x" className="text-primary mb-2" />
              <h4>{totalClasses}</h4>
              <small>
                <Translate contentKey="classManagement.stats.totalClasses">Total Classes</Translate>
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card>
            <CardBody className="text-center">
              <FontAwesomeIcon icon={faCalendar} size="2x" className="text-success mb-2" />
              <h4>{activeClasses}</h4>
              <small>
                <Translate contentKey="classManagement.stats.activeClasses">Active Classes</Translate>
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card>
            <CardBody className="text-center">
              <FontAwesomeIcon icon={faUsers} size="2x" className="text-info mb-2" />
              <h4>{totalEnrollment}</h4>
              <small>
                <Translate contentKey="classManagement.stats.totalEnrollment">Total Enrollment</Translate>
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card>
            <CardBody className="text-center">
              <FontAwesomeIcon icon={faUserPlus} size="2x" className="text-warning mb-2" />
              <h4>{fullyEnrolledClasses}</h4>
              <small>
                <Translate contentKey="classManagement.stats.fullyEnrolled">Fully Enrolled</Translate>
              </small>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <CardBody>
          <Row>
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder={translate('classManagement.search.placeholder')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md="3">
              <Input type="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">{translate('classManagement.filter.status')}</option>
                <option value="UPCOMING">{translate('classManagement.status.upcoming')}</option>
                <option value="ACTIVE">{translate('classManagement.status.active')}</option>
                <option value="COMPLETED">{translate('classManagement.status.completed')}</option>
                <option value="CANCELLED">{translate('classManagement.status.cancelled')}</option>
              </Input>
            </Col>
            <Col md="3">
              <Input type="select" value={enrollmentFilter} onChange={e => setEnrollmentFilter(e.target.value)}>
                <option value="">{translate('classManagement.filter.enrollment')}</option>
                <option value="available">{translate('classManagement.filter.availableSpots')}</option>
                <option value="full">{translate('classManagement.filter.fullyEnrolled')}</option>
                <option value="overCapacity">{translate('classManagement.filter.overCapacity')}</option>
              </Input>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardBody>
          {loading ? (
            <div className="text-center">
              <FontAwesomeIcon icon={faSync} spin /> Loading...
            </div>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={sort('code')}>
                    <Translate contentKey="classManagement.code">Code</Translate> <FontAwesomeIcon icon={getSortIcon('code')} />
                  </th>
                  <th className="hand" onClick={sort('name')}>
                    <Translate contentKey="classManagement.name">Name</Translate> <FontAwesomeIcon icon={getSortIcon('name')} />
                  </th>
                  <th>
                    <Translate contentKey="classManagement.course">Course</Translate>
                  </th>
                  <th>
                    <Translate contentKey="classManagement.teacher">Teacher</Translate>
                  </th>
                  <th className="hand" onClick={sort('currentEnrollment')}>
                    <Translate contentKey="classManagement.currentEnrollment">Enrollment</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIcon('currentEnrollment')} />
                  </th>
                  <th className="hand" onClick={sort('startDate')}>
                    <Translate contentKey="classManagement.startDate">Start Date</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIcon('startDate')} />
                  </th>
                  <th>Status</th>
                  <th>
                    <Translate contentKey="entity.action.title">Actions</Translate>
                  </th>
                </tr>
              </thead>
              <tbody>
                {classes && classes.length > 0 ? (
                  classes.map((classEntity, i) => (
                    <tr key={`entity-${i}`}>
                      <td>
                        <Link to={`/admin/class-management/${classEntity.id}`} className="fw-bold">
                          {classEntity.code}
                        </Link>
                      </td>
                      <td>{classEntity.name}</td>
                      <td>
                        <div>
                          <div className="fw-bold">{classEntity.course?.title}</div>
                          <small className="text-muted">{classEntity.course?.courseCode}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{classEntity.teacher?.userProfile?.fullName}</div>
                          <small className="text-muted">{classEntity.teacher?.teacherCode}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center mb-1">
                          <FontAwesomeIcon icon={faUsers} className="me-1" />
                          <span className="fw-bold">{classEntity.currentEnrollment}</span>
                          {classEntity.capacity && <span className="text-muted">/{classEntity.capacity}</span>}
                          {classEntity.waitlistCount > 0 && (
                            <Badge color="warning" className="ms-2" size="sm">
                              +{classEntity.waitlistCount} {translate('classManagement.enrollment.waitlist')}
                            </Badge>
                          )}
                        </div>
                        {getEnrollmentProgress(classEntity.currentEnrollment, classEntity.capacity)}
                        {classEntity.isFullyEnrolled && (
                          <Badge color="danger" className="mt-1">
                            {translate('classManagement.fullyEnrolled')}
                          </Badge>
                        )}
                        {classEntity.isOverCapacity && (
                          <Badge color="warning" className="mt-1 ms-1">
                            {translate('classManagement.enrollment.overCapacity')}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <FontAwesomeIcon icon={faCalendar} className="me-1" />
                        {classEntity.startDate ? new Date(classEntity.startDate).toLocaleDateString() : '-'}
                      </td>
                      <td>{getStatusBadge(classEntity.status)}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Button tag={Link} to={`/admin/class-management/${classEntity.id}`} color="info" size="sm">
                            <FontAwesomeIcon icon={faEdit} />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.edit">Edit</Translate>
                            </span>
                          </Button>
                          <Button color="primary" size="sm" onClick={() => handleEnrollment(classEntity)}>
                            <FontAwesomeIcon icon={faUserPlus} />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="classManagement.manageEnrollment">Manage Enrollment</Translate>
                            </span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`/admin/class-management/${classEntity.id}/schedule`}
                            color="info"
                            size="sm"
                            className="ms-1"
                          >
                            <FontAwesomeIcon icon={faCalendar} />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="classManagement.schedule.manage">Schedule</Translate>
                            </span>
                          </Button>
                          <Button color="danger" size="sm" onClick={() => confirmDelete(classEntity)}>
                            <FontAwesomeIcon icon={faTrash} />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.delete">Delete</Translate>
                            </span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      <Translate contentKey="classManagement.home.notFound">No classes found</Translate>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.isOpen} toggle={() => setDeleteModal({ isOpen: false, classEntity: null })}>
        <ModalHeader toggle={() => setDeleteModal({ isOpen: false, classEntity: null })}>
          <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
        </ModalHeader>
        <ModalBody>
          <Translate contentKey="classManagement.delete.question" interpolate={{ name: deleteModal.classEntity?.name }}>
            Are you sure you want to delete this class?
          </Translate>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal({ isOpen: false, classEntity: null })}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="danger" onClick={handleDelete}>
            <Translate contentKey="entity.action.delete">Delete</Translate>
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modals */}
      <ClassEditModal
        isOpen={editModalVisible}
        toggle={() => {
          setEditModalVisible(false);
          setSelectedClass(null);
        }}
        classEntity={selectedClass}
      />

      <StudentEnrollmentModal
        isOpen={enrollmentModalVisible}
        toggle={() => {
          setEnrollmentModalVisible(false);
          setSelectedClass(null);
        }}
        classEntity={selectedClass}
      />
    </div>
  );
};

export default ClassManagementTable;
