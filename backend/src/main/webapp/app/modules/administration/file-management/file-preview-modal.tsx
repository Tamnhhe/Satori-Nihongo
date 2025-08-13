import React from 'react';
import { Modal, Descriptions, Image, Button, Space } from 'antd';
import { DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { Translate } from 'react-jhipster';

interface IFilePreviewModalProps {
  open: boolean;
  onCancel: () => void;
  fileId: string;
  filePreview: any;
}

const FilePreviewModal = ({ open, onCancel, fileId, filePreview }: IFilePreviewModalProps) => {
  if (!filePreview) return null;

  const isImage = filePreview.mimeType?.startsWith('image/');
  const isVideo = filePreview.mimeType?.startsWith('video/');
  const isAudio = filePreview.mimeType?.startsWith('audio/');
  const isPdf = filePreview.mimeType === 'application/pdf';

  const renderPreview = () => {
    if (isImage) {
      return (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Image
            src={`/api/admin/files/${fileId}/download`}
            alt={filePreview.originalFileName}
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <video controls style={{ maxWidth: '100%', maxHeight: '400px' }} src={`/api/admin/files/${fileId}/download`}>
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <audio controls style={{ width: '100%' }}>
            <source src={`/api/admin/files/${fileId}/download`} type={filePreview.mimeType} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <iframe
            src={`/api/admin/files/${fileId}/download`}
            style={{ width: '100%', height: '400px', border: 'none' }}
            title={filePreview.originalFileName}
          />
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>
          <Translate contentKey="fileManagement.previewNotAvailable">Preview not available for this file type</Translate>
        </p>
      </div>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <Translate contentKey="fileManagement.filePreview">File Preview</Translate>
          <span>- {filePreview.originalFileName}</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="download" icon={<DownloadOutlined />} onClick={() => window.open(`/api/admin/files/${fileId}/download`)}>
          <Translate contentKey="fileManagement.download">Download</Translate>
        </Button>,
        <Button key="close" onClick={onCancel}>
          <Translate contentKey="entity.action.close">Close</Translate>
        </Button>,
      ]}
    >
      {renderPreview()}

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label={<Translate contentKey="fileManagement.fileName">File Name</Translate>}>
          {filePreview.originalFileName}
        </Descriptions.Item>
        <Descriptions.Item label={<Translate contentKey="fileManagement.fileSize">File Size</Translate>}>
          {(filePreview.fileSize / 1024).toFixed(1)} KB
        </Descriptions.Item>
        <Descriptions.Item label={<Translate contentKey="fileManagement.mimeType">MIME Type</Translate>}>
          {filePreview.mimeType}
        </Descriptions.Item>
        <Descriptions.Item label={<Translate contentKey="fileManagement.uploadedBy">Uploaded By</Translate>}>
          {filePreview.uploadedBy}
        </Descriptions.Item>
        <Descriptions.Item label={<Translate contentKey="fileManagement.uploadedDate">Uploaded Date</Translate>}>
          {new Date(filePreview.uploadedDate).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={<Translate contentKey="fileManagement.downloadCount">Download Count</Translate>}>
          {filePreview.downloadCount || 0}
        </Descriptions.Item>
        {filePreview.folder && (
          <Descriptions.Item label={<Translate contentKey="fileManagement.folder">Folder</Translate>} span={2}>
            {filePreview.folder}
          </Descriptions.Item>
        )}
        {filePreview.description && (
          <Descriptions.Item label={<Translate contentKey="fileManagement.description">Description</Translate>} span={2}>
            {filePreview.description}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default FilePreviewModal;
