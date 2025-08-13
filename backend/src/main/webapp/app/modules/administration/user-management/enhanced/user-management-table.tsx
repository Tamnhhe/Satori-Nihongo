import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Table,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortDown,
  faSortUp,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faUserCheck,
  faUserTimes,
  faDownload,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsersAsAdmin, updateUser } from '../user-management.reducer';

export interface IUserProfile {
  id: string;
  login: string;
  firstName?: string;
  lastName?: string;
  email: string;
  activated: boolean;
  langKey?: string;
  authorities: string[];
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  imageUrl?: string;
  // Extended fields for enhanced management
  role?: string;
  fullName?: string;
  gender?: boolean;
  socialAccounts?: any[];
  teacherProfile?: any;
  studentProfile?: any;
}

export interface UserManagementTableProps {
  users: IUserProfile[];
  totalItems: number;
  loading: boolean;
  onUserEdit: (user: IUserProfile) => void;
  onUserDelete: (userId: string) => void;
  onRoleChange: (userId: string, newRole: string) => void;
  onBulkAction: (action: string, userIds: string[]) => void;
  pagination: {
    activePage: number;
    itemsPerPage: number;
    sort: string;
    order: string;
  };
  onPaginationChange: (pagination: any) => void;
  currentUserRole: string;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  totalItems,
  loading,
  onUserEdit,
  onUserDelete,
  onRoleChange,
  onBulkAction,
  pagination,
  onPaginationChange,
  currentUserRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const account = useAppSelector(state => state.authentication.account);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        !searchTerm ||
        user.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = !roleFilter || user.authorities.includes(roleFilter);
      const matchesStatus =
        !statusFilter || (statusFilter === 'active' && user.activated) || (statusFilter === 'inactive' && !user.activated);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = pagination.sort;
    const order = pagination.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  const sort = (field: string) => () => {
    const newOrder = pagination.sort === field && pagination.order === ASC ? DESC : ASC;
    onPaginationChange({
      ...pagination,
      sort: field,
      order: newOrder,
    });
  };

