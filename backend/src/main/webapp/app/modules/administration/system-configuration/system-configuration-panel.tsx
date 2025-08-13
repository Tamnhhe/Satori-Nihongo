import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faCog,
  faDownload,
  faExclamationTriangle,
  faSave,
  faShield,
  faToggleOff,
  faToggleOn,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getSystemConfiguration,
  updateSystemConfiguration,
  validateConfiguration,
  createConfigurationBackup,
  restoreConfigurationFromBackup,
  clearValidationErrors,
  clearUpdateSuccess,
  ISystemConfiguration,
  ISecurityConfiguration,
  IOAuth2Configuration,
  IFeatureToggle,
} from './system-configuration.reducer';
import { Button as DSButton } from 'app/shared/design-system/components/Button/Button';
import { Card as DSCard } from 'app/shared/design-system/components/Card/Card';
import { Input as DSInput } from 'app/shared/design-system/components/Input/Input';
import { Modal } from 'app/shared/design-system/components/Modal/Modal';

import './system-configuration-panel.scss';

const SystemConfigurationPanel = () => {
  const dispatch = useAppDispatch();
  const { configuration, loading, errorMessage, validationErrors, backupId, updateSuccess } = useAppSelector(
    state => state.systemConfiguration,
  );

  const [activeTab, setActiveTab] = useState('security');
  const [localConfiguration, setLocalConfiguration] = useState<ISystemConfiguration | null>(null);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [restoreBackupId, setRestoreBackupId] = useState('');

  useEffect(() => {
    dispatch(getSystemConfiguration());
  }, [dispatch]);

  useEffect(() => {
    if (configuration) {
      setLocalConfiguration({ ...configuration });
    }
  }, [configuration]);

  useEffect(() => {
    if (updateSuccess) {
      setTimeout(() => {
        dispatch(clearUpdateSuccess());
      }, 3000);
    }
  }, [updateSuccess, dispatch]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    dispatch(clearValidationErrors());
  };

  const handleSave = () => {
    if (localConfiguration) {
      dispatch(updateSystemConfiguration(localConfiguration));
    }
  };

  const handleValidate = () => {
    if (localConfiguration) {
      dispatch(validateConfiguration(localConfiguration));
    }
  };

  const handleBackup = () => {
    dispatch(createConfigurationBackup());
  };

  const handleRestore = () => {
    if (restoreBackupId.trim()) {
      dispatch(restoreConfigurationFromBackup(restoreBackupId));
      setShowBackupModal(false);
      setRestoreBackupId('');
    }
  };

  const updateSecurityConfig = (field: keyof ISecurityConfiguration, value: any) => {
    if (localConfiguration) {
      setLocalConfiguration({
        ...localConfiguration,
        security: {
          ...localConfiguration.security,
          [field]: value,
        },
      });
    }
  };

  const updateOAuth2Config = (field: keyof IOAuth2Configuration, value: any) => {
    if (localConfiguration) {
      setLocalConfiguration({
        ...localConfiguration,
        oauth2: {
          ...localConfiguration.oauth2,
          [field]: value,
        },
      });
    }
  };

  const updateOAuth2Provider = (providerId: string, field: string, value: any) => {
    if (localConfiguration) {
      setLocalConfiguration({
        ...localConfiguration,
        oauth2: {
          ...localConfiguration.oauth2,
          providers: {
            ...localConfiguration.oauth2.providers,
            [providerId]: {
              ...localConfiguration.oauth2.providers[providerId],
              [field]: value,
            },
          },
        },
      });
    }
  };

  const updateFeatureToggle = (toggleId: string, enabled: boolean) => {
    if (localConfiguration) {
      setLocalConfiguration({
        ...localConfiguration,
        featureToggles: {
          ...localConfiguration.featureToggles,
          [toggleId]: {
            ...localConfiguration.featureToggles[toggleId],
            enabled,
          },
        },
      });
    }
  };

  const updateSystemParameter = (paramId: string, value: string) => {
    if (localConfiguration) {
      setLocalConfiguration({
        ...localConfiguration,
        systemParameters: {
          ...localConfiguration.systemParameters,
          [paramId]: value,
        },
      });
    }
  };

  if (loading && !localConfiguration) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">
            <Translate contentKey="loading">Loading...</Translate>
          </span>
        </div>
      </div>
    );
  }

  if (!localConfiguration) {
    return (
      <Alert color="warning">
        <Translate contentKey="systemConfiguration.noData">No configuration data available</Translate>
      </Alert>
    );
  }

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="system-configuration-panel">
      <div className="configuration-header">
        <div>
          <h2>
            <FontAwesomeIcon icon={faCog} className="me-2" />
            <Translate contentKey="systemConfiguration.title">System Configuration</Translate>
          </h2>
          <p className="text-muted">
            <Translate contentKey="systemConfiguration.description">
              Manage system settings, security configurations, and feature toggles
            </Translate>
          </p>
        </div>
        <div className="header-actions">
          <DSButton variant="outline" onClick={handleValidate} disabled={loading}>
            <FontAwesomeIcon icon={faCheck} className="me-1" />
            <Translate contentKey="systemConfiguration.validate">Validate</Translate>
          </DSButton>
          <DSButton variant="outline" onClick={handleBackup} disabled={loading}>
            <FontAwesomeIcon icon={faDownload} className="me-1" />
            <Translate contentKey="systemConfiguration.backup">Backup</Translate>
          </DSButton>
          <DSButton variant="outline" onClick={() => setShowBackupModal(true)}>
            <FontAwesomeIcon icon={faUpload} className="me-1" />
            <Translate contentKey="systemConfiguration.restore">Restore</Translate>
          </DSButton>
        </div>
      </div>

      {errorMessage && (
        <Alert color="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {errorMessage}
        </Alert>
      )}

      {updateSuccess && (
        <Alert color="success">
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          <Translate contentKey="systemConfiguration.updateSuccess">Configuration updated successfully</Translate>
        </Alert>
      )}

      {hasValidationErrors && (
        <div className="validation-errors">
          <div className="error-title">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            <Translate contentKey="systemConfiguration.validationErrors">Validation Errors</Translate>
          </div>
          <ul className="error-list">
            {Object.entries(validationErrors).map(([field, error]: [string, string]) => (
              <li key={field} className="error-item">
                <strong>{field}:</strong> {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {backupId && (
        <Alert color="info">
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          <Translate contentKey="systemConfiguration.backupCreated">Backup created with ID:</Translate> {backupId}
        </Alert>
      )}

      <div className="configuration-tabs">
        <Nav tabs>
          <NavItem>
            <NavLink className={activeTab === 'security' ? 'active' : ''} onClick={() => handleTabChange('security')}>
              <FontAwesomeIcon icon={faShield} className="me-2" />
              <Translate contentKey="systemConfiguration.tabs.security">Security</Translate>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'oauth2' ? 'active' : ''} onClick={() => handleTabChange('oauth2')}>
              <FontAwesomeIcon icon={faCog} className="me-2" />
              <Translate contentKey="systemConfiguration.tabs.oauth2">OAuth2</Translate>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'features' ? 'active' : ''} onClick={() => handleTabChange('features')}>
              <FontAwesomeIcon icon={faToggleOn} className="me-2" />
              <Translate contentKey="systemConfiguration.tabs.features">Features</Translate>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'parameters' ? 'active' : ''} onClick={() => handleTabChange('parameters')}>
              <FontAwesomeIcon icon={faCog} className="me-2" />
              <Translate contentKey="systemConfiguration.tabs.parameters">Parameters</Translate>
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="security">
            <SecurityConfigurationTab config={localConfiguration.security} onUpdate={updateSecurityConfig} />
          </TabPane>
          <TabPane tabId="oauth2">
            <OAuth2ConfigurationTab
              config={localConfiguration.oauth2}
              onUpdate={updateOAuth2Config}
              onUpdateProvider={updateOAuth2Provider}
            />
          </TabPane>
          <TabPane tabId="features">
            <FeatureTogglesTab toggles={localConfiguration.featureToggles} onUpdate={updateFeatureToggle} />
          </TabPane>
          <TabPane tabId="parameters">
            <SystemParametersTab parameters={localConfiguration.systemParameters} onUpdate={updateSystemParameter} />
          </TabPane>
        </TabContent>
      </div>

      <div className="action-buttons">
        <DSButton variant="outline" onClick={() => dispatch(getSystemConfiguration())}>
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </DSButton>
        <DSButton variant="primary" onClick={handleSave} disabled={loading}>
          <FontAwesomeIcon icon={faSave} className="me-1" />
          <Translate contentKey="entity.action.save">Save</Translate>
        </DSButton>
      </div>

      {/* Backup/Restore Modal */}
      <Modal isOpen={showBackupModal} onClose={() => setShowBackupModal(false)}>
        <div className="p-3">
          <h4>
            <Translate contentKey="systemConfiguration.restore">Restore</Translate>
          </h4>
          <FormGroup>
            <Label for="backupId">
              <Translate contentKey="systemConfiguration.backupId">Backup ID</Translate>
            </Label>
            <DSInput
              id="backupId"
              value={restoreBackupId}
              onChange={e => setRestoreBackupId(e.target.value)}
              placeholder={translate('systemConfiguration.enterBackupId')}
            />
          </FormGroup>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <DSButton variant="outline" onClick={() => setShowBackupModal(false)}>
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </DSButton>
            <DSButton variant="primary" onClick={handleRestore} disabled={!restoreBackupId.trim()}>
              <Translate contentKey="systemConfiguration.restore">Restore</Translate>
            </DSButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Security Configuration Tab Component
const SecurityConfigurationTab = ({
  config,
  onUpdate,
}: {
  config: ISecurityConfiguration;
  onUpdate: (field: keyof ISecurityConfiguration, value: any) => void;
}) => (
  <div className="configuration-section">
    <div className="section-header">
      <h4>
        <Translate contentKey="systemConfiguration.security.title">Security Settings</Translate>
      </h4>
    </div>

    <DSCard>
      <div className="form-grid">
        <FormGroup>
          <Label for="csp">
            <Translate contentKey="systemConfiguration.security.csp">Content Security Policy</Translate>
          </Label>
          <DSInput
            id="csp"
            type="textarea"
            value={config.contentSecurityPolicy}
            onChange={e => onUpdate('contentSecurityPolicy', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="sessionTimeout">
            <Translate contentKey="systemConfiguration.security.sessionTimeout">Session Timeout (minutes)</Translate>
          </Label>
          <DSInput
            id="sessionTimeout"
            type="number"
            min="5"
            max="1440"
            value={config.sessionTimeoutMinutes}
            onChange={e => onUpdate('sessionTimeoutMinutes', parseInt(e.target.value, 10))}
          />
        </FormGroup>

        <FormGroup>
          <Label for="maxLoginAttempts">
            <Translate contentKey="systemConfiguration.security.maxLoginAttempts">Max Login Attempts</Translate>
          </Label>
          <DSInput
            id="maxLoginAttempts"
            type="number"
            min="1"
            max="10"
            value={config.maxLoginAttempts}
            onChange={e => onUpdate('maxLoginAttempts', parseInt(e.target.value, 10))}
          />
        </FormGroup>

        <FormGroup>
          <Label for="lockoutDuration">
            <Translate contentKey="systemConfiguration.security.lockoutDuration">Lockout Duration (minutes)</Translate>
          </Label>
          <DSInput
            id="lockoutDuration"
            type="number"
            min="1"
            value={config.lockoutDurationMinutes}
            onChange={e => onUpdate('lockoutDurationMinutes', parseInt(e.target.value, 10))}
          />
        </FormGroup>
      </div>

      <div className="form-row">
        <FormGroup check>
          <Input
            id="requireHttps"
            type="checkbox"
            checked={config.requireHttps}
            onChange={e => onUpdate('requireHttps', e.target.checked)}
          />
          <Label check for="requireHttps">
            <Translate contentKey="systemConfiguration.security.requireHttps">Require HTTPS</Translate>
          </Label>
        </FormGroup>

        <FormGroup check>
          <Input
            id="enableCsrf"
            type="checkbox"
            checked={config.enableCsrfProtection}
            onChange={e => onUpdate('enableCsrfProtection', e.target.checked)}
          />
          <Label check for="enableCsrf">
            <Translate contentKey="systemConfiguration.security.enableCsrf">Enable CSRF Protection</Translate>
          </Label>
        </FormGroup>
      </div>
    </DSCard>
  </div>
);

// OAuth2 Configuration Tab Component
const OAuth2ConfigurationTab = ({
  config,
  onUpdate,
  onUpdateProvider,
}: {
  config: IOAuth2Configuration;
  onUpdate: (field: keyof IOAuth2Configuration, value: any) => void;
  onUpdateProvider: (providerId: string, field: string, value: any) => void;
}) => (
  <div className="configuration-section">
    <div className="section-header">
      <h4>
        <Translate contentKey="systemConfiguration.oauth2.title">OAuth2 Settings</Translate>
      </h4>
    </div>

    <DSCard>
      <div className="form-row">
        <FormGroup check>
          <Input id="oauth2Enabled" type="checkbox" checked={config.enabled} onChange={e => onUpdate('enabled', e.target.checked)} />
          <Label check for="oauth2Enabled">
            <Translate contentKey="systemConfiguration.oauth2.enabled">Enable OAuth2</Translate>
          </Label>
        </FormGroup>
      </div>

      <FormGroup>
        <Label for="redirectBaseUrl">
          <Translate contentKey="systemConfiguration.oauth2.redirectBaseUrl">Redirect Base URL</Translate>
        </Label>
        <DSInput
          id="redirectBaseUrl"
          value={config.redirectBaseUrl || ''}
          onChange={e => onUpdate('redirectBaseUrl', e.target.value)}
          placeholder="https://your-domain.com"
        />
      </FormGroup>
    </DSCard>

    <div className="oauth2-providers">
      <h5>
        <Translate contentKey="systemConfiguration.oauth2.providers">OAuth2 Providers</Translate>
      </h5>
      {Object.entries(config.providers).map(([providerId, provider]) => (
        <div key={providerId} className={`provider-card ${!provider.enabled ? 'disabled' : ''}`}>
          <div className="provider-header">
            <div className="provider-name">{providerId}</div>
            <div className="provider-toggle">
              <Input type="checkbox" checked={provider.enabled} onChange={e => onUpdateProvider(providerId, 'enabled', e.target.checked)} />
            </div>
          </div>
          <div className="provider-fields">
            <FormGroup>
              <Label>
                <Translate contentKey="systemConfiguration.oauth2.clientId">Client ID</Translate>
              </Label>
              <DSInput
                value={provider.clientId}
                onChange={e => onUpdateProvider(providerId, 'clientId', e.target.value)}
                disabled={!provider.enabled}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <Translate contentKey="systemConfiguration.oauth2.clientSecret">Client Secret</Translate>
              </Label>
              <DSInput
                type="password"
                value={provider.clientSecret}
                onChange={e => onUpdateProvider(providerId, 'clientSecret', e.target.value)}
                disabled={!provider.enabled}
              />
            </FormGroup>
            <FormGroup className="full-width">
              <Label>
                <Translate contentKey="systemConfiguration.oauth2.scope">Scope</Translate>
              </Label>
              <DSInput
                value={provider.scope}
                onChange={e => onUpdateProvider(providerId, 'scope', e.target.value)}
                disabled={!provider.enabled}
                placeholder="openid,profile,email"
              />
            </FormGroup>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Feature Toggles Tab Component
const FeatureTogglesTab = ({
  toggles,
  onUpdate,
}: {
  toggles: Record<string, IFeatureToggle>;
  onUpdate: (toggleId: string, enabled: boolean) => void;
}) => {
  const groupedToggles = Object.entries(toggles).reduce(
    (acc, [id, toggle]) => {
      const category = toggle.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push({ id, ...toggle });
      return acc;
    },
    {} as Record<string, Array<{ id: string } & IFeatureToggle>>,
  );

  return (
    <div className="configuration-section">
      <div className="section-header">
        <h4>
          <Translate contentKey="systemConfiguration.features.title">Feature Toggles</Translate>
        </h4>
      </div>

      <div className="feature-toggles">
        {Object.entries(groupedToggles).map(([category, categoryToggles]) => (
          <div key={category}>
            <h5 className="mb-3">{category}</h5>
            <div className="toggles-grid">
              {categoryToggles.map(toggle => (
                <div key={toggle.id} className="toggle-card">
                  <div className="toggle-header">
                    <div className="toggle-info">
                      <div className="toggle-name">{toggle.name}</div>
                      <div className="toggle-description">{toggle.description}</div>
                    </div>
                    <div className="toggle-switch">
                      <Input type="checkbox" checked={toggle.enabled} onChange={e => onUpdate(toggle.id, e.target.checked)} />
                    </div>
                  </div>
                  <div className="toggle-category">{toggle.category}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// System Parameters Tab Component
const SystemParametersTab = ({
  parameters,
  onUpdate,
}: {
  parameters: Record<string, string>;
  onUpdate: (paramId: string, value: string) => void;
}) => (
  <div className="configuration-section">
    <div className="section-header">
      <h4>
        <Translate contentKey="systemConfiguration.parameters.title">System Parameters</Translate>
      </h4>
    </div>

    <DSCard>
      <div className="system-parameters">
        <div className="parameters-grid">
          {Object.entries(parameters).map(([paramId, value]) => (
            <div key={paramId} className="parameter-item">
              <Label className="parameter-label">{paramId.replace(/-/g, ' ')}</Label>
              <DSInput className="parameter-input" value={value} onChange={e => onUpdate(paramId, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
    </DSCard>
  </div>
);

export default SystemConfigurationPanel;
