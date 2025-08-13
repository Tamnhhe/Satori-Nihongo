import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Space,
  Card,
  Row,
  Col,
  message,
  Tabs,
  Divider,
  Alert,
  Spin,
  Transfer,
  Input,
} from 'antd';
import { SaveOutlined, EyeOutlined } from '@ant-design/icons';
import { Translate } from 'react-jhipster';
import dayjs from 'dayjs';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface QuizAssignmentModalProps {
  open: boolean;
  quizId: number | null;
  quizTitle?: string;
  onClose: () => void;
  onSave: (assignment: IQuizAssignment) => void;
}

interface IQuizAssignment {
  id?: number;
  quizId?: number;
  quizTitle?: string;
  assignmentType?: string;
  courseIds?: number[];
  lessonIds?: number[];
  studentIds?: number[];
  classIds?: number[];
  startDate?: string;
  endDate?: string;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  isActive?: boolean;
  showResultsImmediately?: boolean;
  randomizeQuestions?: boolean;
  randomizeAnswers?: boolean;
  instructions?: string;
  passingScore?: number;
  isGraded?: boolean;
  weight?: number;
}

interface Course {
  id: number;
  title: string;
  courseCode: string;
}

interface Lesson {
  id: number;
  title: string;
  courseId: number;
}

interface CourseClass {
  id: number;
  name: string;
  code: string;
  course: Course;
}

interface Student {
  id: number;
  fullName: string;
  studentId: string;
}

interface AssignmentPreview {
  totalStudents: number;
  courseCount: number;
  lessonCount: number;
  classCount: number;
  individualStudentCount: number;
}

