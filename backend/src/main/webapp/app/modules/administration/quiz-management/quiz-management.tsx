import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Badge, Input, Select, Space, Tooltip, Popconfirm, message } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EyeOutlined,
  SettingOutlined,
  SendOutlined,
  FileSearchOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { getQuizzes, getQuizForBuilder, IQuizManagement, IQuizBuilder } from './quiz-management.reducer';
import QuizAssignmentModal from './quiz-assignment-modal';
import QuizPreviewModal from './quiz-preview-modal';

const { Search } = Input;
const { Option } = Select;

export const QuizManagement = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams({ itemsPerPage: ITEMS_PER_PAGE, activePage: 1, sort: 'id', order: ASC }, pageLocation.search),
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<IQuizManagement | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<IQuizBuilder | null>(null);

  const quizList = useAppSelector(state => state.quizManagement.entities);
  const loading = useAppSelector(state => state.quizManagement.loading);
  const totalItems = useAppSelector(state => state.quizManagement.totalItems);
  const quizEntity = useAppSelector(state => state.quizManagement.entity) as IQuizBuilder;

  const getAllEntities = () => {
    dispatch(
      getQuizzes({
        page: pagination.activePage - 1,
        size: pagination.itemsPerPage,
        sort: `${pagination.sort},${pagination.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPagination({
      ...pagination,
      order: pagination.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const handleAssignQuiz = (quiz: IQuizManagement) => {
    setSelectedQuiz(quiz);
    setAssignmentModalVisible(true);
  };

  const handlePreviewQuiz = async (quiz: IQuizManagement) => {
    try {
      await dispatch(getQuizForBuilder(quiz.id));
      setSelectedQuiz(quiz);
      setPreviewModalVisible(true);
    } catch (error) {
      message.error('Failed to load quiz for preview');
    }
  };

  const handleAssignmentSave = (assignment: any) => {
    message.success('Quiz assigned successfully');
    setAssignmentModalVisible(false);
    setSelectedQuiz(null);
  };

  useEffect(() => {
    if (quizEntity && selectedQuiz && previewModalVisible) {
      setPreviewQuiz(quizEntity);
    }
  }, [quizEntity, selectedQuiz, previewModalVisible]);

  const getQuizTypeColor = (type: string) => {
    switch (type) {
      case 'COURSE':
        return 'blue';
      case 'LESSON':
        return 'green';
      default:
        return 'default';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'default';
  };

  const columns = [
    {
      title: <Translate contentKey="quizManagement.title">Title</Translate>,
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (text: string, record: IQuizManagement) => (
        <div>
          <strong>{text}</strong>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {record.description.length > 100 ? `${record.description.substring(0, 100)}...` : record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: <Translate contentKey="quizManagement.type">Type</Translate>,
      dataIndex: 'quizType',
      key: 'quizType',
      width: 120,
      render: (type: string, record: IQuizManagement) => (
        <div>
          <Badge color={getQuizTypeColor(type)} text={type} />
          <div style={{ fontSize: '11px', marginTop: '2px' }}>
            {record.isTest && <Badge status="error" text="Test" />}
            {record.isPractice && <Badge status="processing" text="Practice" />}
          </div>
        </div>
      ),
    },
    {
      title: <Translate contentKey="quizManagement.questions">Questions</Translate>,
      dataIndex: 'questionCount',
      key: 'questionCount',
      width: 100,
      align: 'center' as const,
      render: (count: number) => <Badge count={count} style={{ backgroundColor: '#52c41a' }} />,
    },
    {
      title: <Translate contentKey="quizManagement.timeLimit">Time Limit</Translate>,
      dataIndex: 'timeLimitMinutes',
      key: 'timeLimitMinutes',
      width: 120,
      align: 'center' as const,
      render: (minutes: number) => (minutes ? `${minutes} min` : <span style={{ color: '#999' }}>No limit</span>),
    },
    {
      title: <Translate contentKey="quizManagement.status">Status</Translate>,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center' as const,
      render: (isActive: boolean) => <Badge status={isActive ? 'success' : 'default'} text={isActive ? 'Active' : 'Inactive'} />,
    },
    {
      title: <Translate contentKey="quizManagement.associations">Associations</Translate>,
      key: 'associations',
      width: 200,
      render: (record: IQuizManagement) => (
        <div style={{ fontSize: '12px' }}>
          {record.courseNames && record.courseNames.length > 0 && (
            <div>
              <strong>Courses:</strong> {record.courseNames.join(', ')}
            </div>
          )}
          {record.lessonNames && record.lessonNames.length > 0 && (
            <div>
              <strong>Lessons:</strong> {record.lessonNames.join(', ')}
            </div>
          )}
          {(!record.courseNames || record.courseNames.length === 0) && (!record.lessonNames || record.lessonNames.length === 0) && (
            <span style={{ color: '#999' }}>No associations</span>
          )}
        </div>
      ),
    },
    {
      title: <Translate contentKey="entity.action.title">Actions</Translate>,
      key: 'actions',
      width: 200,
      align: 'center' as const,
      render: (record: IQuizManagement) => (
        <Space size="small">
          <Tooltip title="Preview Quiz">
            <Button type="text" icon={<FileSearchOutlined />} size="small" onClick={() => handlePreviewQuiz(record)} />
          </Tooltip>
          <Tooltip title="Quiz Analytics">
            <Button
              type="text"
              icon={<BarChartOutlined />}
              size="small"
              onClick={() => navigate(`/admin/quiz-management/${record.id}/analytics`)}
            />
          </Tooltip>
          <Tooltip title="Edit Quiz">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => navigate(`/admin/quiz-management/${record.id}/edit`)} />
          </Tooltip>
          <Tooltip title="Assign Quiz">
            <Button type="text" icon={<SendOutlined />} size="small" onClick={() => handleAssignQuiz(record)} />
          </Tooltip>
          <Tooltip title="Quiz Settings">
            <Button
              type="text"
              icon={<SettingOutlined />}
              size="small"
              onClick={() => navigate(`/admin/quiz-management/${record.id}/settings`)}
            />
          </Tooltip>
          <Tooltip title={record.isActive ? 'Deactivate Quiz' : 'Activate Quiz'}>
            <Button
              type="text"
              icon={record.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              size="small"
              style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this quiz?"
            onConfirm={() => {
              /* TODO: Implement delete */
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Quiz">
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2>
            <Translate contentKey="quizManagement.home.title">Quiz Management</Translate>
          </h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/quiz-management/new')}>
            <Translate contentKey="quizManagement.home.createLabel">Create new Quiz</Translate>
          </Button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Search
            placeholder={translate('quizManagement.home.search')}
            allowClear
            style={{ width: 300 }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onSearch={handleSyncList}
          />
          <Select placeholder="Filter by Type" allowClear style={{ width: 150 }} value={filterType} onChange={setFilterType}>
            <Option value="COURSE">Course</Option>
            <Option value="LESSON">Lesson</Option>
          </Select>
          <Select placeholder="Filter by Status" allowClear style={{ width: 150 }} value={filterStatus} onChange={setFilterStatus}>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          <Button onClick={handleSyncList}>
            <Translate contentKey="quizManagement.home.refreshListLabel">Refresh List</Translate>
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={quizList}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.activePage,
          pageSize: pagination.itemsPerPage,
          total: totalItems,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: handlePagination,
          onShowSizeChange(current, size) {
            setPagination({ ...pagination, itemsPerPage: size, activePage: current });
          },
        }}
        scroll={{ x: 1200 }}
      />

      <QuizAssignmentModal
        open={assignmentModalVisible}
        quizId={selectedQuiz?.id || null}
        quizTitle={selectedQuiz?.title}
        onClose={() => {
          setAssignmentModalVisible(false);
          setSelectedQuiz(null);
        }}
        onSave={handleAssignmentSave}
      />

      <QuizPreviewModal
        open={previewModalVisible}
        quiz={previewQuiz}
        onClose={() => {
          setPreviewModalVisible(false);
          setSelectedQuiz(null);
          setPreviewQuiz(null);
        }}
      />
    </div>
  );
};

export default QuizManagement;
