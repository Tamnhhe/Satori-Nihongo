import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, InputNumber, Switch, Button, Card, Space, message, Modal, Tabs, Row, Col } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined, DragOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getQuizForBuilder,
  createQuizWithBuilder,
  updateQuizWithBuilder,
  reorderQuestions,
  IQuizBuilder,
  IQuizQuestionBuilder,
  resetUpdateSuccess,
} from './quiz-management.reducer';
import QuestionEditor from './question-editor';
import QuizSettings from './quiz-settings';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const SortableQuestionCard = ({
  question,
  index,
  onEdit,
  onDelete,
}: {
  question: IQuizQuestionBuilder;
  index: number;
  onEdit: (q: IQuizQuestionBuilder) => void;
  onDelete: (index: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `question-${question.position}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 8,
    backgroundColor: isDragging ? '#f0f0f0' : 'white',
    border: isDragging ? '2px dashed #1890ff' : '1px solid #d9d9d9',
    opacity: isDragging ? 0.8 : 1,
  } as React.CSSProperties;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      size="small"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
            <DragOutlined />
          </div>
          <span>Question {question.position}</span>
          <span
            style={{
              fontSize: '12px',
              color: '#666',
              backgroundColor: '#f0f0f0',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {question.type}
          </span>
        </div>
      }
      extra={
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => onEdit(question)} />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => onDelete(index)} />
        </Space>
      }
    >
      <div style={{ fontSize: '14px' }}>
        {question.content && question.content.length > 150 ? `${question.content.substring(0, 150)}...` : question.content}
      </div>
      {question.imageUrl && (
        <div style={{ marginTop: 8 }}>
          <img src={question.imageUrl} alt="Question" style={{ maxWidth: '100px', maxHeight: '60px', objectFit: 'cover' }} />
        </div>
      )}
    </Card>
  );
};

export const QuizBuilder = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = !id;

  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('basic');
  const [questionEditorVisible, setQuestionEditorVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuizQuestionBuilder | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const quiz = useAppSelector(state => state.quizManagement.entity) as IQuizBuilder;
  const updating = useAppSelector(state => state.quizManagement.updating);
  const updateSuccess = useAppSelector(state => state.quizManagement.updateSuccess);

  const [quizData, setQuizData] = useState<IQuizBuilder>({
    title: '',
    description: '',
    isTest: false,
    isPractice: true,
    quizType: 'LESSON',
    timeLimitMinutes: undefined,
    questions: [],
    courseIds: [],
    lessonIds: [],
  });

  useEffect(() => {
    if (!isNew) {
      dispatch(getQuizForBuilder(id));
    }
  }, [id, isNew]);

  useEffect(() => {
    if (quiz?.id) {
      setQuizData(quiz);
      form.setFieldsValue({
        title: quiz.title,
        description: quiz.description,
        isTest: quiz.isTest,
        isPractice: quiz.isPractice,
        quizType: quiz.quizType,
        timeLimitMinutes: quiz.timeLimitMinutes,
        courseIds: quiz.courseIds,
        lessonIds: quiz.lessonIds,
      });
    }
  }, [quiz, form]);

  useEffect(() => {
    if (updateSuccess) {
      message.success(
        isNew
          ? translate('quizManagement.created', { param: quizData.title })
          : translate('quizManagement.updated', { param: quizData.title }),
      );
      dispatch(resetUpdateSuccess());
      if (isNew) {
        navigate('/admin/quiz-management');
      }
    }
  }, [updateSuccess, isNew, navigate, quizData.title]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const quizToSave: IQuizBuilder = {
        ...quizData,
        ...values,
      };

      if (isNew) {
        dispatch(createQuizWithBuilder(quizToSave));
      } else {
        dispatch(updateQuizWithBuilder(quizToSave));
      }
    } catch (error) {
      console.error(error);
      message.error('Please check the form for errors');
    }
  };

  const handleFormChange = (changedFields: any, allFields: any) => {
    const formData = form.getFieldsValue();
    setQuizData(prev => ({ ...prev, ...formData }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const questions = quizData.questions || [];
      const oldIndex = questions.findIndex(q => `question-${q.position}` === active.id);
      const newIndex = questions.findIndex(q => `question-${q.position}` === over?.id);

      const updatedQuestions = arrayMove(questions, oldIndex, newIndex).map((question, index) => ({
        ...question,
        position: index + 1,
      }));

      setQuizData(prev => ({
        ...prev,
        questions: updatedQuestions,
      }));

      if (!isNew && quizData.id) {
        const questionOrders = updatedQuestions.map(q => ({
          questionId: q.questionId,
          position: q.position,
        }));
        dispatch(reorderQuestions({ quizId: quizData.id, questionOrders }));
      }
    }
  };

  const addNewQuestion = () => {
    setEditingQuestion(null);
    setQuestionEditorVisible(true);
  };

  const editQuestion = (question: IQuizQuestionBuilder) => {
    setEditingQuestion(question);
    setQuestionEditorVisible(true);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = (quizData.questions || []).filter((_, i) => i !== index);
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions.map((q, i) => ({ ...q, position: i + 1 })),
    }));
  };

  const handleQuestionSave = (question: IQuizQuestionBuilder) => {
    if (editingQuestion) {
      // Update existing question
      const updatedQuestions = (quizData.questions || []).map(q => (q.position === editingQuestion.position ? question : q));
      setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
    } else {
      // Add new question
      const newPosition = (quizData.questions?.length || 0) + 1;
      const newQuestion = { ...question, position: newPosition };
      setQuizData(prev => ({
        ...prev,
        questions: [...(prev.questions || []), newQuestion],
      }));
    }
    setQuestionEditorVisible(false);
    setEditingQuestion(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>
          {isNew ? (
            <Translate contentKey="quizManagement.home.createLabel">Create Quiz</Translate>
          ) : (
            <Translate contentKey="quizManagement.home.editLabel">Edit Quiz</Translate>
          )}
        </h2>
        <Space>
          {!isNew && (
            <Button icon={<SettingOutlined />} onClick={() => setSettingsVisible(true)}>
              <Translate contentKey="quizManagement.settings">Settings</Translate>
            </Button>
          )}
          <Button onClick={() => navigate('/admin/quiz-management')}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button type="primary" icon={<SaveOutlined />} loading={updating} onClick={handleSave} data-testid="save-quiz-button">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Basic Information" key="basic">
          <Card>
            <Form form={form} layout="vertical" onFieldsChange={handleFormChange} initialValues={quizData}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label={<Translate contentKey="quizManagement.title">Title</Translate>}
                    rules={[{ required: true, message: 'Please enter quiz title' }]}
                  >
                    <Input placeholder="Enter quiz title" data-testid="quiz-title-input" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="quizType"
                    label={<Translate contentKey="quizManagement.type">Type</Translate>}
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select quiz type">
                      <Option value="COURSE">Course Quiz</Option>
                      <Option value="LESSON">Lesson Quiz</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="description" label={<Translate contentKey="quizManagement.description">Description</Translate>}>
                <TextArea rows={3} placeholder="Enter quiz description" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="timeLimitMinutes"
                    label={<Translate contentKey="quizManagement.timeLimit">Time Limit (minutes)</Translate>}
                  >
                    <InputNumber min={1} max={300} placeholder="No limit" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="isTest"
                    label={<Translate contentKey="quizManagement.isTest">Is Test</Translate>}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="isPractice"
                    label={<Translate contentKey="quizManagement.isPractice">Is Practice</Translate>}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab={`Questions (${quizData.questions?.length || 0})`} key="questions">
          <Card
            title={<Translate contentKey="quizManagement.questions">Questions</Translate>}
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={addNewQuestion}>
                <Translate contentKey="quizManagement.addQuestion">Add Question</Translate>
              </Button>
            }
          >
            {quizData.questions && quizData.questions.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(quizData.questions || []).map(q => `question-${q.position}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div>
                    {(quizData.questions || []).map((question, index) => (
                      <SortableQuestionCard
                        key={`question-${question.position}`}
                        question={question}
                        index={index}
                        onEdit={editQuestion}
                        onDelete={deleteQuestion}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#999',
                  border: '2px dashed #d9d9d9',
                  borderRadius: '6px',
                }}
              >
                <p>No questions added yet</p>
                <Button type="primary" icon={<PlusOutlined />} onClick={addNewQuestion}>
                  Add First Question
                </Button>
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={editingQuestion ? 'Edit Question' : 'Add Question'}
        open={questionEditorVisible}
        onCancel={() => {
          setQuestionEditorVisible(false);
          setEditingQuestion(null);
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <QuestionEditor
          question={editingQuestion}
          onSave={handleQuestionSave}
          onCancel={() => {
            setQuestionEditorVisible(false);
            setEditingQuestion(null);
          }}
        />
      </Modal>

      {!isNew && Boolean(quizData.id) && (
        <Modal
          title="Quiz Settings"
          open={settingsVisible}
          onCancel={() => setSettingsVisible(false)}
          footer={null}
          width={600}
          destroyOnClose
        >
          <QuizSettings quizId={quizData.id} onClose={() => setSettingsVisible(false)} />
        </Modal>
      )}
    </div>
  );
};

export default QuizBuilder;
