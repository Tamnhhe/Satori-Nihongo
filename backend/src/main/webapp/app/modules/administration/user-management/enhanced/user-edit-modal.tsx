import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faTimes,
  faUser,
  faEnvelope,
  faUserTag,
  faToggleOn,
  faToggleOff,
  faUnlink,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons';

import { IUserProfile } from './user-management-table';

export interface UserEditModalProps {
  user: IUserProfile | null;
  isOpen: boolean;
  onSave: (user: IUserProfile) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  currentUserRole: string;
}

interface UserFormData {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  activated: boolean;
  langKey: string;
  authorities: string[];
  gender?: boolean;
  imageUrl?: string;
}

const AVAILABLE_ROLES = [
  { value: 'ADMIN', label: 'Admin', color: 'danger' },
  { value: 'GIANG_VIEN', label: 'Teacher', color: 'warning' },
  { value: 'HOC_VIEN', label: 'Student', color: 'info' },
];

const AVAILABLE_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'ja', label: '日本語' },
];

const SOCIAL_PROVIDERS = {
  GOOGLE: { icon: faGoogle as any, color: 'danger', name: 'Google' },
  FACEBOOK: { icon: faFacebook as any, color: 'primary', name: 'Facebook' },
  GITHUB: { icon: faGithub as any, color: 'dark', name: 'GitHub' },
};

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, isOpen, onSave, onClose, loading = false, currentUserRole }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<UserFormData>({
    defaultValues: {
      id: '',
      login: '',
      firstName: '',
      lastName: '',
      email: '',
      fullName: '',
      activated: true,
      langKey: 'en',
      authorities: [],
      gender: undefined,
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        id: user.id,
        login: user.login,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        activated: user.activated,
        langKey: user.langKey || 'en',
        authorities: user.authorities || [],
        gender: user.gender,
        imageUrl: user.imageUrl || '',
      });
      setSocialAccounts(user.socialAccounts || []);
    }
  }, [user, isOpen, reset]);

  const onSubmit = async (data: UserFormData) => {
    if (user) {
      const updatedUser: IUserProfile = {
        ...user,
        ...data,
        fullName: data.fullName || `${data.firstName} ${data.lastName}`.trim(),
      };
      await onSave(updatedUser);
    }
  };

  const handleClose = () => {
    reset();
    setSocialAccounts([]);
    setActiveTab('profile');
    onClose();
  };

  const canEditRole = () => {
    return currentUserRole === 'ADMIN';
  };

  const canEditActivation = () => {
    return currentUserRole === 'ADMIN' || (currentUserRole === 'GIANG_VIEN' && user?.authorities.includes('HOC_VIEN'));
  };

  const handleRoleToggle = (role: string) => {
    const currentAuthorities = watch('authorities');
    const newAuthorities = currentAuthorities.includes(role)
      ? currentAuthorities.filter(auth => auth !== role)
      : [...currentAuthorities.filter(auth => !AVAILABLE_ROLES.map(r => r.value).includes(auth)), role];

    setValue('authorities', newAuthorities, { shouldDirty: true });
  };

  const handleSocialAccountUnlink = (provider: string) => {
    // Implementation would call API to unlink social account
    setSocialAccounts(prev => prev.filter(account => account.provider !== provider));
  };

  const getRoleColor = (role: string) => {
    return AVAILABLE_ROLES.find(r => r.value === role)?.color || 'secondary';
  };

  const getRoleLabel = (role: string) => {
    return AVAILABLE_ROLES.find(r => r.value === role)?.label || role;
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg" backdrop="static">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={handleClose}>
          <FontAwesomeIcon icon={faUser} className="me-2" />
          <Translate contentKey="userManagement.home.createOrEditLabel">Create or edit a user</Translate>
          {user.id && <small className="text-muted ms-2">ID: {user.id}</small>}
        </ModalHeader>

        <ModalBody>
          {/* Tab Navigation */}
          <div className="nav nav-tabs mb-3">
            <button type="button" className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <FontAwesomeIcon icon={faUser} className="me-1" />
              Profile
            </button>
            <button type="button" className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>
              <FontAwesomeIcon icon={faUserTag} className="me-1" />
              Roles & Permissions
            </button>
            <button type="button" className={`nav-link ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}>
              <FontAwesomeIcon icon={faLink} className="me-1" />
              Social Accounts
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="login">
                      <Translate contentKey="userManagement.login">Login</Translate>
                      <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      name="login"
                      control={control}
                      rules={{ required: 'Login is required' }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          id="login"
                          invalid={!!errors.login}
                          disabled={!!user.id} // Disable editing login for existing users
                        />
                      )}
                    />
                    {errors.login && <div className="invalid-feedback d-block">{errors.login.message}</div>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">
                      <Translate contentKey="userManagement.email">Email</Translate>
                      <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      }}
                      render={({ field }) => <Input {...field} type="email" id="email" invalid={!!errors.email} />}
                    />
                    {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="firstName">
                      <Translate contentKey="userManagement.firstName">First Name</Translate>
                    </Label>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => <Input {...field} type="text" id="firstName" />}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="lastName">
                      <Translate contentKey="userManagement.lastName">Last Name</Translate>
                    </Label>
                    <Controller name="lastName" control={control} render={({ field }) => <Input {...field} type="text" id="lastName" />} />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="fullName">
                      <Translate contentKey="userManagement.fullName">Full Name</Translate>
                    </Label>
                    <Controller name="fullName" control={control} render={({ field }) => <Input {...field} type="text" id="fullName" />} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="langKey">
                      <Translate contentKey="userManagement.langKey">Language</Translate>
                    </Label>
                    <Controller
                      name="langKey"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="select" id="langKey">
                          {AVAILABLE_LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </Input>
                      )}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="gender">Gender</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="select"
                          id="gender"
                          value={field.value === undefined ? '' : field.value.toString()}
                          onChange={e => {
                            const value = e.target.value;
                            field.onChange(value === '' ? undefined : value === 'true');
                          }}
                        >
                          <option value="">Not specified</option>
                          <option value="true">Male</option>
                          <option value="false">Female</option>
                        </Input>
                      )}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  {canEditActivation() && (
                    <FormGroup>
                      <Label>
                        <Translate contentKey="userManagement.activated">Activated</Translate>
                      </Label>
                      <div>
                        <Controller
                          name="activated"
                          control={control}
                          render={({ field }) => (
                            <Button
                              type="button"
                              color={field.value ? 'success' : 'danger'}
                              onClick={() => field.onChange(!field.value)}
                              size="sm"
                            >
                              <FontAwesomeIcon icon={field.value ? faToggleOn : faToggleOff} className="me-1" />
                              {field.value ? 'Active' : 'Inactive'}
                            </Button>
                          )}
                        />
                      </div>
                    </FormGroup>
                  )}
                </Col>
              </Row>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div>
              <Card>
                <CardHeader>
                  <h5 className="mb-0">User Roles</h5>
                </CardHeader>
                <CardBody>
                  {canEditRole() ? (
                    <div>
                      <p className="text-muted mb-3">Select the roles for this user. Users can have multiple roles.</p>
                      {AVAILABLE_ROLES.map(role => (
                        <FormGroup key={role.value} check className="mb-2">
                          <Label check>
                            <Controller
                              name="authorities"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  type="checkbox"
                                  checked={field.value.includes(role.value)}
                                  onChange={() => handleRoleToggle(role.value)}
                                />
                              )}
                            />
                            <Badge color={role.color} className="ms-2">
                              {role.label}
                            </Badge>
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted mb-3">Current user roles (read-only):</p>
                      {watch('authorities').map(authority => (
                        <Badge key={authority} color={getRoleColor(authority)} className="me-2">
                          {getRoleLabel(authority)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          )}

          {/* Social Accounts Tab */}
          {activeTab === 'social' && (
            <div>
              <Card>
                <CardHeader>
                  <h5 className="mb-0">Linked Social Accounts</h5>
                </CardHeader>
                <CardBody>
                  {socialAccounts.length > 0 ? (
                    <ListGroup>
                      {socialAccounts.map((account, index) => {
                        const provider = SOCIAL_PROVIDERS[account.provider as keyof typeof SOCIAL_PROVIDERS];
                        return (
                          <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                            <div>
                              <FontAwesomeIcon icon={provider?.icon || faUser} className={`me-2 text-${provider?.color || 'secondary'}`} />
                              <strong>{provider?.name || account.provider}</strong>
                              <br />
                              <small className="text-muted">User ID: {account.providerUserId}</small>
                            </div>
                            {currentUserRole === 'ADMIN' && (
                              <Button color="outline-danger" size="sm" onClick={() => handleSocialAccountUnlink(account.provider)}>
                                <FontAwesomeIcon icon={faUnlink} className="me-1" />
                                Unlink
                              </Button>
                            )}
                          </ListGroupItem>
                        );
                      })}
                    </ListGroup>
                  ) : (
                    <Alert color="info" fade={false}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      No social accounts linked to this user.
                    </Alert>
                  )}
                </CardBody>
              </Card>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={handleClose} disabled={loading}>
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="primary" type="submit" disabled={loading || !isDirty}>
            <FontAwesomeIcon icon={faSave} className="me-1" />
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UserEditModal;
