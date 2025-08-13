import React, { useState, useRef } from 'react';
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
  Alert,
  Progress,
  Table,
  Badge,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Translate } from 'react-jhipster';

export interface ICsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<any>;
  loading: boolean;
  importResult: any;
  onClearResult: () => void;
}

export const CsvImportModal: React.FC<ICsvImportModalProps> = ({ isOpen, onClose, onImport, loading, importResult, onClearResult }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<any>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleImport = async () => {
    if (selectedFile) {
      await onImport(selectedFile);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClearResult();
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent =
      'username,email,fullName,role\nexample_user,user@example.com,John Doe,HOC_VIEN\nteacher1,teacher@example.com,Jane Smith,GIANG_VIEN';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="userManagement.import.title">Import Users from CSV</Translate>
      </ModalHeader>
      <ModalBody>
        {!importResult && (
          <>
            <Alert color="info" fade={false}>
              <h6>
                <Translate contentKey="userManagement.import.instructions.title">Import Instructions</Translate>
              </h6>
              <ul className="mb-0">
                <li>
                  <Translate contentKey="userManagement.import.instructions.format">
                    CSV file should contain columns: username, email, fullName, role
                  </Translate>
                </li>
                <li>
                  <Translate contentKey="userManagement.import.instructions.roles">Valid roles: ADMIN, GIANG_VIEN, HOC_VIEN</Translate>
                </li>
                <li>
                  <Translate contentKey="userManagement.import.instructions.duplicates">
                    Duplicate usernames or emails will be skipped
                  </Translate>
                </li>
              </ul>
            </Alert>

            <div className="mb-3">
              <Button color="link" onClick={downloadTemplate} size="sm">
                <FontAwesomeIcon icon={faDownload} className="me-1" />
                <Translate contentKey="userManagement.import.downloadTemplate">Download Template</Translate>
              </Button>
            </div>

            <Form>
              <FormGroup>
                <Label for="csvFile">
                  <Translate contentKey="userManagement.import.selectFile">Select CSV File</Translate>
                </Label>
                <div
                  className={`border rounded p-4 text-center ${dragOver ? 'border-primary bg-light' : 'border-secondary'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{ cursor: 'pointer' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FontAwesomeIcon icon={faUpload} size="2x" className="text-muted mb-2" />
                  <p className="mb-0">
                    {selectedFile ? (
                      <span className="text-success">
                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                        {selectedFile.name}
                      </span>
                    ) : (
                      <Translate contentKey="userManagement.import.dragDrop">
                        Drag and drop your CSV file here, or click to select
                      </Translate>
                    )}
                  </p>
                </div>
                <Input
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </FormGroup>
            </Form>

            {loading && (
              <div className="mt-3">
                <Progress animated value={100} color="primary" />
                <p className="text-center mt-2">
                  <Translate contentKey="userManagement.import.processing">Processing import...</Translate>
                </p>
              </div>
            )}
          </>
        )}

        {importResult && (
          <div>
            <Alert color={importResult.success ? 'success' : 'warning'}>
              <h6>
                <FontAwesomeIcon icon={importResult.success ? faCheck : faExclamationTriangle} className="me-2" />
                <Translate contentKey="userManagement.import.result.title">Import Results</Translate>
              </h6>
              <p className="mb-0">
                <Translate contentKey="userManagement.import.result.imported" interpolate={{ count: importResult.imported }}>
                  Successfully imported {importResult.imported} users
                </Translate>
              </p>
            </Alert>

            {importResult.errors && importResult.errors.length > 0 && (
              <div>
                <h6 className="text-warning">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  <Translate contentKey="userManagement.import.result.errors">Errors ({importResult.errors.length})</Translate>
                </h6>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <Table size="sm" striped>
                    <tbody>
                      {importResult.errors.map((error: string, index: number) => (
                        <tr key={index}>
                          <td className="text-danger">{error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {!importResult && (
          <>
            <Button color="secondary" onClick={handleClose}>
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button color="primary" onClick={handleImport} disabled={!selectedFile || loading}>
              <FontAwesomeIcon icon={faUpload} className="me-1" />
              <Translate contentKey="userManagement.import.import">Import</Translate>
            </Button>
          </>
        )}
        {importResult && (
          <Button color="primary" onClick={handleClose}>
            <Translate contentKey="entity.action.close">Close</Translate>
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default CsvImportModal;
