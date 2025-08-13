import React, { useState } from 'react';
import {
  faUser,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faBell,
  faHome,
  faUsers,
  faBook,
  faChartBar,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  IconButton,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Layout,
  PageHeader,
  SidebarItem,
} from '../components';

export const DesignSystemDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: faHome,
      active: true,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: faUsers,
      badge: '12',
      children: [
        {
          id: 'all-users',
          label: 'All Users',
        },
        {
          id: 'roles',
          label: 'Roles & Permissions',
        },
      ],
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: faBook,
      children: [
        {
          id: 'all-courses',
          label: 'All Courses',
        },
        {
          id: 'lessons',
          label: 'Lessons',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: faChartBar,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: faCog,
    },
  ];

  const headerProps = {
    title: 'Design System Demo',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Administrator',
    },
    notifications: [
      {
        id: '1',
        title: 'New User Registration',
        message: 'A new user has registered on the platform',
        timestamp: new Date(),
        read: false,
        type: 'info' as const,
      },
    ],
    userMenuActions: [
      {
        id: 'profile',
        label: 'Profile',
        icon: faUser,
        onClick() {
          // Handle profile click
        },
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: faCog,
        onClick() {
          // Handle settings click
        },
      },
      {
        id: 'logout',
        label: 'Logout',
        onClick() {
          // Handle logout click
        },
        divider: true,
      },
    ],
    showSearch: true,
    onSearch(query: string) {
      // Handle search query
      void query;
    },
  };

  return (
    <Layout
      sidebarItems={sidebarItems}
      headerProps={headerProps}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={setSidebarCollapsed}
      sidebarLogo={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: '#0ea5e9', borderRadius: '8px' }} />
          <span>Satori</span>
        </div>
      }
    >
      <PageHeader
        title="Design System Components"
        subtitle="Showcase of the modern UI components"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Design System', href: '/design-system' }, { label: 'Demo' }]}
        actions={
          <ButtonGroup>
            <Button variant="outline" icon={faEdit}>
              Edit
            </Button>
            <Button variant="primary" icon={faPlus}>
              Add New
            </Button>
          </ButtonGroup>
        }
      />

      <div className="satori-grid satori-grid--cols-2" style={{ marginBottom: '2rem' }}>
        {/* Buttons Demo */}
        <Card>
          <CardHeader>
            <h3>Buttons</h3>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button size="sm" variant="primary">
                  Small
                </Button>
                <Button size="md" variant="primary">
                  Medium
                </Button>
                <Button size="lg" variant="primary">
                  Large
                </Button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button icon={faUser} variant="primary">
                  With Icon
                </Button>
                <Button icon={faPlus} iconPosition="right" variant="outline">
                  Icon Right
                </Button>
                <Button loading variant="primary">
                  Loading
                </Button>
                <IconButton icon={faSearch} aria-label="Search" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Inputs Demo */}
        <Card>
          <CardHeader>
            <h3>Form Inputs</h3>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input label="Email" type="email" placeholder="Enter your email" leftIcon={faUser} />

              <Input label="Search" type="text" placeholder="Search..." leftIcon={faSearch} size="sm" />

              <Input label="Password" type="password" placeholder="Enter password" error="Password is required" />

              <Textarea label="Description" placeholder="Enter description..." rows={3} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Cards Demo */}
      <Card className="mb-6">
        <CardHeader>
          <h3>Card Variations</h3>
        </CardHeader>
        <CardBody>
          <div className="satori-grid satori-grid--cols-3">
            <Card shadow="sm" hover>
              <CardBody>
                <h4>Hover Card</h4>
                <p>This card has hover effects enabled.</p>
              </CardBody>
            </Card>

            <Card shadow="md" border={false}>
              <CardBody>
                <h4>No Border</h4>
                <p>This card has no border with medium shadow.</p>
              </CardBody>
            </Card>

            <Card shadow="lg" padding="lg">
              <CardBody>
                <h4>Large Padding</h4>
                <p>This card has large padding and shadow.</p>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>

      {/* Modal Demo */}
      <Card>
        <CardHeader>
          <h3>Modal Demo</h3>
        </CardHeader>
        <CardBody>
          <Button onClick={() => setShowModal(true)}>Open Modal</Button>
        </CardBody>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md" aria-labelledby="demo-modal-title">
        <ModalHeader id="demo-modal-title">
          <h3>Demo Modal</h3>
          <p>This is a demonstration of the modal component.</p>
        </ModalHeader>
        <ModalBody>
          <p>
            This modal demonstrates the design system&apos;s modal component with proper accessibility features, focus management, and
            responsive design.
          </p>
          <Input label="Sample Input" placeholder="Type something..." />
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </Layout>
  );
};