export const QuizAssignmentModal: React.FC<QuizAssignmentModalProps> = ({ open, quizId, quizTitle, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('assignment');

  const [assignmentType, setAssignmentType] = useState<string>('COURSE');
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [preview, setPreview] = useState<AssignmentPreview | null>(null);

  useEffect(() => {
    if (open && quizId) {
      loadInitialData();
      form.setFieldsValue({
        quizId,
        quizTitle,
        assignmentType: 'COURSE',
        isActive: true,
        maxAttempts: 3,
        showResultsImmediately: true,
        randomizeQuestions: false,
        randomizeAnswers: false,
        isGraded: true,
        weight: 100,
      });
    }
  }, [open, quizId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [coursesRes, classesRes] = await Promise.all([
        axios.get('/api/admin/quiz-assignments/courses'),
        axios.get('/api/admin/quiz-assignments/classes'),
      ]);

      setCourses(coursesRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      message.error('Failed to load assignment data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentTypeChange = (type: string) => {
    setAssignmentType(type);
    form.setFieldValue('assignmentType', type);

    // Clear related fields when type changes
    form.setFieldsValue({
      courseIds: undefined,
      lessonIds: undefined,
      classIds: undefined,
      studentIds: undefined,
    });
    setLessons([]);
    setStudents([]);
    setSelectedStudents([]);
  };

  const handleCourseChange = async (courseIds: number[]) => {
    if (courseIds && courseIds.length > 0) {
      try {
        const response = await axios.get('/api/admin/quiz-assignments/lessons', {
          params: { courseIds },
        });
        setLessons(response.data);
      } catch (error) {
        message.error('Failed to load lessons');
      }
    } else {
      setLessons([]);
    }
  };

  const handleClassChange = async (classIds: number[]) => {
    if (classIds && classIds.length > 0) {
      try {
        const response = await axios.get('/api/admin/quiz-assignments/students', {
          params: { classIds },
        });
        setAvailableStudents(response.data);
      } catch (error) {
        message.error('Failed to load students');
      }
    } else {
      setAvailableStudents([]);
    }
  };

  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      const assignmentData: IQuizAssignment = {
        ...values,
        quizId,
        studentIds: assignmentType === 'INDIVIDUAL' ? selectedStudents : values.studentIds,
        startDate: values.dateRange ? values.dateRange[0].toISOString() : undefined,
        endDate: values.dateRange ? values.dateRange[1].toISOString() : undefined,
      };

      const response = await axios.post('/api/admin/quiz-assignments/preview', assignmentData);
      setPreview(response.data);
      setActiveTab('preview');
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      const assignmentData: IQuizAssignment = {
        ...values,
        quizId,
        quizTitle,
        studentIds: assignmentType === 'INDIVIDUAL' ? selectedStudents : values.studentIds,
        startDate: values.dateRange ? values.dateRange[0].toISOString() : undefined,
        endDate: values.dateRange ? values.dateRange[1].toISOString() : undefined,
      };

      await axios.post('/api/admin/quiz-assignments', assignmentData);
      message.success('Quiz assignment created successfully');
      onSave(assignmentData);
      onClose();
    } catch (error) {
      message.error('Failed to create quiz assignment');
    } finally {
      setSaving(false);
    }
  };

  const renderAssignmentTargets = () => {
    switch (assignmentType) {
      case 'COURSE':
        return (
          <>
            <Form.Item name="courseIds" label="Select Courses" rules={[{ required: true, message: 'Please select at least one course' }]}>
              <Select
                mode="multiple"
                placeholder="Select courses"
                onChange={handleCourseChange}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
                }
              >
                {courses.map(course => (
                  <Option key={course.id} value={course.id}>
                    {course.courseCode} - {course.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {lessons.length > 0 && (
              <Form.Item name="lessonIds" label="Specific Lessons (Optional)">
                <Select
                  mode="multiple"
                  placeholder="Select specific lessons or leave empty for all lessons"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                >
                  {lessons.map(lesson => (
                    <Option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </>
        );

      case 'CLASS':
        return (
          <Form.Item name="classIds" label="Select Classes" rules={[{ required: true, message: 'Please select at least one class' }]}>
            <Select
              mode="multiple"
              placeholder="Select classes"
              onChange={handleClassChange}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
              }
            >
              {classes.map(courseClass => (
                <Option key={courseClass.id} value={courseClass.id}>
                  {courseClass.code} - {courseClass.name} ({courseClass.course.title})
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'INDIVIDUAL':
        return (
          <div>
            <Form.Item
              name="classIds"
              label="Select Classes to Load Students"
              rules={[{ required: true, message: 'Please select classes to load students' }]}
            >
              <Select mode="multiple" placeholder="Select classes to load students from" onChange={handleClassChange} showSearch>
                {classes.map(courseClass => (
                  <Option key={courseClass.id} value={courseClass.id}>
                    {courseClass.code} - {courseClass.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {availableStudents.length > 0 && (
              <Form.Item label="Select Individual Students">
                <Transfer
                  dataSource={availableStudents.map(student => ({
                    key: student.id.toString(),
                    title: `${student.studentId} - ${student.fullName}`,
                  }))}
                  targetKeys={selectedStudents.map(id => id.toString())}
                  onChange={targetKeys => {
                    setSelectedStudents(targetKeys.map(key => parseInt(String(key), 10)));
                  }}
                  render={item => item.title}
                  showSearch
                  filterOption={(inputValue, item) => item.title.toLowerCase().includes(inputValue.toLowerCase())}
                  titles={['Available Students', 'Selected Students']}
                />
              </Form.Item>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal title={`Assign Quiz: ${quizTitle}`} open={open} onCancel={onClose} width={800} footer={null} destroyOnHidden>
      <Spin spinning={loading}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Assignment Details" key="assignment">
            <Form form={form} layout="vertical">
              <Card title="Assignment Type" size="small" style={{ marginBottom: 16 }}>
                <Form.Item name="assignmentType" label="Assignment Type" rules={[{ required: true }]}>
                  <Select value={assignmentType} onChange={handleAssignmentTypeChange}>
                    <Option value="COURSE">Assign to Courses</Option>
                    <Option value="CLASS">Assign to Classes</Option>
                    <Option value="INDIVIDUAL">Assign to Individual Students</Option>
                  </Select>
                </Form.Item>

                {renderAssignmentTargets()}
              </Card>

              <Card title="Schedule Settings" size="small" style={{ marginBottom: 16 }}>
                <Form.Item
                  name="dateRange"
                  label="Available Period"
                  rules={[{ required: true, message: 'Please select the available period' }]}
                >
                  <RangePicker showTime style={{ width: '100%' }} placeholder={['Start Date', 'End Date']} />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="timeLimitMinutes" label="Time Limit (minutes)">
                      <InputNumber min={1} max={300} placeholder="No limit" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="maxAttempts" label="Maximum Attempts">
                      <InputNumber min={1} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="isActive" label="Active" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Card>

              <Card title="Quiz Settings" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="showResultsImmediately" label="Show Results Immediately" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="randomizeQuestions" label="Randomize Questions" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="randomizeAnswers" label="Randomize Answer Options" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Card>

              <Card title="Grading Settings" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="isGraded" label="Graded" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="passingScore" label="Passing Score (%)">
                      <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="weight" label="Weight (%)">
                      <InputNumber min={1} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="instructions" label="Instructions for Students">
                  <TextArea rows={3} placeholder="Special instructions for this quiz assignment" />
                </Form.Item>
              </Card>
            </Form>
          </TabPane>

          <TabPane tab="Preview" key="preview">
            {preview ? (
              <div>
                <Alert
                  message="Assignment Preview"
                  description={`This assignment will affect ${preview.totalStudents} students across ${preview.courseCount} courses, ${preview.classCount} classes, and ${preview.individualStudentCount} individual assignments.`}
                  type="info"
                  style={{ marginBottom: 16 }}
                />

                <Card title="Assignment Summary" size="small">
                  <Row gutter={16}>
                    <Col span={6}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{preview.totalStudents}</div>
                        <div>Total Students</div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>{preview.courseCount}</div>
                        <div>Courses</div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>{preview.classCount}</div>
                        <div>Classes</div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>{preview.individualStudentCount}</div>
                        <div>Individual</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </div>
            ) : (
              <Alert
                message="No Preview Available"
                description="Click 'Preview Assignment' to see the impact of this assignment."
                type="warning"
              />
            )}
          </TabPane>
        </Tabs>

        <Divider />

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button icon={<EyeOutlined />} onClick={handlePreview}>
              Preview Assignment
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
              <Translate contentKey="entity.action.save">Create Assignment</Translate>
            </Button>
          </Space>
        </div>
      </Spin>
    </Modal>
  );
};

export default QuizAssignmentModal;
