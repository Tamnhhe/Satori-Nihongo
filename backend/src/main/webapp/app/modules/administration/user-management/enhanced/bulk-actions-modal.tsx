import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
  Table,
  Badge,
  Form,
  FormGroup,
  Label,
  Input,
  Progress,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faUserTimes, faUserCog, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Translate } from 'react-jhipster';
import { IUserProfile } from './user-management-table';

export interface IBulkActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: string, data?: any) => Promise<void>;
  selectedUsers: IUserProfile[];
  action: string;
  loading: boolean;
  result?: any;
}

export const BulkActionsModal: React.FC<IBulkActionsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedUsers,
  action,
  loading,
  result,
}) => {
  const [newRole, setNewRole] = useState('HOC_VIEN');

  const getActionIcon = () => {
    switch (action) {
      case 'activate':
        return faUserCheck;
      case 'deactivate':
        return faUserTimes;
      case 'changeRole':
        return faUserCog;
      default:
        return faExclamationTriangle;
    }
  };

  const getActionColor = () => {
    switch (action) {
      case 'activate':
        return 'success';
      case 'deactivate':
        return 'warning';
      case 'changeRole':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getActionTitle = () => {
    switch (action) {
      case 'activate':
        return 'userManagement.bulk.activate.title';
      case 'deactivate':
        return 'userManagement.bulk.deactivate.title';
      case 'changeRole':
        return 'userManagement.bulk.changeRole.title';
      default:
        return 'userManagement.bulk.action';
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case 'activate':
        return 'userManagement.bulk.activate.description';
      case 'deactivate':
        return 'userManagement.bulk.deactivate.description';
      case 'changeRole':
        return 'userManagement.bulk.changeRole.description';
      default:
        return 'userManagement.bulk.description';
    }
  };

  const handleConfirm = async () => {
    const actionData = action === 'changeRole' ? { role: newRole } : undefined;
    await onConfirm(action, actionData);
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

  const getRoleDisplayNameByCode = (roleCode: string) => {
    switch (roleCode) {
      case 'ADMIN':
        return 'Admin';
      case 'GIANG_VIEN':
        return 'Teacher';
      case 'HOC_VIEN':
        return 'Student';
      default:
        return roleCode;
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>
        <FontAwesomeIcon icon={getActionIcon()} className="me-2" />
        <Translate contentKey={getActionTitle()}>Bulk Action</Translate>
      </ModalHeader>
      <ModalBody>
        {!result && (
          <>
            <Alert color={getActionColor()} fade={false}>
              <h6>
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                <Translate contentKey="userManagement.bulk.confirmation">Confirmation Required</Translate>
              </h6>
              <p className="mb-0">
                <Translate contentKey={getActionDescription()} interpolate={{ count: selectedUsers.length }} />
              </p>
            </Alert>

            {action === 'changeRole' && (
              <Form>
                <FormGroup>
                  <Label for="newRole">
                    <Translate contentKey="userManagement.bulk.changeRole.newRole">New Role</Translate>
                  </Label>
                  <Input type="select" id="newRole" value={newRole} onChange={e => setNewRole(e.target.value)}>
                    <option value="HOC_VIEN">
                      <Translate contentKey="userManagement.role.student">Student</Translate>
                    </option>
                    <option value="GIANG_VIEN">
                      <Translate contentKey="userManagement.role.teacher">Teacher</Translate>
                    </option>
                    <option value="ADMIN">
                      <Translate contentKey="userManagement.role.admin">Admin</Translate>
                    </option>
                  </Input>
                </FormGroup>
              </Form>
            )}

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Table size="sm" striped>
                <thead>
                  <tr>
                    <th>
                      <Translate contentKey="userManagement.login">Username</Translate>
                    </th>
                    <th>
                      <Translate contentKey="userManagement.email">Email</Translate>
                    </th>
                    <th>
                      <Translate contentKey="userManagement.fullName">Full Name</Translate>
                    </th>
                    <th>
                      <Translate contentKey="userManagement.profiles">Current Role</Translate>
                    </th>
                    {action === 'changeRole' && (
                      <th>
                        <Translate contentKey="userManagement.bulk.changeRole.newRole">New Role</Translate>
                      </th>
                    )}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.login}</td>
                      <td>{user.email}</td>
                      <td>{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                      <td>
                        <Badge color={getRoleBadgeColor(user.authorities)}>{getRoleDisplayName(user.authorities)}</Badge>
                      </td>
                      {action === 'changeRole' && (
                        <td>
                          <Badge color={newRole === 'ADMIN' ? 'danger' : newRole === 'GIANG_VIEN' ? 'warning' : 'info'}>
                            {getRoleDisplayNameByCode(newRole)}
                          </Badge>
                        </td>
                      )}
                      <td>
                        <Badge color={user.activated ? 'success' : 'danger'}>{user.activated ? 'Active' : 'Inactive'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {loading && (
              <div className="mt-3">
                <Progress animated value={100} color="primary" />
                <p className="text-center mt-2">
                  <Translate contentKey="userManagement.bulk.processing">Processing bulk action...</Translate>
                </p>
              </div>
            )}
          </>
        )}

        {result && (
          <div>
            <Alert color={result.success > 0 ? 'success' : 'warning'} fade={false}>
              <h6>
                <FontAwesomeIcon icon={faCheck} className="me-2" />
                <Translate contentKey="userManagement.bulk.result.title">Bulk Action Results</Translate>
              </h6>
              <p className="mb-0">
                <Translate
                  contentKey="userManagement.bulk.result.summary"
                  interpolate={{
                    success: result.success,
                    total: result.total,
                    errors: result.errors?.length || 0,
                  }}
                >
                  Successfully processed {result.success} out of {result.total} users.
                  {result.errors?.length > 0 && ` ${result.errors.length} errors occurred.`}
                </Translate>
              </p>
            </Alert>

            {result.errors && result.errors.length > 0 && (
              <div>
                <h6 className="text-warning">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  <Translate contentKey="userManagement.bulk.result.errors">Errors</Translate>
                </h6>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <Table size="sm" striped>
                    <tbody>
                      {result.errors.map((error: string, index: number) => (
                        <tr key={index}>
                          <td className="text-danger">{error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {!result && (
          <>
            <Button color="secondary" onClick={onClose} disabled={loading}>
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button color={getActionColor()} onClick={handleConfirm} disabled={loading}>
              <FontAwesomeIcon icon={getActionIcon()} className="me-1" />
              <Translate contentKey="entity.action.confirm">Confirm</Translate>
            </Button>
          </>
        )}
        {result && (
          <Button color="primary" onClick={onClose}>
            <Translate contentKey="entity.action.close">Close</Translate>
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default BulkActionsModal;
