import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExcel, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { Translate } from 'react-jhipster';

export interface ICsvExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (params: any) => Promise<void>;
  loading: boolean;
  currentFilters: any;
}

export const CsvExportModal: React.FC<ICsvExportModalProps> = ({ isOpen, onClose, onExport, loading, currentFilters }) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [includeFilters, setIncludeFilters] = useState(true);
  const [selectedFields, setSelectedFields] = useState({
    username: true,
    email: true,
    fullName: true,
    role: true,
    status: true,
    createdDate: true,
    lastModifiedDate: false,
    socialAccounts: false,
  });

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleExport = async () => {
    const exportParams = {
      format: exportFormat,
      fields: Object.keys(selectedFields).filter(field => selectedFields[field]),
      filters: includeFilters ? currentFilters : {},
    };

    await onExport(exportParams);
  };

  const getSelectedFieldsCount = () => {
    return Object.values(selectedFields).filter(Boolean).length;
  };

  const hasActiveFilters = () => {
    return currentFilters && (currentFilters.search || currentFilters.role || currentFilters.status);
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>
        <Translate contentKey="userManagement.export.title">Export Users</Translate>
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>
                  <Translate contentKey="userManagement.export.format">Export Format</Translate>
                </Label>
                <div>
                  <FormGroup check inline>
                    <Input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={e => setExportFormat(e.target.value as 'csv')}
                    />
                    <Label check>
                      <FontAwesomeIcon icon={faFileCsv} className="me-1" />
                      CSV
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      type="radio"
                      name="format"
                      value="excel"
                      checked={exportFormat === 'excel'}
                      onChange={e => setExportFormat(e.target.value as 'excel')}
                    />
                    <Label check>
                      <FontAwesomeIcon icon={faFileExcel} className="me-1" />
                      Excel
                    </Label>
                  </FormGroup>
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>
                  <Translate contentKey="userManagement.export.filters">Apply Current Filters</Translate>
                </Label>
                <div>
                  <FormGroup check>
                    <Input type="checkbox" checked={includeFilters} onChange={e => setIncludeFilters(e.target.checked)} />
                    <Label check>
                      <Translate contentKey="userManagement.export.includeFilters">Include current search and filter criteria</Translate>
                    </Label>
                  </FormGroup>
                </div>
              </FormGroup>
            </Col>
          </Row>

          {hasActiveFilters() && includeFilters && (
            <Alert color="info" fade={false}>
              <h6>
                <Translate contentKey="userManagement.export.activeFilters">Active Filters</Translate>
              </h6>
              <ul className="mb-0">
                {currentFilters.search && (
                  <li>
                    <Translate contentKey="userManagement.export.searchFilter" interpolate={{ search: currentFilters.search }}>
                      Search: {currentFilters.search}
                    </Translate>
                  </li>
                )}
                {currentFilters.role && (
                  <li>
                    <Translate contentKey="userManagement.export.roleFilter" interpolate={{ role: currentFilters.role }}>
                      Role: {currentFilters.role}
                    </Translate>
                  </li>
                )}
                {currentFilters.status && (
                  <li>
                    <Translate contentKey="userManagement.export.statusFilter" interpolate={{ status: currentFilters.status }}>
                      Status: {currentFilters.status}
                    </Translate>
                  </li>
                )}
              </ul>
            </Alert>
          )}

          <FormGroup>
            <Label>
              <Translate contentKey="userManagement.export.fields">Fields to Export</Translate>
              <span className="text-muted ms-2">({getSelectedFieldsCount()} selected)</span>
            </Label>
            <Row>
              <Col md={6}>
                <FormGroup check>
                  <Input type="checkbox" checked={selectedFields.username} onChange={() => handleFieldToggle('username')} />
                  <Label check>
                    <Translate contentKey="userManagement.login">Username</Translate>
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" checked={selectedFields.email} onChange={() => handleFieldToggle('email')} />
                  <Label check>
                    <Translate contentKey="userManagement.email">Email</Translate>
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" checked={selectedFields.fullName} onChange={() => handleFieldToggle('fullName')} />
                  <Label check>
                    <Translate contentKey="userManagement.fullName">Full Name</Translate>
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" checked={selectedFields.role} onChange={() => handleFieldToggle('role')} />
                  <Label check>
                    <Translate contentKey="userManagement.profiles">Role</Translate>
                  </Label>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup check>
                  <Input type="checkbox" checked={selectedFields.status} onChange={() => handleFieldToggle('status')} />
                  <Label check>
                    <Translate contentKey="userManagement.activated">Status</Translate>
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" checked={selectedFields.createdDate} onChange={() => handleFieldToggle('createdDate')} />
                  <Label check>
                    <Translate contentKey="userManagement.createdDate">Created Date</Translate>
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" checked={selectedFields.lastModifiedDate} onChange={() => handleFieldToggle('lastModifiedDate')} />
                  <Label check>
                    <Translate contentKey="userManagement.lastModifiedDate">Last Modified</Translate>
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" checked={selectedFields.socialAccounts} onChange={() => handleFieldToggle('socialAccounts')} />
                  <Label check>
                    <Translate contentKey="userManagement.socialAccounts">Social Accounts</Translate>
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </FormGroup>

          {loading && (
            <div className="mt-3">
              <Progress animated value={100} color="primary" />
              <p className="text-center mt-2">
                <Translate contentKey="userManagement.export.preparing">Preparing export...</Translate>
              </p>
            </div>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose} disabled={loading}>
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button color="primary" onClick={handleExport} disabled={loading || getSelectedFieldsCount() === 0}>
          <FontAwesomeIcon icon={faDownload} className="me-1" />
          <Translate contentKey="userManagement.export.export">Export</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CsvExportModal;
