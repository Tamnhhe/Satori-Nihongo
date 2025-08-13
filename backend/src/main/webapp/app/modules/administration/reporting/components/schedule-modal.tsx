import React, { useState } from 'react';
import { Translate } from 'react-jhipster';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';

import { ScheduleFrequency } from 'app/shared/model/reporting.model';

interface ScheduleModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSchedule: (scheduleConfig: any) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, toggle, onSchedule }) => {
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: ScheduleFrequency.WEEKLY,
    recipients: [''],
    isActive: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setScheduleConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRecipientsChange = (index: number, value: string) => {
    const newRecipients = [...scheduleConfig.recipients];
    newRecipients[index] = value;
    setScheduleConfig(prev => ({
      ...prev,
      recipients: newRecipients,
    }));
  };

  const addRecipient = () => {
    setScheduleConfig(prev => ({
      ...prev,
      recipients: [...prev.recipients, ''],
    }));
  };

  const removeRecipient = (index: number) => {
    const newRecipients = scheduleConfig.recipients.filter((_, i) => i !== index);
    setScheduleConfig(prev => ({
      ...prev,
      recipients: newRecipients,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty recipients
    const validRecipients = scheduleConfig.recipients.filter(email => email.trim() !== '');

    if (validRecipients.length === 0) {
      return;
    }

    onSchedule({
      ...scheduleConfig,
      recipients: validRecipients,
    });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canSubmit = () => {
    const validRecipients = scheduleConfig.recipients.filter(email => email.trim() !== '' && isValidEmail(email.trim()));
    return validRecipients.length > 0;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          <Translate contentKey="reporting.schedule.title">Schedule Report</Translate>
        </ModalHeader>

        <ModalBody>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="frequency">
                  <Translate contentKey="reporting.schedule.frequency">Frequency</Translate> *
                </Label>
                <Input
                  type="select"
                  id="frequency"
                  value={scheduleConfig.frequency}
                  onChange={e => handleInputChange('frequency', e.target.value as ScheduleFrequency)}
                  required
                >
                  <option value={ScheduleFrequency.DAILY}>
                    <Translate contentKey="reporting.schedule.daily">Daily</Translate>
                  </option>
                  <option value={ScheduleFrequency.WEEKLY}>
                    <Translate contentKey="reporting.schedule.weekly">Weekly</Translate>
                  </option>
                  <option value={ScheduleFrequency.MONTHLY}>
                    <Translate contentKey="reporting.schedule.monthly">Monthly</Translate>
                  </option>
                  <option value={ScheduleFrequency.QUARTERLY}>
                    <Translate contentKey="reporting.schedule.quarterly">Quarterly</Translate>
                  </option>
                </Input>
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={scheduleConfig.isActive}
                    onChange={e => handleInputChange('isActive', e.target.checked)}
                  />
                  <Translate contentKey="reporting.schedule.active">Active</Translate>
                </Label>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label>
              <Translate contentKey="reporting.schedule.recipients">Email Recipients</Translate> *
            </Label>
            {scheduleConfig.recipients.map((recipient, index) => (
              <div key={index} className="d-flex mb-2">
                <Input
                  type="email"
                  value={recipient}
                  onChange={e => handleRecipientsChange(index, e.target.value)}
                  placeholder="Enter email address"
                  className="me-2"
                  invalid={recipient.trim() !== '' && !isValidEmail(recipient.trim())}
                />
                {scheduleConfig.recipients.length > 1 && (
                  <Button type="button" color="danger" size="sm" onClick={() => removeRecipient(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" color="secondary" size="sm" onClick={addRecipient} className="mt-2">
              <Translate contentKey="reporting.schedule.addRecipient">Add Recipient</Translate>
            </Button>
          </FormGroup>

          <div className="alert alert-info">
            <small>
              <Translate contentKey="reporting.schedule.info">
                The report will be automatically generated and sent to the specified recipients according to the selected frequency. The
                first execution will be scheduled based on the current time and selected frequency.
              </Translate>
            </small>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="primary" type="submit" disabled={!canSubmit()}>
            <Translate contentKey="reporting.schedule.confirm">Schedule Report</Translate>
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ScheduleModal;
