import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Switch, DatePicker, Button, Space, Card, Row, Col, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { Translate } from 'react-jhipster';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getQuizSettings, updateQuizSettings, IQuizSettings, resetUpdateSuccess } from './quiz-management.reducer';

interface QuizSettingsProps {
  quizId: number;
  onClose: () => void;
}

export const QuizSettings: React.FC<QuizSettingsProps> = ({ quizId, onClose }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const loading = useAppSelector(state => state.quizManagement.loading);
  const updating = useAppSelector(state => state.quizManagement.updating);
  const updateSuccess = useAppSelector(state => state.quizManagement.updateSuccess);

  const [settings, setSettings] = useState<IQuizSettings>({
    quizId,
    timeLimitMinutes: undefined,
    isActive: false,
    activationTime: undefined,
    deactivationTime: undefined,
    maxAttempts: 3,
    showResultsImmediately: true,
    randomizeQuestions: false,
    randomizeAnswers: false,
  });

  useEffect(() => {
    dispatch(getQuizSettings(quizId));
  }, [quizId]);

  useEffect(() => {
    if (updateSuccess) {
      message.success('Quiz settings updated successfully');
      dispatch(resetUpdateSuccess());
      onClose();
    }
  }, [updateSuccess, onClose]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const settingsToSave: IQuizSettings = {
        ...settings,
        ...values,
        quizId,
        activationTime: values.activationTime ? values.activationTime.toISOString() : undefined,
        deactivationTime: values.deactivationTime ? values.deactivationTime.toISOString() : undefined,
      };

      dispatch(updateQuizSettings(settingsToSave));
    } catch (error) {
      message.error('Please check the form for errors');
    }
  };

  const handleFormChange = (changedFields: any, allFields: any) => {
    const formData = form.getFieldsValue();
    setSettings(prev => ({ ...prev, ...formData }));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFieldsChange={handleFormChange}
      initialValues={{
        ...settings,
        activationTime: settings.activationTime ? dayjs(settings.activationTime) : undefined,
        deactivationTime: settings.deactivationTime ? dayjs(settings.deactivationTime) : undefined,
      }}
    >
      <Card title="Timing Settings" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="timeLimitMinutes"
              label={<Translate contentKey="quizSettings.timeLimit">Time Limit (minutes)</Translate>}
              help="Leave empty for no time limit"
            >
              <InputNumber min={1} max={300} placeholder="No limit" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="maxAttempts" label={<Translate contentKey="quizSettings.maxAttempts">Max Attempts</Translate>}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Activation Settings" size="small" style={{ marginBottom: 16 }}>
        <Form.Item name="isActive" label={<Translate contentKey="quizSettings.isActive">Active</Translate>} valuePropName="checked">
          <Switch />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="activationTime"
              label={<Translate contentKey="quizSettings.activationTime">Activation Time</Translate>}
              help="When the quiz becomes available"
            >
              <DatePicker showTime style={{ width: '100%' }} placeholder="Select activation time" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deactivationTime"
              label={<Translate contentKey="quizSettings.deactivationTime">Deactivation Time</Translate>}
              help="When the quiz becomes unavailable"
            >
              <DatePicker showTime style={{ width: '100%' }} placeholder="Select deactivation time" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Display Settings" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="showResultsImmediately"
              label={<Translate contentKey="quizSettings.showResults">Show Results Immediately</Translate>}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="randomizeQuestions"
              label={<Translate contentKey="quizSettings.randomizeQuestions">Randomize Questions</Translate>}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="randomizeAnswers"
          label={<Translate contentKey="quizSettings.randomizeAnswers">Randomize Answer Options</Translate>}
          valuePropName="checked"
          help="Only applies to multiple choice questions"
        >
          <Switch />
        </Form.Item>
      </Card>

      <Divider />

      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={onClose}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button type="primary" icon={<SaveOutlined />} loading={updating} onClick={handleSave}>
            <Translate contentKey="entity.action.save">Save Settings</Translate>
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default QuizSettings;
