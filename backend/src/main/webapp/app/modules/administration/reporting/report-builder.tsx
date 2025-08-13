import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Translate } from 'react-jhipster';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlay, faDownload, faClock } from '@fortawesome/free-solid-svg-icons';

import { generateReport, exportReport, scheduleReport, getReportTemplates, clearGeneratedReport } from './reporting.reducer';
import { IReportConfiguration, ReportType, ReportFormat, ScheduleFrequency } from 'app/shared/model/reporting.model';
import ReportPreview from './components/report-preview';
import ScheduleModal from './components/schedule-modal';

const ReportBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const { templates, generatedReport, loading, exportLoading, errorMessage } = useAppSelector(state => state.reporting);

  const [config, setConfig] = useState<IReportConfiguration>({
    name: '',
    description: '',
    reportType: ReportType.STUDENT_PROGRESS,
    format: ReportFormat.PDF,
    startDate: '',
    endDate: '',
    courseIds: [],
    classIds: [],
    studentIds: [],
    metrics: [],
    isScheduled: false,
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    dispatch(getReportTemplates());

    // Load template if specified in URL
    const templateType = searchParams.get('template');
    if (templateType && templates.length > 0) {
      const template = templates.find(t => t.reportType === templateType);
      if (template) {
        setConfig(prev => ({
          ...prev,
          ...template,
          name: '',
          description: template.description || '',
        }));
      }
    }
  }, [dispatch, searchParams, templates]);

  const handleInputChange = (field: keyof IReportConfiguration, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMetricsChange = (metric: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      metrics: checked ? [...(prev.metrics || []), metric] : (prev.metrics || []).filter(m => m !== metric),
    }));
  };

  const handleGenerateReport = async () => {
    if (!config.name.trim()) {
      return;
    }

    try {
      await dispatch(generateReport(config)).unwrap();
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleExportReport = async (format: ReportFormat) => {
    if (!generatedReport) return;

    try {
      const response = await dispatch(
        exportReport({
          report: generatedReport,
          format,
        }),
      ).unwrap();

      // Create download link
      const blob = new Blob([response as any], {
        type: 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${generatedReport.title}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const handleScheduleReport = async (scheduleConfig: any) => {
    try {
      const scheduledConfig = {
        ...config,
        isScheduled: true,
        schedule: scheduleConfig,
      };

      await dispatch(scheduleReport(scheduledConfig)).unwrap();
      setShowScheduleModal(false);
      navigate('/admin/reporting/scheduled');
    } catch (error) {
      console.error('Error scheduling report:', error);
    }
  };

  const getAvailableMetrics = () => {
    switch (config.reportType) {
      case ReportType.STUDENT_PROGRESS:
        return [
          { key: 'completion_rate', label: 'Completion Rate' },
          { key: 'gpa', label: 'GPA' },
          { key: 'quiz_scores', label: 'Quiz Scores' },
          { key: 'engagement', label: 'Engagement' },
        ];
      case ReportType.COURSE_ANALYTICS:
        return [
          { key: 'enrollment', label: 'Enrollment' },
          { key: 'completion', label: 'Completion' },
          { key: 'satisfaction', label: 'Satisfaction' },
          { key: 'difficulty', label: 'Difficulty' },
        ];
      case ReportType.QUIZ_PERFORMANCE:
        return [
          { key: 'average_score', label: 'Average Score' },
          { key: 'completion_rate', label: 'Completion Rate' },
          { key: 'question_difficulty', label: 'Question Difficulty' },
          { key: 'time_spent', label: 'Time Spent' },
        ];
      default:
        return [];
    }
  };

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <Button color="link" onClick={() => navigate('/admin/reporting')} className="p-0 me-3">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <h2>
              <Translate contentKey="reporting.builder.title">Report Builder</Translate>
            </h2>
          </div>
        </Col>
      </Row>

      {errorMessage && (
        <Row className="mb-3">
          <Col>
            <Alert color="danger">{errorMessage}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col md="8">
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                <Translate contentKey="reporting.builder.configuration">Report Configuration</Translate>
              </CardTitle>

              <Form>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="reportName">
                        <Translate contentKey="reporting.builder.name">Report Name</Translate> *
                      </Label>
                      <Input
                        type="text"
                        id="reportName"
                        value={config.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        placeholder="Enter report name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="reportType">
                        <Translate contentKey="reporting.builder.type">Report Type</Translate>
                      </Label>
                      <Input
                        type="select"
                        id="reportType"
                        value={config.reportType}
                        onChange={e => handleInputChange('reportType', e.target.value as ReportType)}
                      >
                        <option value={ReportType.STUDENT_PROGRESS}>Student Progress</option>
                        <option value={ReportType.COURSE_ANALYTICS}>Course Analytics</option>
                        <option value={ReportType.QUIZ_PERFORMANCE}>Quiz Performance</option>
                        <option value={ReportType.TEACHER_PERFORMANCE}>Teacher Performance</option>
                        <option value={ReportType.SYSTEM_OVERVIEW}>System Overview</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="description">
                    <Translate contentKey="reporting.builder.description">Description</Translate>
                  </Label>
                  <Input
                    type="textarea"
                    id="description"
                    value={config.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    placeholder="Enter report description"
                    rows={3}
                  />
                </FormGroup>

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="startDate">
                        <Translate contentKey="reporting.builder.startDate">Start Date</Translate>
                      </Label>
                      <Input
                        type="date"
                        id="startDate"
                        value={config.startDate}
                        onChange={e => handleInputChange('startDate', e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="endDate">
                        <Translate contentKey="reporting.builder.endDate">End Date</Translate>
                      </Label>
                      <Input type="date" id="endDate" value={config.endDate} onChange={e => handleInputChange('endDate', e.target.value)} />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="format">
                    <Translate contentKey="reporting.builder.format">Export Format</Translate>
                  </Label>
                  <Input
                    type="select"
                    id="format"
                    value={config.format}
                    onChange={e => handleInputChange('format', e.target.value as ReportFormat)}
                  >
                    <option value={ReportFormat.PDF}>PDF</option>
                    <option value={ReportFormat.EXCEL}>Excel</option>
                    <option value={ReportFormat.CSV}>CSV</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label>
                    <Translate contentKey="reporting.builder.metrics">Metrics to Include</Translate>
                  </Label>
                  <div>
                    {getAvailableMetrics().map(metric => (
                      <FormGroup check inline key={metric.key}>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={(config.metrics || []).includes(metric.key)}
                            onChange={e => handleMetricsChange(metric.key, e.target.checked)}
                          />
                          {metric.label}
                        </Label>
                      </FormGroup>
                    ))}
                  </div>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                <Translate contentKey="reporting.builder.actions">Actions</Translate>
              </CardTitle>

              <div className="d-grid gap-2">
                <Button color="primary" onClick={handleGenerateReport} disabled={loading || !config.name.trim()}>
                  {loading ? <Spinner size="sm" className="me-1" /> : <FontAwesomeIcon icon={faPlay} className="me-1" />}
                  <Translate contentKey="reporting.builder.generate">Generate Report</Translate>
                </Button>

                {generatedReport && (
                  <>
                    <Button color="success" onClick={() => handleExportReport(config.format)} disabled={exportLoading}>
                      {exportLoading ? <Spinner size="sm" className="me-1" /> : <FontAwesomeIcon icon={faDownload} className="me-1" />}
                      <Translate contentKey="reporting.builder.export">Export</Translate>
                    </Button>

                    <Button color="info" onClick={() => setShowScheduleModal(true)}>
                      <FontAwesomeIcon icon={faClock} className="me-1" />
                      <Translate contentKey="reporting.builder.schedule">Schedule</Translate>
                    </Button>
                  </>
                )}
              </div>

              {generatedReport && (
                <div className="mt-3">
                  <small className="text-muted">
                    <Translate contentKey="reporting.builder.generated">Report generated successfully</Translate>
                  </small>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Report Preview Modal */}
      <Modal isOpen={showPreview} toggle={() => setShowPreview(false)} size="xl">
        <ModalHeader toggle={() => setShowPreview(false)}>
          <Translate contentKey="reporting.builder.preview">Report Preview</Translate>
        </ModalHeader>
        <ModalBody>{generatedReport && <ReportPreview report={generatedReport} />}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowPreview(false)}>
            <Translate contentKey="entity.action.close">Close</Translate>
          </Button>
        </ModalFooter>
      </Modal>

      {/* Schedule Modal */}
      <ScheduleModal isOpen={showScheduleModal} toggle={() => setShowScheduleModal(false)} onSchedule={handleScheduleReport} />
    </div>
  );
};

export default ReportBuilder;
