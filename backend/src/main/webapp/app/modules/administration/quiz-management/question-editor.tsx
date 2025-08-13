import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Space,
  Card,
  Row,
  Col,
  message,
  Tabs,
  Radio,
  Checkbox,
  InputNumber,
  Switch,
  Divider,
} from 'antd';
import { SaveOutlined, UploadOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Translate } from 'react-jhipster';
import { IQuizQuestionBuilder } from './quiz-management.reducer';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface QuestionEditorProps {
  question?: IQuizQuestionBuilder | null;
  onSave: (question: IQuizQuestionBuilder) => void;
  onCancel: () => void;
}

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface FillInBlankAnswer {
  blanks: string[];
  caseSensitive: boolean;
  acceptPartialMatch: boolean;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState<string>('MULTIPLE_CHOICE');
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
  ]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [fillInBlankAnswers, setFillInBlankAnswers] = useState<string[]>(['']);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [acceptPartialMatch, setAcceptPartialMatch] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        content: question.content,
        type: question.type,
        correctAnswer: question.correctAnswer,
        suggestion: question.suggestion,
        answerExplanation: question.answerExplanation,
      });
      setQuestionType(question.type || 'MULTIPLE_CHOICE');
      setImageUrl(question.imageUrl || '');

      // Parse answer options for multiple choice questions
      if (question.type === 'MULTIPLE_CHOICE' && question.correctAnswer) {
        try {
          const parsedOptions = JSON.parse(question.correctAnswer);
          if (Array.isArray(parsedOptions)) {
            setAnswerOptions(parsedOptions);
          }
        } catch (e) {
          // If parsing fails, treat as simple text answer
          setAnswerOptions([
            { id: '1', text: question.correctAnswer, isCorrect: true },
            { id: '2', text: '', isCorrect: false },
          ]);
        }
      }

      // Parse fill-in-blank answers
      if (question.type === 'FILL_IN_BLANK' && question.correctAnswer) {
        try {
          const parsedAnswer = JSON.parse(question.correctAnswer);
          if (parsedAnswer.blanks && Array.isArray(parsedAnswer.blanks)) {
            setFillInBlankAnswers(parsedAnswer.blanks);
            setCaseSensitive(parsedAnswer.caseSensitive || false);
            setAcceptPartialMatch(parsedAnswer.acceptPartialMatch || false);
          } else {
            setFillInBlankAnswers([question.correctAnswer]);
          }
        } catch (e) {
          setFillInBlankAnswers([question.correctAnswer]);
        }
      }
    }
  }, [question, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      let correctAnswer = values.correctAnswer;

      // For multiple choice questions, serialize the answer options
      if (questionType === 'MULTIPLE_CHOICE') {
        correctAnswer = JSON.stringify(answerOptions);
      } else if (questionType === 'FILL_IN_BLANK') {
        // Serialize fill-in-blank answers with settings
        correctAnswer = JSON.stringify({
          blanks: fillInBlankAnswers.filter(answer => answer.trim() !== ''),
          caseSensitive,
          acceptPartialMatch,
        });
      }

      const questionData: IQuizQuestionBuilder = {
        questionId: question?.questionId,
        position: question?.position,
        content: values.content,
        type: questionType,
        correctAnswer,
        imageUrl,
        suggestion: values.suggestion,
        answerExplanation: values.answerExplanation,
      };

      onSave(questionData);
    } catch (error) {
      message.error('Please check the form for errors');
    }
  };

  const handleTypeChange = (type: string) => {
    setQuestionType(type);
    form.setFieldValue('type', type);

    // Reset answer options when changing type
    if (type === 'MULTIPLE_CHOICE') {
      setAnswerOptions([
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
      ]);
    } else if (type === 'FILL_IN_BLANK') {
      setFillInBlankAnswers(['']);
      setCaseSensitive(false);
      setAcceptPartialMatch(false);
    }
  };

  const addAnswerOption = () => {
    const newId = (answerOptions.length + 1).toString();
    setAnswerOptions([...answerOptions, { id: newId, text: '', isCorrect: false }]);
  };

  const removeAnswerOption = (id: string) => {
    if (answerOptions.length > 2) {
      setAnswerOptions(answerOptions.filter(option => option.id !== id));
    }
  };

  const updateAnswerOption = (id: string, text: string) => {
    setAnswerOptions(answerOptions.map(option => (option.id === id ? { ...option, text } : option)));
  };

  const setCorrectAnswer = (id: string) => {
    setAnswerOptions(
      answerOptions.map(option => ({
        ...option,
        isCorrect: option.id === id,
      })),
    );
  };

  const addFillInBlankAnswer = () => {
    setFillInBlankAnswers([...fillInBlankAnswers, '']);
  };

  const removeFillInBlankAnswer = (index: number) => {
    if (fillInBlankAnswers.length > 1) {
      setFillInBlankAnswers(fillInBlankAnswers.filter((_, i) => i !== index));
    }
  };

  const updateFillInBlankAnswer = (index: number, value: string) => {
    const updatedAnswers = [...fillInBlankAnswers];
    updatedAnswers[index] = value;
    setFillInBlankAnswers(updatedAnswers);
  };

  const handleImageUpload = (info: any) => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.url);
      message.success('Image uploaded successfully');
    } else if (info.file.status === 'error') {
      message.error('Image upload failed');
    }
  };

  const renderQuestionPreview = () => {
    const content = form.getFieldValue('content') || '';

    return (
      <Card title="Question Preview" size="small">
        <div style={{ marginBottom: 16 }}>
          <strong>Question:</strong>
          <div style={{ marginTop: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            {content || 'Enter question content to see preview...'}
          </div>
        </div>

        {imageUrl && (
          <div style={{ marginBottom: 16 }}>
            <img src={imageUrl} alt="Question" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }} />
          </div>
        )}

        {questionType === 'MULTIPLE_CHOICE' && (
          <div>
            <strong>Answer Options:</strong>
            {answerOptions.map((option, index) => (
              <div
                key={option.id}
                style={{ marginTop: 8, padding: 8, backgroundColor: option.isCorrect ? '#e6f7ff' : '#fafafa', borderRadius: 4 }}
              >
                <Radio checked={option.isCorrect} disabled>
                  {option.text || `Option ${index + 1}`}
                </Radio>
              </div>
            ))}
          </div>
        )}

        {questionType === 'FILL_IN_BLANK' && (
          <div>
            <strong>Acceptable Answers:</strong>
            <ul style={{ marginTop: 8 }}>
              {fillInBlankAnswers
                .filter(answer => answer.trim())
                .map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
            </ul>
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              Case Sensitive: {caseSensitive ? 'Yes' : 'No'} | Partial Match: {acceptPartialMatch ? 'Yes' : 'No'}
            </div>
          </div>
        )}

        {questionType === 'TRUE_FALSE' && (
          <div>
            <strong>Correct Answer:</strong>
            <div style={{ marginTop: 8 }}>
              <Radio.Group value={form.getFieldValue('correctAnswer')} disabled>
                <Radio value="true">True</Radio>
                <Radio value="false">False</Radio>
              </Radio.Group>
            </div>
          </div>
        )}

        {questionType === 'ESSAY' && (
          <div>
            <strong>Sample Answer/Grading Criteria:</strong>
            <div style={{ marginTop: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              {form.getFieldValue('correctAnswer') || 'No sample answer provided...'}
            </div>
          </div>
        )}
      </Card>
    );
  };

  const renderAnswerEditor = () => {
    switch (questionType) {
      case 'MULTIPLE_CHOICE':
        return (
          <Card title="Answer Options" size="small">
            {answerOptions.map((option, index) => (
              <div key={option.id} style={{ marginBottom: 12 }}>
                <Row gutter={8} align="middle">
                  <Col span={2}>
                    <Radio checked={option.isCorrect} onChange={() => setCorrectAnswer(option.id)} />
                  </Col>
                  <Col span={18}>
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={e => updateAnswerOption(option.id, e.target.value)}
                    />
                  </Col>
                  <Col span={4}>
                    {answerOptions.length > 2 && (
                      <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => removeAnswerOption(option.id)} />
                    )}
                  </Col>
                </Row>
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={addAnswerOption} style={{ width: '100%' }}>
              Add Option
            </Button>
          </Card>
        );

      case 'FILL_IN_BLANK':
        return (
          <Card title="Fill-in-Blank Answers" size="small">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Space>
                    <Checkbox checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)}>
                      Case Sensitive
                    </Checkbox>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space>
                    <Checkbox checked={acceptPartialMatch} onChange={e => setAcceptPartialMatch(e.target.checked)}>
                      Accept Partial Match
                    </Checkbox>
                  </Space>
                </Col>
              </Row>
            </div>
            <Divider />
            {fillInBlankAnswers.map((answer, index) => (
              <div key={index} style={{ marginBottom: 12 }}>
                <Row gutter={8} align="middle">
                  <Col span={20}>
                    <Input
                      placeholder={`Acceptable answer ${index + 1}`}
                      value={answer}
                      onChange={e => updateFillInBlankAnswer(index, e.target.value)}
                    />
                  </Col>
                  <Col span={4}>
                    {fillInBlankAnswers.length > 1 && (
                      <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => removeFillInBlankAnswer(index)} />
                    )}
                  </Col>
                </Row>
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={addFillInBlankAnswer} style={{ width: '100%' }}>
              Add Alternative Answer
            </Button>
          </Card>
        );

      case 'ESSAY':
        return (
          <Form.Item
            name="correctAnswer"
            label="Sample Answer / Grading Criteria"
            rules={[{ required: true, message: 'Please enter sample answer or grading criteria' }]}
          >
            <TextArea rows={4} placeholder="Enter sample answer or grading criteria" />
          </Form.Item>
        );

      case 'MULTIPLE_SELECT':
        return (
          <Card title="Answer Options (Multiple Select)" size="small">
            <div style={{ marginBottom: 12, fontSize: '12px', color: '#666' }}>Students can select multiple correct answers</div>
            {answerOptions.map((option, index) => (
              <div key={option.id} style={{ marginBottom: 12 }}>
                <Row gutter={8} align="middle">
                  <Col span={2}>
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={e => {
                        const updatedOptions = answerOptions.map(opt =>
                          opt.id === option.id ? { ...opt, isCorrect: e.target.checked } : opt,
                        );
                        setAnswerOptions(updatedOptions);
                      }}
                    />
                  </Col>
                  <Col span={18}>
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={e => updateAnswerOption(option.id, e.target.value)}
                    />
                  </Col>
                  <Col span={4}>
                    {answerOptions.length > 2 && (
                      <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => removeAnswerOption(option.id)} />
                    )}
                  </Col>
                </Row>
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={addAnswerOption} style={{ width: '100%' }}>
              Add Option
            </Button>
          </Card>
        );

      case 'TRUE_FALSE':
        return (
          <Form.Item name="correctAnswer" label="Correct Answer" rules={[{ required: true, message: 'Please select the correct answer' }]}>
            <Radio.Group>
              <Radio value="true">True</Radio>
              <Radio value="false">False</Radio>
            </Radio.Group>
          </Form.Item>
        );

      case 'MATCHING':
        return (
          <Card title="Matching Pairs" size="small">
            <div style={{ marginBottom: 12, fontSize: '12px', color: '#666' }}>Create pairs that students need to match</div>
            <Form.Item name="correctAnswer" label="Matching Pairs (JSON format)" rules={[{ required: true }]}>
              <TextArea rows={6} placeholder='[{"left": "Term 1", "right": "Definition 1"}, {"left": "Term 2", "right": "Definition 2"}]' />
            </Form.Item>
          </Card>
        );

      case 'ORDERING':
        return (
          <Card title="Correct Order" size="small">
            <div style={{ marginBottom: 12, fontSize: '12px', color: '#666' }}>Define the correct order of items</div>
            <Form.Item name="correctAnswer" label="Items in Correct Order (JSON array)" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder='["First item", "Second item", "Third item", "Fourth item"]' />
            </Form.Item>
          </Card>
        );

      default:
        return (
          <Form.Item name="correctAnswer" label="Correct Answer" rules={[{ required: true, message: 'Please enter the correct answer' }]}>
            <Input placeholder="Enter the correct answer" />
          </Form.Item>
        );
    }
  };

  return (
    <Form form={form} layout="vertical">
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type={previewMode ? 'primary' : 'default'} icon={<EyeOutlined />} onClick={() => setPreviewMode(!previewMode)} size="small">
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </Button>
      </div>

      {previewMode ? (
        renderQuestionPreview()
      ) : (
        <Tabs defaultActiveKey="content">
          <TabPane tab="Question Content" key="content">
            <Form.Item
              name="type"
              label={<Translate contentKey="questionEditor.type">Question Type</Translate>}
              rules={[{ required: true }]}
            >
              <Select value={questionType} onChange={handleTypeChange}>
                <Option value="MULTIPLE_CHOICE">Multiple Choice</Option>
                <Option value="MULTIPLE_SELECT">Multiple Select</Option>
                <Option value="FILL_IN_BLANK">Fill in the Blank</Option>
                <Option value="ESSAY">Essay</Option>
                <Option value="TRUE_FALSE">True/False</Option>
                <Option value="MATCHING">Matching</Option>
                <Option value="ORDERING">Ordering</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="content"
              label={<Translate contentKey="questionEditor.content">Question Content</Translate>}
              rules={[{ required: true, message: 'Please enter question content' }]}
            >
              <TextArea rows={4} placeholder="Enter your question here..." showCount maxLength={2000} />
            </Form.Item>

            <Form.Item label="Question Image">
              <Upload name="file" action="/api/files/upload" listType="picture-card" showUploadList={false} onChange={handleImageUpload}>
                {imageUrl ? (
                  <img src={imageUrl} alt="question" style={{ width: '100%' }} />
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {renderAnswerEditor()}
          </TabPane>

          <TabPane tab="Additional Info" key="additional">
            <Form.Item name="suggestion" label={<Translate contentKey="questionEditor.suggestion">Hint/Suggestion</Translate>}>
              <TextArea rows={3} placeholder="Optional hint for students" showCount maxLength={500} />
            </Form.Item>

            <Form.Item name="answerExplanation" label={<Translate contentKey="questionEditor.explanation">Answer Explanation</Translate>}>
              <TextArea rows={4} placeholder="Explain why this is the correct answer" showCount maxLength={1000} />
            </Form.Item>
          </TabPane>
        </Tabs>
      )}

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default QuestionEditor;
