import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getPaginationState } from 'react-jhipster';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

import UserManagementTable, { IUserProfile } from './user-management-table';
import UserEditModal from './user-edit-modal';
import CsvImportModal from './csv-import-modal';
import CsvExportModal from './csv-export-modal';
import BulkActionsModal from './bulk-actions-modal';
import {
  searchUsers,
  performBulkAction,
  exportUsers,
  importUsers,
  updateUserRole,
  updateUserStatus,
  getUserStatistics,
  setSearchParams,
  clearSelection,
  clearImportResult,
  reset,
} from './enhanced-user-management.reducer';

export const EnhancedUserManagement = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(location, ITEMS_PER_PAGE, 'id'), location.search),
  );

  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserProfile | null>(null);

  // Redux state
  const {
    users,
    totalItems,
    loading,
    updating,
    bulkActionLoading,
    exportLoading,
    importLoading,
    importResult,
    errorMessage,
    updateSuccess,
    searchParams,
    selectedUsers,
  } = useAppSelector(state => state.enhancedUserManagement);

  const account = useAppSelector(state => state.authentication.account);
  const currentUserRole = account?.authorities?.[0] || '';

  useEffect(() => {
    loadUsers();
    dispatch(getUserStatistics());
  }, [pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sortParam = params.get('sort');
    if (page && sortParam) {
      const sortSplit = sortParam.split(',');
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
      loadUsers();
    }
  }, [updateSuccess]);

  const loadUsers = () => {
    const params = {
      page: pagination.activePage - 1,
      size: pagination.itemsPerPage,
      sort: `${pagination.sort},${pagination.order}`,
      ...searchParams,
    };

    dispatch(searchUsers(params));
    dispatch(setSearchParams(params));

    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  const handlePaginationChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  const handleUserEdit = (user: IUserProfile) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUserSave = async (user: IUserProfile) => {
    try {
      // Convert IUserProfile to AdminUserDTO format for the API
      const userDTO = {
        id: user.id,
        login: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        activated: user.activated,
        langKey: user.langKey,
        authorities: user.authorities,
        imageUrl: user.imageUrl,
      };

      // Call the update user API
      await dispatch(updateUserRole({ userId: user.id, role: user.authorities[0] }));
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleUserDelete = (userId: string) => {
    navigate(`/admin/user-management/${userId}/delete`);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    dispatch(updateUserRole({ userId, role: newRole }));
  };

  const handleBulkAction = (action: string, userIds: string[]) => {
    if (action === 'export') {
      setShowExportModal(true);
    } else if (action === 'import') {
      setShowImportModal(true);
    } else if (action === 'activate' || action === 'deactivate' || action.startsWith('role:')) {
      setBulkAction(action);
      setShowBulkModal(true);
      setBulkResult(null);
    }
  };

  const handleBulkConfirm = async (action: string, data?: any) => {
    try {
      let bulkActionData;
      if (action === 'activate') {
        bulkActionData = { action: 'activate', userIds: selectedUsers };
      } else if (action === 'deactivate') {
        bulkActionData = { action: 'deactivate', userIds: selectedUsers };
      } else if (action === 'changeRole') {
        bulkActionData = { action: 'changeRole', userIds: selectedUsers, data };
      }

      if (bulkActionData) {
        const result = await dispatch(performBulkAction(bulkActionData)).unwrap();
        setBulkResult(result);
        dispatch(clearSelection());
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      setBulkResult({ success: 0, total: selectedUsers.length, errors: ['Action failed'] });
    }
  };

  const handleExport = async (params: any) => {
    try {
      await dispatch(exportUsers(params)).unwrap();
      setShowExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async (file: File) => {
    try {
      await dispatch(importUsers(file)).unwrap();
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const getSelectedUsersData = () => {
    return users.filter(user => selectedUsers.includes(user.id?.toString() || ''));
  };

  const handleRefresh = () => {
    dispatch(clearSelection());
    loadUsers();
  };

  const handleCreateUser = () => {
    navigate('/admin/user-management/new');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 id="enhanced-user-management-page-heading" data-cy="enhancedUserManagementPageHeading">
          <Translate contentKey="userManagement.home.title">Users</Translate>
        </h2>
        <div>
          <Button className="me-2" color="info" onClick={handleRefresh} disabled={loading}>
            <FontAwesomeIcon icon={faSync} spin={loading} />{' '}
            <Translate contentKey="userManagement.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Button color="primary" onClick={handleCreateUser}>
            <FontAwesomeIcon icon={faPlus} /> <Translate contentKey="userManagement.home.createLabel">Create a new user</Translate>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Alert color="danger" fade={false}>
          {errorMessage}
        </Alert>
      )}

      {importResult && (
        <Alert color={importResult.success ? 'success' : 'warning'} fade={false}>
          {importResult.success ? (
            <div>
              <strong>Import successful!</strong> {importResult.imported} users imported.
              {importResult.errors.length > 0 && (
                <div className="mt-2">
                  <strong>Errors:</strong>
                  <ul>
                    {importResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div>
              <strong>Import failed!</strong> Please check the file format and try again.
            </div>
          )}
          <Button color="link" size="sm" onClick={() => dispatch(clearImportResult())} className="p-0 ms-2">
            Dismiss
          </Button>
        </Alert>
      )}

      <UserManagementTable
        users={users as IUserProfile[]}
        totalItems={totalItems}
        loading={loading}
        onUserEdit={handleUserEdit}
        onUserDelete={handleUserDelete}
        onRoleChange={handleRoleChange}
        onBulkAction={handleBulkAction}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        currentUserRole={currentUserRole}
      />

      {/* User Edit Modal */}
      <UserEditModal
        user={editingUser}
        isOpen={showEditModal}
        onSave={handleUserSave}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        loading={updating}
        currentUserRole={currentUserRole}
      />

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        loading={importLoading}
        importResult={importResult}
        onClearResult={() => dispatch(clearImportResult())}
      />

      {/* CSV Export Modal */}
      <CsvExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        loading={exportLoading}
        currentFilters={searchParams}
      />

      {/* Bulk Actions Modal */}
      <BulkActionsModal
        isOpen={showBulkModal}
        onClose={() => {
          setShowBulkModal(false);
          setBulkResult(null);
        }}
        onConfirm={handleBulkConfirm}
        selectedUsers={getSelectedUsersData()}
        action={bulkAction}
        loading={bulkActionLoading}
        result={bulkResult}
      />
    </div>
  );
};

export default EnhancedUserManagement;
