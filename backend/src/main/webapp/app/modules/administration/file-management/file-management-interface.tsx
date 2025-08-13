import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Button, Input, Select, Modal, Upload, Tree, Table, Space, Tooltip, Progress } from 'antd';
import {
  FolderOutlined,
  FileOutlined,
  UploadOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  PlusOutlined,
  FolderAddOutlined,
} from '@ant-design/icons';
import { Translate, translate } from 'react-jhipster';
import { IRootState, useAppDispatch } from 'app/config/store';
import { getFolderStructure, searchFiles, uploadFile, deleteFile, createFolder, getFilePreview, reset } from './file-management.reducer';
import FilePreviewModal from './file-preview-modal';
import FileUploadModal from './file-upload-modal';
import FolderCreateModal from './folder-create-modal';
import './file-management-interface.scss';

const { Search } = Input;
const { Option } = Select;
const { DirectoryTree } = Tree;

const FileManagementInterface = () => {
  const dispatch = useAppDispatch();
  const { folderStructure, currentFolderFiles, searchResults, filePreview, loading, uploading, uploadProgress } = useSelector(
    (state: IRootState) => state.fileManagement,
  );

  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMimeType, setSelectedMimeType] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>('');

  useEffect(() => {
    dispatch(getFolderStructure(''));
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleFolderSelect = useCallback(
    (selectedKeys: React.Key[]) => {
      const folderPath = selectedKeys[0] as string;
      setSelectedFolder(folderPath);
      dispatch(getFolderStructure(folderPath));
    },
    [dispatch],
  );

  const handleSearch = useCallback(() => {
    dispatch(searchFiles({ query: searchQuery, folder: selectedFolder, mimeType: selectedMimeType }));
  }, [dispatch, searchQuery, selectedFolder, selectedMimeType]);

  const handleFilePreview = (fileId: string) => {
    setSelectedFileId(fileId);
    setPreviewModalVisible(true);
    dispatch(getFilePreview(fileId));
  };

  const handleFileDelete = (fileId: string) => {
    Modal.confirm({
      title: translate('fileManagement.deleteConfirm'),
      content: translate('fileManagement.deleteConfirmMessage'),
      onOk() {
        dispatch(deleteFile(fileId));
      },
    });
  };

  const handleUploadSuccess = () => {
    setUploadModalVisible(false);
    dispatch(getFolderStructure(selectedFolder));
  };

  const handleFolderCreate = (folderPath: string) => {
    dispatch(createFolder(folderPath));
    setFolderModalVisible(false);
    dispatch(getFolderStructure(selectedFolder));
  };

  const renderTreeData = (folderData: any) => {
    if (!folderData) return [];

    const convertToTreeData = (item: any): any => {
      return {
        title: item.name,
        key: item.path,
        icon: item.type === 'folder' ? <FolderOutlined /> : <FileOutlined />,
        children: item.children ? item.children.map(convertToTreeData) : [],
        isLeaf: item.type === 'file',
      };
    };

    return [convertToTreeData(folderData)];
  };

  const renderFileGrid = () => {
    const files = searchResults.length > 0 ? searchResults : currentFolderFiles;

    return (
      <Row gutter={[16, 16]}>
        {files.map((file: any) => (
          <Col key={file.id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card
              hoverable
              className="file-card"
              cover={
                <div className="file-preview">
                  {file.mimeType?.startsWith('image/') ? (
                    <img src={`/api/admin/files/${file.id}/download`} alt={file.originalFileName} />
                  ) : (
                    <div className="file-icon">
                      <FileOutlined style={{ fontSize: '48px' }} />
                    </div>
                  )}
                </div>
              }
              actions={[
                <Tooltip key="preview" title={translate('fileManagement.preview')}>
                  <EyeOutlined onClick={() => handleFilePreview(file.id)} />
                </Tooltip>,
                <Tooltip key="download" title={translate('fileManagement.download')}>
                  <DownloadOutlined onClick={() => window.open(`/api/admin/files/${file.id}/download`)} />
                </Tooltip>,
                <Tooltip key="delete" title={translate('fileManagement.delete')}>
                  <DeleteOutlined onClick={() => handleFileDelete(file.id)} />
                </Tooltip>,
              ]}
            >
              <Card.Meta
                title={
                  <Tooltip title={file.originalFileName}>
                    <div className="file-name">{file.originalFileName}</div>
                  </Tooltip>
                }
                description={
                  <div className="file-details">
                    <div>{(file.fileSize / 1024).toFixed(1)} KB</div>
                    <div>{new Date(file.uploadedDate).toLocaleDateString()}</div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const renderFileList = () => {
    const files = searchResults.length > 0 ? searchResults : currentFolderFiles;

    const columns = [
      {
        title: translate('fileManagement.fileName'),
        dataIndex: 'originalFileName',
        key: 'originalFileName',
        render: (text: string, record: any) => (
          <Space>
            <FileOutlined />
            <span>{text}</span>
          </Space>
        ),
      },
      {
        title: translate('fileManagement.fileSize'),
        dataIndex: 'fileSize',
        key: 'fileSize',
        render: (size: number) => `${(size / 1024).toFixed(1)} KB`,
      },
      {
        title: translate('fileManagement.uploadedBy'),
        dataIndex: 'uploadedBy',
        key: 'uploadedBy',
      },
      {
        title: translate('fileManagement.uploadedDate'),
        dataIndex: 'uploadedDate',
        key: 'uploadedDate',
        render: (date: string) => new Date(date).toLocaleDateString(),
      },
      {
        title: translate('fileManagement.actions'),
        key: 'actions',
        render: (text: any, record: any) => (
          <Space>
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleFilePreview(record.id)} />
            <Button type="text" icon={<DownloadOutlined />} onClick={() => window.open(`/api/admin/files/${record.id}/download`)} />
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleFileDelete(record.id)} />
          </Space>
        ),
      },
    ];

    return <Table columns={columns} dataSource={files} rowKey="id" pagination={{ pageSize: 20 }} loading={loading} />;
  };

  return (
    <div className="file-management-interface">
      <Row gutter={24}>
        <Col span={6}>
          <Card
            title={<Translate contentKey="fileManagement.folderStructure">Folder Structure</Translate>}
            extra={
              <Button type="primary" icon={<FolderAddOutlined />} onClick={() => setFolderModalVisible(true)}>
                <Translate contentKey="fileManagement.createFolder">Create Folder</Translate>
              </Button>
            }
          >
            <DirectoryTree onSelect={handleFolderSelect} treeData={renderTreeData(folderStructure)} defaultExpandAll />
          </Card>
        </Col>

        <Col span={18}>
          <Card
            title={
              <Space>
                <Translate contentKey="fileManagement.fileManager">File Manager</Translate>
                {selectedFolder && <span>- {selectedFolder}</span>}
              </Space>
            }
            extra={
              <Space>
                <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalVisible(true)}>
                  <Translate contentKey="fileManagement.uploadFile">Upload File</Translate>
                </Button>
                <Button type={viewMode === 'grid' ? 'primary' : 'default'} onClick={() => setViewMode('grid')}>
                  Grid
                </Button>
                <Button type={viewMode === 'list' ? 'primary' : 'default'} onClick={() => setViewMode('list')}>
                  List
                </Button>
              </Space>
            }
          >
            <div className="file-controls">
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Search
                    placeholder={translate('fileManagement.searchPlaceholder')}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onSearch={handleSearch}
                    enterButton={<SearchOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Select
                    placeholder={translate('fileManagement.filterByType')}
                    value={selectedMimeType}
                    onChange={setSelectedMimeType}
                    style={{ width: '100%' }}
                    allowClear
                  >
                    <Option value="image/">Images</Option>
                    <Option value="video/">Videos</Option>
                    <Option value="audio/">Audio</Option>
                    <Option value="application/pdf">PDF</Option>
                    <Option value="application/msword">Documents</Option>
                  </Select>
                </Col>
              </Row>
            </div>

            <div className="file-content">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <Progress type="circle" />
                </div>
              ) : (
                <>{viewMode === 'grid' ? renderFileGrid() : renderFileList()}</>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <FilePreviewModal
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        fileId={selectedFileId}
        filePreview={filePreview}
      />

      <FileUploadModal
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onSuccess={handleUploadSuccess}
        currentFolder={selectedFolder}
        uploadFile={params => dispatch(uploadFile(params))}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />

      <FolderCreateModal
        open={folderModalVisible}
        onCancel={() => setFolderModalVisible(false)}
        onSuccess={handleFolderCreate}
        currentPath={selectedFolder}
      />
    </div>
  );
};

export default FileManagementInterface;
