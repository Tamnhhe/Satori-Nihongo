import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { Card } from 'app/shared/design-system/components/Card/Card';
import { Button } from 'app/shared/design-system/components/Button/Button';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSchedule, createSchedule, updateSchedule, getTemplates, reset, resetUpdateSuccess } from './notification-management.reducer';
import './notification-scheduler.scss';

const NotificationScheduler = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isNew = !id;
  const preselectedTemplateId = searchParams.get('templateId');

  const {
    entity: schedule,
    templates,
    loading,
    updating,
    updateSuccess,
    errorMessage,
  } = useAppSelector(state => state.notificationManagement);

  useEffect(() => {
    dispatch(getTemplates({ page: 0, size: 100, sort: 'name,asc' }));

    if (!isNew) {
      dispatch(getSchedule(id));
    } else {
      dispatch(reset());
    }
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (updateSuccess) {
      navigate('/admin/notifications');
      dispatch(resetUpdateSuccess());
    }
  }, [updateSuccess, navigate, dispatch]);

  const saveEntity = (values: any) => {
    const entity = {
      ...schedule,
      ...values,
      scheduledAt: values.scheduledAt ? new Date(values.scheduledAt).toISOString() : null,
      recurringEndDate: values.recurringEndDate ? new Date(values.recurringEndDate).toISOString() : null,
      targetRoles: values.targetRoles
        ? values.targetRoles
            .split(',')
            .map(r => r.trim())
            .filter(r => r)
        : [],
      targetUserIds: values.targetUserIds
        ? values.targetUserIds
            .split(',')
            .map(userId => parseInt(userId.trim(), 10))
            .filter(userId => !isNaN(userId))
        : [],
      targetCourseIds: values.targetCourseIds
        ? values.targetCourseIds
            .split(',')
            .map(courseId => parseInt(courseId.trim(), 10))
            .filter(courseId => !isNaN(courseId))
        : [],
      targetClassIds: values.targetClassIds
        ? values.targetClassIds
            .split(',')
            .map(classId => parseInt(classId.trim(), 10))
            .filter(classId => !isNaN(classId))
        : [],
    };

    if (isNew) {
      dispatch(createSchedule(entity));
    } else {
      dispatch(updateSchedule(entity));
    }
  };

  const defaultValues = () => ({
    templateId: schedule?.templateId || preselectedTemplateId || '',
    title: schedule?.title || '',
    description: schedule?.description || '',
    type: schedule?.type || 'SYSTEM_NOTIFICATION',
    scheduledAt: schedule?.scheduledAt ? new Date(schedule.scheduledAt).toISOString().slice(0, 16) : '',
    timezone: schedule?.timezone || 'UTC',
    isRecurring: schedule?.isRecurring || false,
    recurringPattern: schedule?.recurringPattern || 'DAILY',
    recurringEndDate: schedule?.recurringEndDate ? new Date(schedule.recurringEndDate).toISOString().slice(0, 10) : '',
    targetRoles: schedule?.targetRoles?.join(', ') || '',
    targetUserIds: schedule?.targetUserIds?.join(', ') || '',
    targetCourseIds: schedule?.targetCourseIds?.join(', ') || '',
    targetClassIds: schedule?.targetClassIds?.join(', ') || '',
    emailEnabled: schedule?.emailEnabled !== false,
    pushEnabled: schedule?.pushEnabled !== false,
    inAppEnabled: schedule?.inAppEnabled !== false,
  });

  const notificationTypes = [
    'SCHEDULE_REMINDER',
    'CONTENT_UPDATE',
    'QUIZ_REMINDER',
    'ASSIGNMENT_DUE',
    'COURSE_ANNOUNCEMENT',
    'SYSTEM_NOTIFICATION',
  ];

  const recurringPatterns = ['DAILY', 'WEEKLY', 'MONTHLY'];

  const availableRoles = ['ROLE_ADMIN', 'ROLE_GIANG_VIEN', 'ROLE_HOC_VIEN'];

  const timezones = ['UTC', 'Asia/Ho_Chi_Minh', 'Asia/Tokyo', 'America/New_York', 'Europe/London'];

  return (
    <div className="notification-scheduler">
      <div className="notification-scheduler__header">
        <div className="notification-scheduler__breadcrumb">
          <Link to="/admin/notifications">
            <Translate contentKey="notificationManagement.title">Notification Management</Translate>
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span>
            {isNew ? (
              <Translate contentKey="notificationManagement.createSchedule">Create Schedule</Translate>
            ) : (
              <Translate contentKey="notificationManagement.editSchedule">Edit Schedule</Translate>
            )}
          </span>
        </div>

        <h1>
          {isNew ? (
            <Translate contentKey="notificationManagement.createSchedule">Create Schedule</Translate>
          ) : (
            <Translate contentKey="notificationManagement.editSchedule">Edit Schedule</Translate>
          )}
        </h1>
      </div>

      <Card>
        <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
          <div className="form-section">
            <h3>
              <Translate contentKey="notificationManagement.schedule.basicInfo">Basic Information</Translate>
            </h3>

            <div className="form-row">
              <ValidatedField
                name="templateId"
                label={translate('notificationManagement.schedule.template')}
                type="select"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              >
                <option value="">{translate('notificationManagement.schedule.selectTemplate')}</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({translate(`notificationManagement.type.${template.type?.toLowerCase()}`)})
                  </option>
                ))}
              </ValidatedField>

              <ValidatedField
                name="type"
                label={translate('notificationManagement.schedule.type')}
                type="select"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              >
                {notificationTypes.map(type => (
                  <option key={type} value={type}>
                    {translate(`notificationManagement.type.${type.toLowerCase()}`)}
                  </option>
                ))}
              </ValidatedField>
            </div>

            <ValidatedField
              name="title"
              label={translate('notificationManagement.schedule.title')}
              placeholder={translate('notificationManagement.schedule.titlePlaceholder')}
              type="text"
              validate={{
                required: { value: true, message: translate('entity.validation.required') },
                maxLength: { value: 200, message: translate('entity.validation.maxlength', { max: 200 }) },
              }}
            />

            <ValidatedField
              name="description"
              label={translate('notificationManagement.schedule.description')}
              placeholder={translate('notificationManagement.schedule.descriptionPlaceholder')}
              type="textarea"
              rows={3}
              validate={{
                maxLength: { value: 1000, message: translate('entity.validation.maxlength', { max: 1000 }) },
              }}
            />
          </div>

          <div className="form-section">
            <h3>
              <Translate contentKey="notificationManagement.schedule.timing">Timing & Scheduling</Translate>
            </h3>

            <div className="form-row">
              <ValidatedField name="scheduledAt" label={translate('notificationManagement.schedule.scheduledAt')} type="datetime-local" />

              <ValidatedField name="timezone" label={translate('notificationManagement.schedule.timezone')} type="select">
                {timezones.map(tz => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </ValidatedField>
            </div>

            <div className="form-field">
              <label className="form-label">
                <ValidatedField name="isRecurring" type="checkbox" />
                <Translate contentKey="notificationManagement.schedule.isRecurring">Recurring Notification</Translate>
              </label>
            </div>

            <div className="form-row">
              <ValidatedField name="recurringPattern" label={translate('notificationManagement.schedule.recurringPattern')} type="select">
                {recurringPatterns.map(pattern => (
                  <option key={pattern} value={pattern}>
                    {translate(`notificationManagement.recurringPattern.${pattern.toLowerCase()}`)}
                  </option>
                ))}
              </ValidatedField>

              <ValidatedField name="recurringEndDate" label={translate('notificationManagement.schedule.recurringEndDate')} type="date" />
            </div>
          </div>

          <div className="form-section">
            <h3>
              <Translate contentKey="notificationManagement.schedule.targeting">Targeting</Translate>
            </h3>

            <ValidatedField
              name="targetRoles"
              label={translate('notificationManagement.schedule.targetRoles')}
              placeholder={translate('notificationManagement.schedule.targetRolesPlaceholder')}
              type="text"
              help={translate('notificationManagement.schedule.targetRolesHelp')}
            />

            <ValidatedField
              name="targetUserIds"
              label={translate('notificationManagement.schedule.targetUserIds')}
              placeholder={translate('notificationManagement.schedule.targetUserIdsPlaceholder')}
              type="text"
              help={translate('notificationManagement.schedule.targetUserIdsHelp')}
            />

            <div className="form-row">
              <ValidatedField
                name="targetCourseIds"
                label={translate('notificationManagement.schedule.targetCourseIds')}
                placeholder={translate('notificationManagement.schedule.targetCourseIdsPlaceholder')}
                type="text"
                help={translate('notificationManagement.schedule.targetCourseIdsHelp')}
              />

              <ValidatedField
                name="targetClassIds"
                label={translate('notificationManagement.schedule.targetClassIds')}
                placeholder={translate('notificationManagement.schedule.targetClassIdsPlaceholder')}
                type="text"
                help={translate('notificationManagement.schedule.targetClassIdsHelp')}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>
              <Translate contentKey="notificationManagement.schedule.channels">Delivery Channels</Translate>
            </h3>

            <div className="channel-options">
              <div className="form-field">
                <label className="form-label">
                  <ValidatedField name="emailEnabled" type="checkbox" />
                  <Translate contentKey="notificationManagement.schedule.emailEnabled">Email Notifications</Translate>
                </label>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <ValidatedField name="pushEnabled" type="checkbox" />
                  <Translate contentKey="notificationManagement.schedule.pushEnabled">Push Notifications</Translate>
                </label>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <ValidatedField name="inAppEnabled" type="checkbox" />
                  <Translate contentKey="notificationManagement.schedule.inAppEnabled">In-App Notifications</Translate>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button variant="outline" onClick={() => navigate('/admin/notifications')} disabled={updating}>
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button type="submit" variant="primary" loading={updating}>
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
          </div>
        </ValidatedForm>
      </Card>
    </div>
  );
};

export default NotificationScheduler;
