import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { Card } from 'app/shared/design-system/components/Card/Card';
import { Button } from 'app/shared/design-system/components/Button/Button';
import { Input } from 'app/shared/design-system/components/Input/Input';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getTemplate, createTemplate, updateTemplate, reset, resetUpdateSuccess } from './notification-management.reducer';
import './notification-template-editor.scss';

const NotificationTemplateEditor = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = !id;

  const [activeTab, setActiveTab] = useState<'email' | 'push' | 'inapp'>('email');
  const [previewMode, setPreviewMode] = useState(false);

  const { entity: template, loading, updating, updateSuccess, errorMessage } = useAppSelector(state => state.notificationManagement);

  useEffect(() => {
    if (!isNew) {
      dispatch(getTemplate(id));
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
      ...template,
      ...values,
      isActive: values.isActive !== false,
    };

    if (isNew) {
      dispatch(createTemplate(entity));
    } else {
      dispatch(updateTemplate(entity));
    }
  };

  const defaultValues = () => ({
    name: template?.name || '',
    type: template?.type || 'SYSTEM_NOTIFICATION',
    description: template?.description || '',
    emailSubject: template?.emailSubject || '',
    emailContent: template?.emailContent || '',
    pushTitle: template?.pushTitle || '',
    pushMessage: template?.pushMessage || '',
    inAppTitle: template?.inAppTitle || '',
    inAppMessage: template?.inAppMessage || '',
    locale: template?.locale || 'en',
    isActive: template?.isActive !== false,
  });

  const notificationTypes = [
    'SCHEDULE_REMINDER',
    'CONTENT_UPDATE',
    'QUIZ_REMINDER',
    'ASSIGNMENT_DUE',
    'COURSE_ANNOUNCEMENT',
    'SYSTEM_NOTIFICATION',
  ];

  const availableVariables = [
    '{{user.fullName}}',
    '{{user.username}}',
    '{{course.title}}',
    '{{lesson.title}}',
    '{{quiz.title}}',
    '{{schedule.date}}',
    '{{schedule.startTime}}',
    '{{hoursUntilDue}}',
    '{{announcement}}',
  ];

  const insertVariable = (variable: string, field: string) => {
    const textarea = document.querySelector(`textarea[name="${field}"]`);
    if (textarea && textarea instanceof HTMLTextAreaElement) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      textarea.value = before + variable + after;
      textarea.selectionStart = textarea.selectionEnd = start + variable.length;
      textarea.focus();

      // Trigger change event
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }
  };

  const renderPreview = (content: string, variables: Record<string, string> = {}) => {
    let preview = content;
    Object.entries(variables).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return preview;
  };

  const sampleVariables = {
    'user.fullName': 'John Doe',
    'user.username': 'johndoe',
    'course.title': 'Japanese Basics',
    'lesson.title': 'Hiragana Introduction',
    'quiz.title': 'Hiragana Quiz',
    'schedule.date': '2024-01-15',
    'schedule.startTime': '10:00 AM',
    hoursUntilDue: '2',
    announcement: 'New lesson materials are now available!',
  };

  return (
    <div className="notification-template-editor">
      <div className="notification-template-editor__header">
        <div className="notification-template-editor__breadcrumb">
          <Link to="/admin/notifications">
            <Translate contentKey="notificationManagement.title">Notification Management</Translate>
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span>
            {isNew ? (
              <Translate contentKey="notificationManagement.createTemplate">Create Template</Translate>
            ) : (
              <Translate contentKey="notificationManagement.editTemplate">Edit Template</Translate>
            )}
          </span>
        </div>

        <h1>
          {isNew ? (
            <Translate contentKey="notificationManagement.createTemplate">Create Template</Translate>
          ) : (
            <Translate contentKey="notificationManagement.editTemplate">Edit Template</Translate>
          )}
        </h1>
      </div>

      <div className="notification-template-editor__content">
        <div className="notification-template-editor__main">
          <Card>
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              <div className="form-section">
                <h3>
                  <Translate contentKey="notificationManagement.template.basicInfo">Basic Information</Translate>
                </h3>

                <div className="form-row">
                  <ValidatedField
                    name="name"
                    label={translate('notificationManagement.template.name')}
                    placeholder={translate('notificationManagement.template.namePlaceholder')}
                    type="text"
                    validate={{
                      required: { value: true, message: translate('entity.validation.required') },
                      maxLength: { value: 100, message: translate('entity.validation.maxlength', { max: 100 }) },
                    }}
                  />

                  <ValidatedField
                    name="type"
                    label={translate('notificationManagement.template.type')}
                    type="select"
                    validate={{
                      required: { value: true, message: translate('entity.validation.required') },
                    }}
                  >
                    <option value="">{translate('notificationManagement.template.selectType')}</option>
                    {notificationTypes.map(type => (
                      <option key={type} value={type}>
                        {translate(`notificationManagement.type.${type.toLowerCase()}`)}
                      </option>
                    ))}
                  </ValidatedField>
                </div>

                <ValidatedField
                  name="description"
                  label={translate('notificationManagement.template.description')}
                  placeholder={translate('notificationManagement.template.descriptionPlaceholder')}
                  type="textarea"
                  rows={3}
                  validate={{
                    maxLength: { value: 500, message: translate('entity.validation.maxlength', { max: 500 }) },
                  }}
                />

                <div className="form-row">
                  <ValidatedField name="locale" label={translate('notificationManagement.template.locale')} type="select">
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                    <option value="ja">日本語</option>
                  </ValidatedField>

                  <div className="form-field">
                    <label className="form-label">
                      <ValidatedField name="isActive" type="checkbox" />
                      <Translate contentKey="notificationManagement.template.isActive">Active</Translate>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="content-tabs">
                  <div className="content-tabs__header">
                    <h3>
                      <Translate contentKey="notificationManagement.template.content">Content</Translate>
                    </h3>
                    <div className="content-tabs__controls">
                      <button
                        type="button"
                        className={`tab-button ${previewMode ? '' : 'tab-button--active'}`}
                        onClick={() => setPreviewMode(false)}
                      >
                        <Translate contentKey="notificationManagement.template.edit">Edit</Translate>
                      </button>
                      <button
                        type="button"
                        className={`tab-button ${previewMode ? 'tab-button--active' : ''}`}
                        onClick={() => setPreviewMode(true)}
                      >
                        <Translate contentKey="notificationManagement.template.preview">Preview</Translate>
                      </button>
                    </div>
                  </div>

                  <div className="content-tabs__nav">
                    <button
                      type="button"
                      className={`tab-button ${activeTab === 'email' ? 'tab-button--active' : ''}`}
                      onClick={() => setActiveTab('email')}
                    >
                      <Translate contentKey="notificationManagement.template.email">Email</Translate>
                    </button>
                    <button
                      type="button"
                      className={`tab-button ${activeTab === 'push' ? 'tab-button--active' : ''}`}
                      onClick={() => setActiveTab('push')}
                    >
                      <Translate contentKey="notificationManagement.template.push">Push</Translate>
                    </button>
                    <button
                      type="button"
                      className={`tab-button ${activeTab === 'inapp' ? 'tab-button--active' : ''}`}
                      onClick={() => setActiveTab('inapp')}
                    >
                      <Translate contentKey="notificationManagement.template.inApp">In-App</Translate>
                    </button>
                  </div>

                  <div className="content-tabs__content">
                    {activeTab === 'email' && (
                      <div className="content-tab">
                        {!previewMode ? (
                          <>
                            <ValidatedField
                              name="emailSubject"
                              label={translate('notificationManagement.template.emailSubject')}
                              placeholder={translate('notificationManagement.template.emailSubjectPlaceholder')}
                              type="text"
                              validate={{
                                required: { value: true, message: translate('entity.validation.required') },
                                maxLength: { value: 500, message: translate('entity.validation.maxlength', { max: 500 }) },
                              }}
                            />
                            <ValidatedField
                              name="emailContent"
                              label={translate('notificationManagement.template.emailContent')}
                              placeholder={translate('notificationManagement.template.emailContentPlaceholder')}
                              type="textarea"
                              rows={10}
                              validate={{
                                required: { value: true, message: translate('entity.validation.required') },
                              }}
                            />
                          </>
                        ) : (
                          <div className="content-preview">
                            <div className="preview-section">
                              <h4>Subject:</h4>
                              <p>{renderPreview(template?.emailSubject || '', sampleVariables)}</p>
                            </div>
                            <div className="preview-section">
                              <h4>Content:</h4>
                              <div className="preview-content">
                                {renderPreview(template?.emailContent || '', sampleVariables)
                                  .split('\n')
                                  .map((line, index) => (
                                    <p key={index}>{line}</p>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'push' && (
                      <div className="content-tab">
                        {!previewMode ? (
                          <>
                            <ValidatedField
                              name="pushTitle"
                              label={translate('notificationManagement.template.pushTitle')}
                              placeholder={translate('notificationManagement.template.pushTitlePlaceholder')}
                              type="text"
                              validate={{
                                maxLength: { value: 200, message: translate('entity.validation.maxlength', { max: 200 }) },
                              }}
                            />
                            <ValidatedField
                              name="pushMessage"
                              label={translate('notificationManagement.template.pushMessage')}
                              placeholder={translate('notificationManagement.template.pushMessagePlaceholder')}
                              type="textarea"
                              rows={4}
                              validate={{
                                maxLength: { value: 500, message: translate('entity.validation.maxlength', { max: 500 }) },
                              }}
                            />
                          </>
                        ) : (
                          <div className="content-preview">
                            <div className="push-preview">
                              <div className="push-notification">
                                <div className="push-title">{renderPreview(template?.pushTitle || '', sampleVariables)}</div>
                                <div className="push-message">{renderPreview(template?.pushMessage || '', sampleVariables)}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'inapp' && (
                      <div className="content-tab">
                        {!previewMode ? (
                          <>
                            <ValidatedField
                              name="inAppTitle"
                              label={translate('notificationManagement.template.inAppTitle')}
                              placeholder={translate('notificationManagement.template.inAppTitlePlaceholder')}
                              type="text"
                              validate={{
                                maxLength: { value: 200, message: translate('entity.validation.maxlength', { max: 200 }) },
                              }}
                            />
                            <ValidatedField
                              name="inAppMessage"
                              label={translate('notificationManagement.template.inAppMessage')}
                              placeholder={translate('notificationManagement.template.inAppMessagePlaceholder')}
                              type="textarea"
                              rows={4}
                              validate={{
                                maxLength: { value: 500, message: translate('entity.validation.maxlength', { max: 500 }) },
                              }}
                            />
                          </>
                        ) : (
                          <div className="content-preview">
                            <div className="inapp-preview">
                              <div className="inapp-notification">
                                <div className="inapp-title">{renderPreview(template?.inAppTitle || '', sampleVariables)}</div>
                                <div className="inapp-message">{renderPreview(template?.inAppMessage || '', sampleVariables)}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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

        <div className="notification-template-editor__sidebar">
          <Card>
            <h4>
              <Translate contentKey="notificationManagement.template.variables">Available Variables</Translate>
            </h4>
            <p className="variables-help">
              <Translate contentKey="notificationManagement.template.variablesHelp">
                Click on a variable to insert it at the cursor position
              </Translate>
            </p>
            <div className="variables-list">
              {availableVariables.map(variable => (
                <button
                  key={variable}
                  type="button"
                  className="variable-button"
                  onClick={() => {
                    const currentField =
                      activeTab === 'email'
                        ? document.activeElement?.getAttribute('name')?.includes('email')
                          ? document.activeElement?.getAttribute('name')
                          : 'emailContent'
                        : activeTab === 'push'
                          ? document.activeElement?.getAttribute('name')?.includes('push')
                            ? document.activeElement?.getAttribute('name')
                            : 'pushMessage'
                          : document.activeElement?.getAttribute('name')?.includes('inApp')
                            ? document.activeElement?.getAttribute('name')
                            : 'inAppMessage';
                    insertVariable(variable, currentField);
                  }}
                >
                  {variable}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationTemplateEditor;
