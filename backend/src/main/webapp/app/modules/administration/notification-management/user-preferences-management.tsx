import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { Card } from 'app/shared/design-system/components/Card/Card';
import { Button } from 'app/shared/design-system/components/Button/Button';
import { Input } from 'app/shared/design-system/components/Input/Input';
import { Modal } from 'app/shared/design-system/components/Modal/Modal';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUserPreferences, updateUserPreferences } from './notification-analytics.reducer';
import './user-preferences-management.scss';

const UserPreferencesManagement = () => {
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    scheduleReminders: true,
    contentUpdates: true,
    quizReminders: true,
    courseAnnouncements: true,
    systemNotifications: true,
    frequency: 'IMMEDIATE', // IMMEDIATE, DAILY, WEEKLY
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  });

  const { userPreferences, loading, updating, updateSuccess } = useAppSelector(state => state.notificationAnalytics);

  useEffect(() => {
    dispatch(getUserPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      setPreferencesModalOpen(false);
      setSelectedUser(null);
      dispatch(getUserPreferences()); // Refresh the list
    }
  }, [updateSuccess, dispatch]);

  const handleEditPreferences = (user: any) => {
    setSelectedUser(user);
    setPreferences({
      emailEnabled: user.emailEnabled !== false,
      pushEnabled: user.pushEnabled !== false,
      inAppEnabled: user.inAppEnabled !== false,
      scheduleReminders: user.scheduleReminders !== false,
      contentUpdates: user.contentUpdates !== false,
      quizReminders: user.quizReminders !== false,
      courseAnnouncements: user.courseAnnouncements !== false,
      systemNotifications: user.systemNotifications !== false,
      frequency: user.frequency || 'IMMEDIATE',
      quietHours: user.quietHours || {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
      },
    });
    setPreferencesModalOpen(true);
  };

  const handleSavePreferences = () => {
    if (selectedUser) {
      dispatch(
        updateUserPreferences({
          userId: selectedUser.userId,
          ...preferences,
        }),
      );
    }
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuietHoursChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
  };

  const filteredPreferences = userPreferences.filter(
    pref =>
      pref.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || pref.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getPreferenceStatus = (pref: any) => {
    const enabledChannels = [pref.emailEnabled && 'Email', pref.pushEnabled && 'Push', pref.inAppEnabled && 'In-App'].filter(Boolean);

    return enabledChannels.length > 0 ? enabledChannels.join(', ') : 'None';
  };

  const getNotificationTypes = (pref: any) => {
    const enabledTypes = [
      pref.scheduleReminders && 'Schedule',
      pref.contentUpdates && 'Content',
      pref.quizReminders && 'Quiz',
      pref.courseAnnouncements && 'Announcements',
      pref.systemNotifications && 'System',
    ].filter(Boolean);

    return enabledTypes.length > 0 ? enabledTypes.join(', ') : 'None';
  };

  return (
    <div className="user-preferences-management">
      <div className="user-preferences-management__header">
        <div className="user-preferences-management__breadcrumb">
          <Link to="/admin/notifications">
            <Translate contentKey="notificationManagement.title">Notification Management</Translate>
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span>
            <Translate contentKey="notificationManagement.userPreferences">User Preferences</Translate>
          </span>
        </div>

        <h1>
          <Translate contentKey="notificationManagement.userPreferences">User Notification Preferences</Translate>
        </h1>

        <p className="user-preferences-management__description">
          <Translate contentKey="notificationManagement.userPreferencesDescription">
            Manage individual user notification preferences and settings
          </Translate>
        </p>
      </div>

      <Card>
        <div className="user-preferences-management__filters">
          <div className="filters-row">
            <div className="filter-group">
              <Input
                type="text"
                placeholder={translate('notificationManagement.searchUsers')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <Button variant="outline" onClick={() => dispatch(getUserPreferences())} loading={loading}>
              <Translate contentKey="notificationManagement.refresh">Refresh</Translate>
            </Button>
          </div>
        </div>

        <div className="user-preferences-management__table">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <Translate contentKey="notificationManagement.userPreferences.user">User</Translate>
                </th>
                <th>
                  <Translate contentKey="notificationManagement.userPreferences.channels">Channels</Translate>
                </th>
                <th>
                  <Translate contentKey="notificationManagement.userPreferences.types">Types</Translate>
                </th>
                <th>
                  <Translate contentKey="notificationManagement.userPreferences.frequency">Frequency</Translate>
                </th>
                <th>
                  <Translate contentKey="notificationManagement.userPreferences.quietHours">Quiet Hours</Translate>
                </th>
                <th>
                  <Translate contentKey="notificationManagement.userPreferences.actions">Actions</Translate>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPreferences.map(pref => (
                <tr key={pref.userId}>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{pref.userName}</div>
                      <div className="user-email">{pref.userEmail}</div>
                    </div>
                  </td>
                  <td>
                    <div className="preference-channels">{getPreferenceStatus(pref)}</div>
                  </td>
                  <td>
                    <div className="preference-types">{getNotificationTypes(pref)}</div>
                  </td>
                  <td>
                    <span className="frequency-badge">
                      <Translate contentKey={`notificationManagement.frequency.${pref.frequency?.toLowerCase() || 'immediate'}`}>
                        {pref.frequency || 'IMMEDIATE'}
                      </Translate>
                    </span>
                  </td>
                  <td>
                    {pref.quietHours?.enabled ? (
                      <span className="quiet-hours-enabled">
                        {pref.quietHours.startTime} - {pref.quietHours.endTime}
                      </span>
                    ) : (
                      <span className="quiet-hours-disabled">
                        <Translate contentKey="notificationManagement.userPreferences.disabled">Disabled</Translate>
                      </span>
                    )}
                  </td>
                  <td>
                    <Button variant="outline" size="sm" onClick={() => handleEditPreferences(pref)}>
                      <Translate contentKey="entity.action.edit">Edit</Translate>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPreferences.length === 0 && !loading && (
            <div className="user-preferences-management__empty">
              <p>
                <Translate contentKey="notificationManagement.noUserPreferences">No user preferences found.</Translate>
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* User Preferences Modal */}
      <Modal isOpen={preferencesModalOpen} onClose={() => setPreferencesModalOpen(false)} size="lg">
        {selectedUser && (
          <div className="preferences-form">
            <div className="user-header">
              <h4>
                <Translate contentKey="notificationManagement.editUserPreferences">Edit User Preferences</Translate>
              </h4>
              <h5>{selectedUser.userName}</h5>
              <p>{selectedUser.userEmail}</p>
            </div>

            <div className="preferences-section">
              <h5>
                <Translate contentKey="notificationManagement.userPreferences.channels">Delivery Channels</Translate>
              </h5>
              <div className="preferences-grid">
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.emailEnabled}
                    onChange={e => handlePreferenceChange('emailEnabled', e.target.checked)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.channel.email">Email</Translate>
                  </span>
                </label>
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.pushEnabled}
                    onChange={e => handlePreferenceChange('pushEnabled', e.target.checked)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.channel.push">Push</Translate>
                  </span>
                </label>
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.inAppEnabled}
                    onChange={e => handlePreferenceChange('inAppEnabled', e.target.checked)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.channel.inapp">In-App</Translate>
                  </span>
                </label>
              </div>
            </div>

            <div className="preferences-section">
              <h5>
                <Translate contentKey="notificationManagement.userPreferences.types">Notification Types</Translate>
              </h5>
              <div className="preferences-grid">
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.scheduleReminders}
                    onChange={e => handlePreferenceChange('scheduleReminders', e.target.checked)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.type.schedule_reminder">Schedule Reminders</Translate>
                  </span>
                </label>
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.contentUpdates}
                    onChange={e => handlePreferenceChange('contentUpdates', e.target.checked)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.type.content_update">Content Updates</Translate>
                  </span>
                </label>
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.quizReminders}
                    onChange={e => handlePreferenceChange('quizReminders', e.target.checked)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.type.quiz_reminder">Quiz Reminders</Translate>
                  </span>
                </label>
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.courseAnnouncements}
                    onChange={e => handlePreferenceChange('courseAnnouncements', e.target.checked)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.type.course_announcement">Course Announcements</Translate>
                  </span>
                </label>
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.systemNotifications}
                    onChange={e => handlePreferenceChange('systemNotifications', e.target.checked)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.type.system_notification">System Notifications</Translate>
                  </span>
                </label>
              </div>
            </div>

            <div className="preferences-section">
              <h5>
                <Translate contentKey="notificationManagement.userPreferences.frequency">Frequency</Translate>
              </h5>
              <div className="frequency-options">
                <label className="preference-item">
                  <input
                    type="radio"
                    name="frequency"
                    value="IMMEDIATE"
                    checked={preferences.frequency === 'IMMEDIATE'}
                    onChange={e => handlePreferenceChange('frequency', e.target.value)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.frequency.immediate">Immediate</Translate>
                  </span>
                </label>
                <label className="preference-item">
                  <input
                    type="radio"
                    name="frequency"
                    value="DAILY"
                    checked={preferences.frequency === 'DAILY'}
                    onChange={e => handlePreferenceChange('frequency', e.target.value)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.frequency.daily">Daily Digest</Translate>
                  </span>
                </label>
                <label className="preference-item">
                  <input
                    type="radio"
                    name="frequency"
                    value="WEEKLY"
                    checked={preferences.frequency === 'WEEKLY'}
                    onChange={e => handlePreferenceChange('frequency', e.target.value)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.frequency.weekly">Weekly Summary</Translate>
                  </span>
                </label>
              </div>
            </div>

            <div className="preferences-section">
              <h5>
                <Translate contentKey="notificationManagement.userPreferences.quietHours">Quiet Hours</Translate>
              </h5>
              <div className="quiet-hours-config">
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.quietHours.enabled}
                    onChange={e => handleQuietHoursChange('enabled', e.target.checked)}
                  />
                  <span>
                    <Translate contentKey="notificationManagement.userPreferences.enableQuietHours">Enable Quiet Hours</Translate>
                  </span>
                </label>

                {preferences.quietHours.enabled && (
                  <div className="quiet-hours-times">
                    <div className="time-input">
                      <label>
                        <Translate contentKey="notificationManagement.userPreferences.startTime">Start Time</Translate>
                      </label>
                      <input
                        type="time"
                        value={preferences.quietHours.startTime}
                        onChange={e => handleQuietHoursChange('startTime', e.target.value)}
                      />
                    </div>
                    <div className="time-input">
                      <label>
                        <Translate contentKey="notificationManagement.userPreferences.endTime">End Time</Translate>
                      </label>
                      <input
                        type="time"
                        value={preferences.quietHours.endTime}
                        onChange={e => handleQuietHoursChange('endTime', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <Button variant="outline" onClick={() => setPreferencesModalOpen(false)}>
                <Translate contentKey="entity.action.cancel">Cancel</Translate>
              </Button>
              <Button variant="primary" onClick={handleSavePreferences} loading={updating}>
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserPreferencesManagement;
