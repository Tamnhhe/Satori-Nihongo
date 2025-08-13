import React, { useState } from 'react';
import { Translate } from 'react-jhipster';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Row, Col, Alert, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilePdf, faFileExcel, faFileImage } from '@fortawesome/free-solid-svg-icons';

import { ComprehensiveAnalyticsData, TimeRange } from 'app/shared/services/comprehensive-analytics.service';

interface AnalyticsExportModalProps {
  isOpen: boolean;
  toggle: () => void;
  analyticsData: ComprehensiveAnalyticsData;
  timeRange: TimeRange;
  isTeacherView: boolean;
}

const AnalyticsExportModal: React.FC<AnalyticsExportModalProps> = ({ isOpen, toggle, analyticsData, timeRange, isTeacherView }) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'png'>('pdf');
  const [exportSections, setExportSections] = useState({
    coursePerformance: true,
    studentEngagement: true,
    learningPath: true,
    comparative: true,
  });
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleSectionChange = (section: keyof typeof exportSections) => {
    setExportSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleExport = () => {
    try {
      setExporting(true);
      setExportError(null);

      // Prepare export data
      const exportData = {
        format: exportFormat,
        sections: exportSections,
        includeCharts,
        includeRawData,
        timeRange,
        isTeacherView,
        analyticsData,
        generatedAt: new Date().toISOString(),
      };

      // Create filename
      const timestamp = new Date().toISOString().split('T')[0];
      const viewType = isTeacherView ? 'teacher' : 'admin';
      const filename = `analytics-${viewType}-${timeRange}-${timestamp}`;

      if (exportFormat === 'pdf') {
        exportToPDF(exportData, filename);
      } else if (exportFormat === 'excel') {
        exportToExcel(exportData, filename);
      } else if (exportFormat === 'png') {
        exportToPNG(exportData, filename);
      }

      // Close modal after successful export
      setTimeout(() => {
        toggle();
      }, 100);
    } catch (error) {
      console.error('Export failed:', error);
      setExportError('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = (data: any, filename: string) => {
    // Mock PDF export - in real implementation, you would use a library like jsPDF
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
  };

  const exportToExcel = (data: any, filename: string) => {
    // Mock Excel export - in real implementation, you would use a library like xlsx
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadBlob(blob, `${filename}.csv`);
  };

  const exportToPNG = (data: any, filename: string) => {
    // Mock PNG export - in real implementation, you would capture the dashboard as image
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
  };

  const convertToCSV = (data: any) => {
    let csv = 'Analytics Export Report\n\n';

    if (data.sections.coursePerformance && data.analyticsData.coursePerformance) {
      csv += 'Course Performance\n';
      csv += 'Course,Completion Rate,Average Score,Enrollments,Difficulty\n';
      data.analyticsData.coursePerformance.courseDetails.forEach((course: any) => {
        csv += `"${course.courseTitle}",${course.completionRate},${course.averageScore},${course.enrollmentCount},"${course.difficulty}"\n`;
      });
      csv += '\n';
    }

    if (data.sections.studentEngagement && data.analyticsData.studentEngagement) {
      csv += 'Student Engagement\n';
      csv += 'Date,Active Users,Average Session Time,Completed Lessons\n';
      data.analyticsData.studentEngagement.engagementTrends.forEach((trend: any) => {
        csv += `${trend.date},${trend.activeUsers},${trend.averageSessionTime},${trend.completedLessons}\n`;
      });
      csv += '\n';
    }

    if (data.sections.comparative && data.analyticsData.comparative) {
      csv += 'Course Comparisons\n';
      csv += 'Course,Completion Rate,Average Score,Enrollments,Performance Rank\n';
      data.analyticsData.comparative.courseComparisons.forEach((course: any) => {
        csv += `"${course.courseTitle}",${course.completionRate},${course.averageScore},${course.enrollmentCount},"${course.performanceRank}"\n`;
      });
    }

    return csv;
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return faFilePdf;
      case 'excel':
        return faFileExcel;
      case 'png':
        return faFileImage;
      default:
        return faDownload;
    }
  };

  const selectedSectionsCount = Object.values(exportSections).filter(Boolean).length;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <FontAwesomeIcon icon={faDownload} className="me-2" />
        <Translate contentKey="comprehensiveAnalytics.export.title">Export Analytics Report</Translate>
      </ModalHeader>

      <ModalBody>
        {exportError && (
          <Alert color="danger" className="mb-3">
            {exportError}
          </Alert>
        )}

        <Form>
          {/* Export Format */}
          <FormGroup>
            <Label>
              <Translate contentKey="comprehensiveAnalytics.export.format">Export Format</Translate>
            </Label>
            <Row>
              <Col md="4">
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="exportFormat"
                      value="pdf"
                      checked={exportFormat === 'pdf'}
                      onChange={e => setExportFormat(e.target.value as any)}
                    />
                    <FontAwesomeIcon icon={faFilePdf} className="me-2 text-danger" />
                    PDF Report
                  </Label>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="exportFormat"
                      value="excel"
                      checked={exportFormat === 'excel'}
                      onChange={e => setExportFormat(e.target.value as any)}
                    />
                    <FontAwesomeIcon icon={faFileExcel} className="me-2 text-success" />
                    Excel/CSV
                  </Label>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="exportFormat"
                      value="png"
                      checked={exportFormat === 'png'}
                      onChange={e => setExportFormat(e.target.value as any)}
                    />
                    <FontAwesomeIcon icon={faFileImage} className="me-2 text-info" />
                    PNG Image
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </FormGroup>

          {/* Sections to Include */}
          <FormGroup>
            <Label>
              <Translate contentKey="comprehensiveAnalytics.export.sections">Sections to Include</Translate>
              <small className="text-muted ms-2">({selectedSectionsCount} selected)</small>
            </Label>
            <Row>
              <Col md="6">
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={exportSections.coursePerformance}
                      onChange={() => handleSectionChange('coursePerformance')}
                    />
                    <Translate contentKey="comprehensiveAnalytics.export.coursePerformance">Course Performance</Translate>
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={exportSections.studentEngagement}
                      onChange={() => handleSectionChange('studentEngagement')}
                    />
                    <Translate contentKey="comprehensiveAnalytics.export.studentEngagement">Student Engagement</Translate>
                  </Label>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" checked={exportSections.learningPath} onChange={() => handleSectionChange('learningPath')} />
                    <Translate contentKey="comprehensiveAnalytics.export.learningPath">Learning Paths</Translate>
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" checked={exportSections.comparative} onChange={() => handleSectionChange('comparative')} />
                    <Translate contentKey="comprehensiveAnalytics.export.comparative">Comparative Analysis</Translate>
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </FormGroup>

          {/* Export Options */}
          <FormGroup>
            <Label>
              <Translate contentKey="comprehensiveAnalytics.export.options">Export Options</Translate>
            </Label>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" checked={includeCharts} onChange={e => setIncludeCharts(e.target.checked)} />
                <Translate contentKey="comprehensiveAnalytics.export.includeCharts">Include Charts and Visualizations</Translate>
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" checked={includeRawData} onChange={e => setIncludeRawData(e.target.checked)} />
                <Translate contentKey="comprehensiveAnalytics.export.includeRawData">Include Raw Data Tables</Translate>
              </Label>
            </FormGroup>
          </FormGroup>

          {/* Export Summary */}
          <Alert color="info">
            <h6>
              <Translate contentKey="comprehensiveAnalytics.export.summary">Export Summary</Translate>
            </h6>
            <ul className="mb-0">
              <li>
                <strong>
                  <Translate contentKey="comprehensiveAnalytics.export.format">Format:</Translate>
                </strong>{' '}
                {exportFormat.toUpperCase()}
              </li>
              <li>
                <strong>
                  <Translate contentKey="comprehensiveAnalytics.export.timeRange">Time Range:</Translate>
                </strong>{' '}
                {timeRange}
              </li>
              <li>
                <strong>
                  <Translate contentKey="comprehensiveAnalytics.export.sectionsCount">Sections:</Translate>
                </strong>{' '}
                {selectedSectionsCount} of 4
              </li>
              <li>
                <strong>
                  <Translate contentKey="comprehensiveAnalytics.export.viewType">View Type:</Translate>
                </strong>{' '}
                {isTeacherView ? 'Teacher' : 'Admin'}
              </li>
            </ul>
          </Alert>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={exporting}>
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button color="primary" onClick={handleExport} disabled={exporting || selectedSectionsCount === 0}>
          {exporting ? (
            <>
              <Spinner size="sm" className="me-2" />
              <Translate contentKey="comprehensiveAnalytics.export.exporting">Exporting...</Translate>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={getFormatIcon(exportFormat)} className="me-2" />
              <Translate contentKey="comprehensiveAnalytics.export.download">Download Report</Translate>
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AnalyticsExportModal;
