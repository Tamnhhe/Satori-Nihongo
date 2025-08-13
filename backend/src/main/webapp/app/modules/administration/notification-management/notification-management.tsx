import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { Card } from 'app/shared/design-system/components/Card/Card';
import { Button } from 'app/shared/design-system/components/Button/Button';
import { Modal } from 'app/shared/design-system/components/Modal/Modal';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getTemplates,
  getSchedules,
  deleteTemplate,
  sendNotificationNow,
  cancelScheduledNotification,
} from './notification-management.reducer';
import './notification-management.scss';

const NotificationManagement = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'templates' | 'schedules'>('templates');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'send' | 'cancel' | null>(null);

  const { templates, schedules, loading, totalItems, updating } = useAppSelector(state => state.notificationManagement);

  useEffect(() => {
    dispatch(getTemplates({ page: 0, size: 20, sort: 'createdAt,desc' }));
    dispatch(getSchedules({ page: 0, size: 20, sort: 'createdAt,desc' }));
  }, [dispatch]);

  const handleDeleteTemplate = (id: number) => {
    setSelectedItemId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItemId) {
      dispatch(deleteTemplate(selectedItemId));
    }
    setDeleteModalOpen(false);
    setSelectedItemId(null);
  };

  const handleScheduleAction = (id: number, action: 'send' | 'cancel') => {
    setSelectedItemId(id);
    setActionType(action);
    setActionModalOpen(true);
  };

  const confirmScheduleAction = () => {
    if (selectedItemId && actionType) {
      if (actionType === 'send') {
        dispatch(sendNotificationNow(selectedItemId));
      } else if (actionType === 'cancel') {
        dispatch(cancelScheduledNotification(selectedItemId));
      }
    }
    setActionModalOpen(false);
    setSelectedItemId(null);
    setActionType(null);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      DRAFT: 'status-badge status-badge--draft',
      SCHEDULED: 'status-badge status-badge--scheduled',
      SENT: 'status-badge status-badge--sent',
      CANCELLED: 'status-badge status-badge--cancelled',
    };

    return (
      <span className={statusClasses[status] || 'status-badge'}>
        <Translate contentKey={`notificationManagement.status.${status.toLowerCase()}`}>{status}</Translate>
      </span>
    );
  };

  return (
    <div className="notification-management">
      <div className="notification-management__header">
        <h1>
          <Translate contentKey="notificationManagement.title">Notification Management</Translate>
        </h1>
        <p className="notification-management__description">
          <Translate contentKey="notificationManagement.description">
            Manage notification templates, schedule notifications, and track delivery status
          </Translate>
        </p>
      </div>

      <div className="notification-management__actions-bar">
        <div className="notification-management__tabs">
          <button
            className={`tab-button ${activeTab === 'templates' ? 'tab-button--active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <Translate contentKey="notificationManagement.tabs.templates">Templates</Translate>
          </button>
          <button
            className={`tab-button ${activeTab === 'schedules' ? 'tab-button--active' : ''}`}
            onClick={() => setActiveTab('schedules')}
          >
            <Translate contentKey="notificationManagement.tabs.schedules">Schedules</Translate>
          </button>
        </div>

        <div className="notification-management__quick-actions">
          <Button variant="outline" onClick={() => navigate('/admin/notifications/analytics')}>
            <Translate contentKey="notificationManagement.analytics">Analytics</Translate>
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/notifications/user-preferences')}>
            <Translate contentKey="notificationManagement.userPreferences">User Preferences</Translate>
          </Button>
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="notification-management__content">
          <div className="notification-management__actions">
            <Button variant="primary" onClick={() => navigate('/admin/notifications/templates')}>
              <Translate contentKey="notificationManagement.createTemplate">Create Template</Translate>
            </Button>
          </div>

          <div className="notification-management__grid">
            {templates.map(template => (
              <Card key={template.id} className="template-card">
                <div className="template-card__header">
                  <h3 className="template-card__title">{template.name}</h3>
                  <div className="template-card__type">
                    <Translate contentKey={`notificationManagement.type.${template.type?.toLowerCase()}`}>{template.type}</Translate>
                  </div>
                </div>

                <div className="template-card__content">
                  <p className="template-card__description">{template.description || template.emailSubject}</p>
                  <div className="template-card__meta">
                    <span className="template-card__locale">{template.locale?.toUpperCase()}</span>
                    <span className={`template-card__status ${template.isActive ? 'active' : 'inactive'}`}>
                      <Translate contentKey={`notificationManagement.${template.isActive ? 'active' : 'inactive'}`}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Translate>
                    </span>
                  </div>
                </div>

                <div className="template-card__actions">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/admin/notifications/templates/${template.id}`)}>
                    <Translate contentKey="entity.action.edit">Edit</Translate>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/admin/notifications/schedules?templateId=${template.id}`)}>
                    <Translate contentKey="notificationManagement.schedule">Schedule</Translate>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                    <Translate contentKey="entity.action.delete">Delete</Translate>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {templates.length === 0 && !loading && (
            <div className="notification-management__empty">
              <p>
                <Translate contentKey="notificationManagement.noTemplates">
                  No notification templates found. Create your first template to get started.
                </Translate>
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'schedules' && (
        <div className="notification-management__content">
          <div className="notification-management__actions">
            <Button variant="primary" onClick={() => navigate('/admin/notifications/schedules')}>
              <Translate contentKey="notificationManagement.createSchedule">Create Schedule</Translate>
            </Button>
          </div>

          <div className="notification-management__table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="notificationManagement.schedule.title">Title</Translate>
                  </th>
                  <th>
                    <Translate contentKey="notificationManagement.schedule.type">Type</Translate>
                  </th>
                  <th>
                    <Translate contentKey="notificationManagement.schedule.status">Status</Translate>
                  </th>
                  <th>
                    <Translate contentKey="notificationManagement.schedule.scheduledAt">Scheduled At</Translate>
                  </th>
                  <th>
                    <Translate contentKey="notificationManagement.schedule.recipients">Recipients</Translate>
                  </th>
                  <th>
                    <Translate contentKey="notificationManagement.schedule.actions">Actions</Translate>
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(schedule => (
                  <tr key={schedule.id}>
                    <td>
                      <Link to={`/admin/notifications/schedules/${schedule.id}`}>{schedule.title}</Link>
                    </td>
                    <td>
                      <Translate contentKey={`notificationManagement.type.${schedule.type?.toLowerCase()}`}>{schedule.type}</Translate>
                    </td>
                    <td>{getStatusBadge(schedule.status)}</td>
                    <td>
                      {schedule.scheduledAt ? (
                        new Date(schedule.scheduledAt).toLocaleString()
                      ) : (
                        <Translate contentKey="notificationManagement.immediate">Immediate</Translate>
                      )}
                    </td>
                    <td>{schedule.totalRecipients || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/notifications/schedules/${schedule.id}`)}>
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </Button>

                        {(schedule.status === 'DRAFT' || schedule.status === 'SCHEDULED') && (
                          <Button variant="outline" size="sm" onClick={() => handleScheduleAction(schedule.id, 'send')}>
                            <Translate contentKey="notificationManagement.send">Send</Translate>
                          </Button>
                        )}

                        {(schedule.status === 'DRAFT' || schedule.status === 'SCHEDULED') && (
                          <Button variant="outline" size="sm" onClick={() => handleScheduleAction(schedule.id, 'cancel')}>
                            <Translate contentKey="notificationManagement.cancel">Cancel</Translate>
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/notifications/schedules/${schedule.id}/deliveries`)}
                        >
                          <Translate contentKey="notificationManagement.viewDeliveries">View Deliveries</Translate>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {schedules.length === 0 && !loading && (
            <div className="notification-management__empty">
              <p>
                <Translate contentKey="notificationManagement.noSchedules">
                  No notification schedules found. Create your first schedule to get started.
                </Translate>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div>
          <h4>
            <Translate contentKey="notificationManagement.deleteTemplate">Delete Template</Translate>
          </h4>
          <p>
            <Translate contentKey="notificationManagement.deleteConfirm">Are you sure you want to delete this template?</Translate>
          </p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)} className="me-2">
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button variant="primary" onClick={confirmDelete} loading={updating}>
              <Translate contentKey="entity.action.delete">Delete</Translate>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal isOpen={actionModalOpen} onClose={() => setActionModalOpen(false)}>
        <div>
          <h4>
            <Translate contentKey={`notificationManagement.${actionType}Notification`}>
              {actionType === 'send' ? 'Send Notification' : 'Cancel Notification'}
            </Translate>
          </h4>
          <p>
            <Translate contentKey={`notificationManagement.${actionType}Confirm`}>
              Are you sure you want to {actionType} this notification?
            </Translate>
          </p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setActionModalOpen(false)} className="me-2">
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button variant="primary" onClick={confirmScheduleAction} loading={updating}>
              <Translate contentKey={`entity.action.${actionType}`}>{actionType}</Translate>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationManagement;
