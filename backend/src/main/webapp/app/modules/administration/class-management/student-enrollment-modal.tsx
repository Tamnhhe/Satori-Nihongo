import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Input,
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Badge,
  Alert,
  InputGroup,
  InputGroupText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faUserMinus, faUsers, faSync, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getAvailableStudents,
  searchAvailableStudents,
  addStudentToClass,
  removeStudentFromClass,
  addMultipleStudentsToClass,
  addStudentToClassWithWaitlist,
  getEntity,
  resetEnrollmentResult,
} from './class-management.reducer';

interface StudentEnrollmentModalProps {
  isOpen: boolean;
  toggle: () => void;
  classEntity: any;
}

const StudentEnrollmentModal: React.FC<StudentEnrollmentModalProps> = ({ isOpen, toggle, classEntity }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('enrolled');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allowWaitlist, setAllowWaitlist] = useState(false);
  const [showEnrollmentResult, setShowEnrollmentResult] = useState(false);

  const updating = useAppSelector(state => state.classManagement.updating);
  const updateSuccess = useAppSelector(state => state.classManagement.updateSuccess);
  const enrollmentResult = useAppSelector(state => state.classManagement.enrollmentResult);

  useEffect(() => {
    if (isOpen && classEntity) {
      loadAvailableStudents();
    }
  }, [isOpen, classEntity]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(getEntity(classEntity.id));
      loadAvailableStudents();
      setSelectedStudents([]);

      // Show enrollment result if available
      if (enrollmentResult && (enrollmentResult.enrolled || enrollmentResult.waitlisted || enrollmentResult.rejected)) {
        setShowEnrollmentResult(true);
        setTimeout(() => {
          setShowEnrollmentResult(false);
          dispatch(resetEnrollmentResult());
        }, 5000);
      }
    }
  }, [updateSuccess, enrollmentResult, classEntity?.id, dispatch]);

  const loadAvailableStudents = async () => {
    if (!classEntity) return;

    setLoading(true);
    try {
      const response = searchTerm
        ? await dispatch(
            searchAvailableStudents({
              classId: classEntity.id,
              searchTerm,
              page: 0,
              size: 100,
            }),
          ).unwrap()
        : await dispatch(
            getAvailableStudents({
              classId: classEntity.id,
              page: 0,
              size: 100,
            }),
          ).unwrap();

      setAvailableStudents(response.data);
    } catch (error) {
      console.error('Error loading available students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && classEntity) {
      const timeoutId = setTimeout(() => {
        loadAvailableStudents();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const handleAddStudent = async (studentId: number, forceAdd = false) => {
    try {
      if (forceAdd) {
        await dispatch(addStudentToClassWithWaitlist({ classId: classEntity.id, studentId, forceAdd })).unwrap();
      } else {
        await dispatch(addStudentToClass({ classId: classEntity.id, studentId })).unwrap();
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    try {
      await dispatch(removeStudentFromClass({ classId: classEntity.id, studentId })).unwrap();
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const handleBulkAdd = async () => {
    if (selectedStudents.length === 0) return;

    try {
      await dispatch(
        addMultipleStudentsToClass({
          classId: classEntity.id,
          studentIds: selectedStudents,
          allowWaitlist,
        }),
      ).unwrap();
    } catch (error) {
      console.error('Error adding multiple students:', error);
    }
  };

  const handleStudentSelection = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  if (!classEntity) return null;

  const currentEnrollment = classEntity.currentEnrollment || 0;
  const capacity = classEntity.capacity || 0;
  const availableSpots = Math.max(0, capacity - currentEnrollment);
  const waitlistCount = classEntity.waitlistCount || 0;
  const enrollmentPercentage = capacity > 0 ? (currentEnrollment / capacity) * 100 : 0;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <div>
          <Translate contentKey="classManagement.enrollment.title">Manage Enrollment</Translate>
          <div className="text-muted small">
            {classEntity.name} ({classEntity.code})
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        {/* Enrollment Statistics */}
        <Row className="mb-4">
          <Col md="2">
            <Card>
              <CardBody className="text-center">
                <FontAwesomeIcon icon={faUsers} size="2x" className="text-primary mb-2" />
                <h4>{currentEnrollment}</h4>
                <small>{translate('classManagement.enrollment.currentEnrollment')}</small>
              </CardBody>
            </Card>
          </Col>
          <Col md="2">
            <Card>
              <CardBody className="text-center">
                <FontAwesomeIcon icon={faUserPlus} size="2x" className="text-info mb-2" />
                <h4>{capacity}</h4>
                <small>{translate('classManagement.enrollment.capacity')}</small>
              </CardBody>
            </Card>
          </Col>
          <Col md="2">
            <Card>
              <CardBody className="text-center">
                <FontAwesomeIcon icon={faPlus} size="2x" className={`mb-2 ${availableSpots > 0 ? 'text-success' : 'text-danger'}`} />
                <h4>{availableSpots}</h4>
                <small>{translate('classManagement.enrollment.availableSpots')}</small>
              </CardBody>
            </Card>
          </Col>
          <Col md="2">
            <Card>
              <CardBody className="text-center">
                <FontAwesomeIcon icon={faUsers} size="2x" className={`mb-2 ${waitlistCount > 0 ? 'text-warning' : 'text-muted'}`} />
                <h4>{waitlistCount}</h4>
                <small>{translate('classManagement.enrollment.waitlist')}</small>
              </CardBody>
            </Card>
          </Col>
          <Col md="2">
            <Card>
              <CardBody className="text-center">
                <h4 className={enrollmentPercentage >= 100 ? 'text-danger' : enrollmentPercentage >= 80 ? 'text-warning' : 'text-success'}>
                  {enrollmentPercentage.toFixed(1)}%
                </h4>
                <small>{translate('classManagement.enrollment.percentage')}</small>
              </CardBody>
            </Card>
          </Col>
          <Col md="2">
            <Card>
              <CardBody className="text-center">
                <div className="form-check form-switch">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id="allowWaitlistSwitch"
                    checked={allowWaitlist}
                    onChange={e => setAllowWaitlist(e.target.checked)}
                  />
                  <label className="form-check-label small" htmlFor="allowWaitlistSwitch">
                    {translate('classManagement.enrollment.allowWaitlist')}
                  </label>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Enrollment Result Alert */}
        {showEnrollmentResult && enrollmentResult && (
          <Alert color="info" className="mb-3">
            <h6>{translate('classManagement.enrollment.bulkEnrollmentResult')}</h6>
            <ul className="mb-0">
              {enrollmentResult.enrolled > 0 && (
                <li>{translate('classManagement.enrollment.studentsEnrolled', { count: enrollmentResult.enrolled })}</li>
              )}
              {enrollmentResult.waitlisted > 0 && (
                <li>{translate('classManagement.enrollment.studentsWaitlisted', { count: enrollmentResult.waitlisted })}</li>
              )}
              {enrollmentResult.rejected > 0 && (
                <li>{translate('classManagement.enrollment.studentsRejected', { count: enrollmentResult.rejected })}</li>
              )}
              {enrollmentResult.alreadyEnrolled > 0 && (
                <li>{translate('classManagement.enrollment.studentsAlreadyEnrolled', { count: enrollmentResult.alreadyEnrolled })}</li>
              )}
            </ul>
          </Alert>
        )}

        {/* Tab Navigation */}
        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink
              className={activeTab === 'enrolled' ? 'active' : ''}
              onClick={() => setActiveTab('enrolled')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faUsers} className="me-1" />
              <Translate contentKey="classManagement.enrollment.enrolledStudents">Enrolled Students</Translate>
              <Badge color="primary" className="ms-1">
                {currentEnrollment}
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'available' ? 'active' : ''}
              onClick={() => setActiveTab('available')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faUserPlus} className="me-1" />
              <Translate contentKey="classManagement.enrollment.availableStudents">Available Students</Translate>
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="enrolled">
            {classEntity.students && classEntity.students.length > 0 ? (
              <Table responsive>
                <thead>
                  <tr>
                    <th>
                      <Translate contentKey="classManagement.enrollment.studentId">Student ID</Translate>
                    </th>
                    <th>
                      <Translate contentKey="classManagement.enrollment.studentName">Name</Translate>
                    </th>
                    <th>
                      <Translate contentKey="classManagement.enrollment.email">Email</Translate>
                    </th>
                    <th>
                      <Translate contentKey="entity.action.title">Actions</Translate>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classEntity.students.map((student, index) => (
                    <tr key={student.id || index}>
                      <td>
                        <Badge color="primary">{student.studentId}</Badge>
                      </td>
                      <td>{student.userProfile?.fullName}</td>
                      <td>{student.userProfile?.email}</td>
                      <td>
                        <Button color="danger" size="sm" onClick={() => handleRemoveStudent(student.id)} disabled={updating}>
                          <FontAwesomeIcon icon={faUserMinus} />{' '}
                          <Translate contentKey="classManagement.enrollment.remove">Remove</Translate>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert color="info">
                <Translate contentKey="classManagement.enrollment.noEnrolledStudents">No students enrolled in this class</Translate>
              </Alert>
            )}
          </TabPane>

          <TabPane tabId="available">
            <Row className="mb-3">
              <Col md="8">
                <InputGroup>
                  <InputGroupText>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroupText>
                  <Input
                    type="text"
                    placeholder={translate('classManagement.enrollment.searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md="4" className="text-end">
                <Button color="info" className="me-2" onClick={loadAvailableStudents} disabled={loading}>
                  <FontAwesomeIcon icon={faSync} spin={loading} /> <Translate contentKey="entity.action.refresh">Refresh</Translate>
                </Button>
                <Button
                  color={availableSpots <= 0 && allowWaitlist ? 'warning' : 'primary'}
                  onClick={handleBulkAdd}
                  disabled={selectedStudents.length === 0 || (availableSpots <= 0 && !allowWaitlist) || updating}
                >
                  <FontAwesomeIcon icon={faUserPlus} />{' '}
                  {availableSpots <= 0 && allowWaitlist ? (
                    <Translate contentKey="classManagement.enrollment.addToWaitlist">Add to Waitlist</Translate>
                  ) : (
                    <Translate contentKey="classManagement.enrollment.addSelected">Add Selected</Translate>
                  )}
                  {selectedStudents.length > 0 && ` (${selectedStudents.length})`}
                </Button>
              </Col>
            </Row>

            {availableSpots <= 0 && !allowWaitlist && (
              <Alert color="warning" className="mb-3">
                <Translate contentKey="classManagement.enrollment.capacityReached">
                  This class has reached its capacity. No more students can be enrolled.
                </Translate>
                <br />
                <small>
                  <Translate contentKey="classManagement.enrollment.enableWaitlistHint">
                    Enable waitlist to allow enrollment beyond capacity.
                  </Translate>
                </small>
              </Alert>
            )}

            {availableSpots <= 0 && allowWaitlist && (
              <Alert color="info" className="mb-3">
                <Translate contentKey="classManagement.enrollment.waitlistMode">
                  Waitlist mode enabled. New enrollments will be added to the waitlist.
                </Translate>
              </Alert>
            )}

            {loading ? (
              <div className="text-center">
                <FontAwesomeIcon icon={faSync} spin /> Loading...
              </div>
            ) : availableStudents.length > 0 ? (
              <Table responsive>
                <thead>
                  <tr>
                    {(availableSpots > 0 || allowWaitlist) && (
                      <th>
                        <Input
                          type="checkbox"
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedStudents(availableStudents.map(s => s.id));
                            } else {
                              setSelectedStudents([]);
                            }
                          }}
                          checked={selectedStudents.length === availableStudents.length && availableStudents.length > 0}
                        />
                      </th>
                    )}
                    <th>
                      <Translate contentKey="classManagement.enrollment.studentId">Student ID</Translate>
                    </th>
                    <th>
                      <Translate contentKey="classManagement.enrollment.studentName">Name</Translate>
                    </th>
                    <th>
                      <Translate contentKey="classManagement.enrollment.email">Email</Translate>
                    </th>
                    <th>
                      <Translate contentKey="entity.action.title">Actions</Translate>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {availableStudents.map((student, index) => (
                    <tr key={student.id || index}>
                      {(availableSpots > 0 || allowWaitlist) && (
                        <td>
                          <Input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={e => handleStudentSelection(student.id, e.target.checked)}
                            disabled={updating}
                          />
                        </td>
                      )}
                      <td>
                        <Badge color="success">{student.studentId}</Badge>
                      </td>
                      <td>{student.userProfile?.fullName}</td>
                      <td>{student.userProfile?.email}</td>
                      <td>
                        {availableSpots > 0 ? (
                          <Button color="primary" size="sm" onClick={() => handleAddStudent(student.id)} disabled={updating}>
                            <FontAwesomeIcon icon={faUserPlus} /> <Translate contentKey="classManagement.enrollment.add">Add</Translate>
                          </Button>
                        ) : allowWaitlist ? (
                          <Button color="warning" size="sm" onClick={() => handleAddStudent(student.id, true)} disabled={updating}>
                            <FontAwesomeIcon icon={faUserPlus} />{' '}
                            <Translate contentKey="classManagement.enrollment.addToWaitlist">Add to Waitlist</Translate>
                          </Button>
                        ) : (
                          <Button color="secondary" size="sm" disabled>
                            <FontAwesomeIcon icon={faUserPlus} />{' '}
                            <Translate contentKey="classManagement.enrollment.capacityFull">Full</Translate>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert color="info">
                {searchTerm
                  ? translate('classManagement.enrollment.noSearchResults')
                  : translate('classManagement.enrollment.noAvailableStudents')}
              </Alert>
            )}
          </TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          <Translate contentKey="entity.action.close">Close</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default StudentEnrollmentModal;