  const handlePagination = (currentPage: number) => {
    onPaginationChange({
      ...pagination,
      activePage: currentPage,
    });
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => (prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]));
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length > 0) {
      onBulkAction(action, selectedUsers);
      setSelectedUsers([]);
    }
  };

  const toggleActive = (user: IUserProfile) => () => {
    const updatedUser = { ...user, activated: !user.activated };
    // This would typically call the update user action
    // For now, we'll use the existing updateUser action
  };

  const canEditUser = (user: IUserProfile) => {
    return currentUserRole === 'ADMIN' || (currentUserRole === 'GIANG_VIEN' && user.authorities.includes('HOC_VIEN'));
  };

  const canDeleteUser = (user: IUserProfile) => {
    return currentUserRole === 'ADMIN' && account.login !== user.login;
  };

  const getRoleBadgeColor = (authorities: string[]) => {
    if (authorities.includes('ADMIN')) return 'danger';
    if (authorities.includes('GIANG_VIEN')) return 'warning';
    if (authorities.includes('HOC_VIEN')) return 'info';
    return 'secondary';
  };

  const getRoleDisplayName = (authorities: string[]) => {
    if (authorities.includes('ADMIN')) return 'Admin';
    if (authorities.includes('GIANG_VIEN')) return 'Teacher';
    if (authorities.includes('HOC_VIEN')) return 'Student';
    return 'Unknown';
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <Row className="align-items-center">
            <Col md={6}>
              <h4 className="mb-0">
                <Translate contentKey="userManagement.home.title">Users</Translate>
              </h4>
            </Col>
            <Col md={6} className="text-end">
              <ButtonGroup>
                <Button color="info" onClick={() => setShowFilters(!showFilters)} size="sm">
                  <FontAwesomeIcon icon={faFilter} /> Filters
                </Button>
                <Button color="success" onClick={() => handleBulkAction('export')} size="sm">
                  <FontAwesomeIcon icon={faDownload} /> Export
                </Button>
                <Button color="primary" onClick={() => handleBulkAction('import')} size="sm">
                  <FontAwesomeIcon icon={faUpload} /> Import
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          {/* Search and Filters */}
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroupText>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroupText>
                <Input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </InputGroup>
            </Col>
            {showFilters && (
              <>
                <Col md={3}>
                  <Input type="select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="GIANG_VIEN">Teacher</option>
                    <option value="HOC_VIEN">Student</option>
                  </Input>
                </Col>
                <Col md={3}>
                  <Input type="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Input>
                </Col>
              </>
            )}
          </Row>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Row className="mb-3">
              <Col>
                <div className="d-flex align-items-center">
                  <span className="me-3">{selectedUsers.length} user(s) selected</span>
                  <ButtonGroup size="sm">
                    <Button color="success" onClick={() => handleBulkAction('activate')}>
                      <FontAwesomeIcon icon={faUserCheck} /> Activate
                    </Button>
                    <Button color="warning" onClick={() => handleBulkAction('deactivate')}>
                      <FontAwesomeIcon icon={faUserTimes} /> Deactivate
                    </Button>
                    <UncontrolledDropdown>
                      <DropdownToggle caret color="info" size="sm">
                        Change Role
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleBulkAction('role:ADMIN')}>Admin</DropdownItem>
                        <DropdownItem onClick={() => handleBulkAction('role:GIANG_VIEN')}>Teacher</DropdownItem>
                        <DropdownItem onClick={() => handleBulkAction('role:HOC_VIEN')}>Student</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </ButtonGroup>
                </div>
              </Col>
            </Row>
          )}

          {/* Users Table */}
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>
                  <Input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectAllUsers}
                  />
                </th>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('login')}>
                  <Translate contentKey="userManagement.login">Login</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('login')} />
                </th>
                <th className="hand" onClick={sort('email')}>
                  <Translate contentKey="userManagement.email">Email</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('email')} />
                </th>
                <th>
                  <Translate contentKey="userManagement.fullName">Full Name</Translate>
                </th>
                <th>Status</th>
                <th>
                  <Translate contentKey="userManagement.profiles">Role</Translate>
                </th>
                <th className="hand" onClick={sort('createdDate')}>
                  <Translate contentKey="userManagement.createdDate">Created Date</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdDate')} />
                </th>
                <th>Social Accounts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={`user-${i}`} id={user.login}>
                  <td>
                    <Input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleUserSelection(user.id)} />
                  </td>
                  <td>
                    <Button tag={Link} to={user.login} color="link" size="sm">
                      {user.id}
                    </Button>
                  </td>
                  <td>{user.login}</td>
                  <td>{user.email}</td>
                  <td>{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                  <td>
                    <Badge color={user.activated ? 'success' : 'danger'}>{user.activated ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td>
                    <Badge color={getRoleBadgeColor(user.authorities)}>{getRoleDisplayName(user.authorities)}</Badge>
                  </td>
                  <td>
                    {user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}
                  </td>
                  <td>
                    {user.socialAccounts && user.socialAccounts.length > 0 ? (
                      <div>
                        {user.socialAccounts.map((socialAccount, j) => (
                          <Badge key={j} color="info" className="me-1">
                            {socialAccount.provider}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={user.login} color="info" size="sm">
                        <FontAwesomeIcon icon={faEye} /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      {canEditUser(user) && (
                        <Button onClick={() => onUserEdit(user)} color="primary" size="sm">
                          <FontAwesomeIcon icon={faEdit} /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                      )}
                      {canDeleteUser(user) && (
                        <Button onClick={() => onUserDelete(user.id)} color="danger" size="sm">
                          <FontAwesomeIcon icon={faTrash} /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalItems ? (
            <div className={filteredUsers?.length > 0 ? '' : 'd-none'}>
              <div className="justify-content-center d-flex">
                <JhiItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage} i18nEnabled />
              </div>
              <div className="justify-content-center d-flex">
                <JhiPagination
                  activePage={pagination.activePage}
                  onSelect={handlePagination}
                  maxButtons={5}
                  itemsPerPage={pagination.itemsPerPage}
                  totalItems={totalItems}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default UserManagementTable;
