import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  AccessibilityProvider,
  AccessibilitySettings,
  useAccessibilityContext,
  LiveRegion,
  SkipLink,
  FocusTrap,
  Landmark,
} from '../index';
import { faEdit, faTrash, faPlus, faCog } from '@fortawesome/free-solid-svg-icons';

const AccessibilityDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [liveMessage, setLiveMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const { announce } = useAccessibilityContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      announce('Form submitted successfully!', 'polite');
      setLiveMessage('Form submitted successfully!');
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => setLiveMessage(''), 3000);
    } else {
      announce(`Form has ${Object.keys(newErrors).length} errors. Please review and correct.`, 'assertive');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDeleteClick = () => {
    announce('Delete confirmation dialog opened', 'polite');
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    announce('Item deleted successfully', 'polite');
    setLiveMessage('Item deleted successfully');
    setIsModalOpen(false);

    setTimeout(() => setLiveMessage(''), 3000);
  };

  return (
    <div className="accessibility-demo">
      {/* Skip Links */}
      <div className="skip-links">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <SkipLink href="#demo-form">Skip to demo form</SkipLink>
        <SkipLink href="#demo-table">Skip to demo table</SkipLink>
      </div>

      {/* Live Region for Announcements */}
      <LiveRegion message={liveMessage} priority="polite" />

      {/* Header */}
      <Landmark role="banner" label="Page header">
        <header className="demo-header">
          <h1 className="heading-level-1">Accessibility Demo</h1>
          <p>This demo showcases the comprehensive accessibility features of the Satori Design System.</p>

          <div className="demo-header__actions">
            <Button
              variant="outline"
              icon={faCog}
              onClick={() => setShowSettings(!showSettings)}
              aria-expanded={showSettings}
              aria-controls="accessibility-settings"
            >
              Accessibility Settings
            </Button>
          </div>
        </header>
      </Landmark>

      {/* Accessibility Settings Panel */}
      {showSettings && (
        <Card className="demo-settings" id="accessibility-settings">
          <CardHeader>
            <h2 className="heading-level-2">Accessibility Settings</h2>
          </CardHeader>
          <CardBody>
            <AccessibilitySettings />
          </CardBody>
        </Card>
      )}

      {/* Main Content */}
      <Landmark role="main" label="Main content" as="main">
        <main id="main-content" tabIndex={-1}>
          {/* Demo Form Section */}
          <section className="demo-section">
            <h2 className="heading-level-2">Accessible Form Demo</h2>
            <p>This form demonstrates proper labeling, error handling, and keyboard navigation.</p>

            <Card>
              <CardBody>
                <form id="demo-form" onSubmit={handleSubmit} noValidate>
                  <fieldset>
                    <legend>Contact Information</legend>

                    <div className="form-row">
                      <Input
                        id="demo-name"
                        label="Full Name"
                        value={formData.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        error={errors.name}
                        required
                        helperText="Enter your first and last name"
                        aria-describedby={errors.name ? 'demo-name-error' : 'demo-name-help'}
                      />
                    </div>

                    <div className="form-row">
                      <Input
                        id="demo-email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        required
                        helperText="We'll never share your email with anyone"
                        aria-describedby={errors.email ? 'demo-email-error' : 'demo-email-help'}
                      />
                    </div>

                    <div className="form-row">
                      <Textarea
                        id="demo-message"
                        label="Message"
                        value={formData.message}
                        onChange={e => handleInputChange('message', e.target.value)}
                        error={errors.message}
                        required
                        helperText="Tell us how we can help you"
                        rows={4}
                        aria-describedby={errors.message ? 'demo-message-error' : 'demo-message-help'}
                      />
                    </div>
                  </fieldset>

                  <div className="form-actions">
                    <Button type="submit" variant="primary">
                      Submit Form
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({ name: '', email: '', message: '' });
                        setErrors({});
                        announce('Form cleared', 'polite');
                      }}
                    >
                      Clear Form
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </section>

          {/* Demo Table Section */}
          <section className="demo-section">
            <h2 className="heading-level-2">Accessible Data Table Demo</h2>
            <p>This table demonstrates proper table structure, sorting, and row actions.</p>

            <Card>
              <CardBody>
                <table id="demo-table" className="table-accessible">
                  <caption>User Management Table - 3 users shown</caption>
                  <thead>
                    <tr>
                      <th scope="col" aria-sort="ascending">
                        Name
                        <span className="sr-only">(sorted ascending)</span>
                      </th>
                      <th scope="col" aria-sort="none">
                        Email
                      </th>
                      <th scope="col" aria-sort="none">
                        Role
                      </th>
                      <th scope="col">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>john.doe@example.com</td>
                      <td>
                        <span className="status-indicator status-success">Admin</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <IconButton
                            icon={faEdit}
                            variant="ghost"
                            size="sm"
                            aria-label="Edit John Doe"
                            onClick={() => announce('Edit dialog would open for John Doe', 'polite')}
                          />
                          <IconButton icon={faTrash} variant="ghost" size="sm" aria-label="Delete John Doe" onClick={handleDeleteClick} />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Jane Smith</td>
                      <td>jane.smith@example.com</td>
                      <td>
                        <span className="status-indicator status-warning">Teacher</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <IconButton
                            icon={faEdit}
                            variant="ghost"
                            size="sm"
                            aria-label="Edit Jane Smith"
                            onClick={() => announce('Edit dialog would open for Jane Smith', 'polite')}
                          />
                          <IconButton icon={faTrash} variant="ghost" size="sm" aria-label="Delete Jane Smith" onClick={handleDeleteClick} />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Bob Johnson</td>
                      <td>bob.johnson@example.com</td>
                      <td>
                        <span className="status-indicator">Student</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <IconButton
                            icon={faEdit}
                            variant="ghost"
                            size="sm"
                            aria-label="Edit Bob Johnson"
                            onClick={() => announce('Edit dialog would open for Bob Johnson', 'polite')}
                          />
                          <IconButton
                            icon={faTrash}
                            variant="ghost"
                            size="sm"
                            aria-label="Delete Bob Johnson"
                            onClick={handleDeleteClick}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
              <CardFooter>
                <Button variant="primary" icon={faPlus}>
                  Add New User
                </Button>
              </CardFooter>
            </Card>
          </section>

          {/* Keyboard Navigation Guide */}
          <section className="demo-section">
            <h2 className="heading-level-2">Keyboard Navigation Guide</h2>
            <Card>
              <CardBody>
                <div className="keyboard-guide">
                  <h3 className="heading-level-3">Available Keyboard Shortcuts</h3>
                  <dl className="keyboard-shortcuts">
                    <dt>
                      <kbd>Tab</kbd>
                    </dt>
                    <dd>Move to next focusable element</dd>

                    <dt>
                      <kbd>Shift</kbd> + <kbd>Tab</kbd>
                    </dt>
                    <dd>Move to previous focusable element</dd>

                    <dt>
                      <kbd>Enter</kbd> or <kbd>Space</kbd>
                    </dt>
                    <dd>Activate buttons and links</dd>

                    <dt>
                      <kbd>Escape</kbd>
                    </dt>
                    <dd>Close modals and dropdowns</dd>

                    <dt>
                      <kbd>Arrow Keys</kbd>
                    </dt>
                    <dd>Navigate within menus and tables</dd>
                  </dl>
                </div>
              </CardBody>
            </Card>
          </section>
        </main>
      </Landmark>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="sm"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <FocusTrap isActive={isModalOpen}>
          <ModalHeader id="delete-modal-title">
            <h2>Confirm Deletion</h2>
          </ModalHeader>
          <ModalBody id="delete-modal-description">
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter align="right">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} autoFocus>
              Delete User
            </Button>
          </ModalFooter>
        </FocusTrap>
      </Modal>
    </div>
  );
};

// Wrapper component with AccessibilityProvider
const AccessibilityDemoWithProvider: React.FC = () => {
  return (
    <AccessibilityProvider>
      <AccessibilityDemo />
    </AccessibilityProvider>
  );
};

export default AccessibilityDemoWithProvider;
