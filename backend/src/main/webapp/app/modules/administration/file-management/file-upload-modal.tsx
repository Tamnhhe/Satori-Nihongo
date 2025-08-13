import React, { useState } from 'react';
import { Modal, Upload, Form, Input, Switch, Progress, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Translate, translate } from 'react-jhipster';

const { Dragger } = Upload;
const { TextArea } = Input;

interface IFileUploadModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  currentFolder: string;
  uploadFile: (params: any) => Promise<any>;
  uploading: boolean;
  uploadProgress: number;
}

const FileUploadModal = ({ open, onCancel, onSuccess, currentFolder, uploadFile, uploading, uploadProgress }: IFileUploadModalProps) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();

      if (fileList.length === 0) {
        message.error(translate('fileManagement.selectFileFirst'));
        return;
      }

      const file = fileList[0].originFileObj;

      await uploadFile({
        file,
        folder: currentFolder || values.folder,
        description: values.description,
        isPublic: values.isPublic || false,
      });

      message.success(translate('fileManagement.uploadSuccess'));
      form.resetFields();
      setFileList([]);
      onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      message.error(translate('fileManagement.uploadError'));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload(file: File) {
      // Validate file size (50MB limit)
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error(translate('fileManagement.fileSizeLimit'));
        return false;
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/avi',
        'video/mov',
        'audio/mp3',
        'audio/wav',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/zip',
        'application/x-rar-compressed',
      ];

      if (!allowedTypes.includes(file.type)) {
        message.error(translate('fileManagement.fileTypeNotAllowed'));
        return false;
      }

      setFileList([file]);
      return false; // Prevent automatic upload
    },
    onRemove() {
      setFileList([]);
    },
  };

  return (
    <Modal
      title={<Translate contentKey="fileManagement.uploadFile">Upload File</Translate>}
      open={open}
      onOk={handleUpload}
      onCancel={handleCancel}
      confirmLoading={uploading}
      okText={<Translate contentKey="fileManagement.upload">Upload</Translate>}
      cancelText={<Translate contentKey="entity.action.cancel">Cancel</Translate>}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              <Translate contentKey="fileManagement.dragDropText">Click or drag file to this area to upload</Translate>
            </p>
            <p className="ant-upload-hint">
              <Translate contentKey="fileManagement.uploadHint">Support for single file upload. Maximum file size: 50MB</Translate>
            </p>
          </Dragger>
        </Form.Item>

        {!currentFolder && (
          <Form.Item name="folder" label={<Translate contentKey="fileManagement.folder">Folder</Translate>}>
            <Input placeholder={translate('fileManagement.folderPlaceholder')} />
          </Form.Item>
        )}

        <Form.Item name="description" label={<Translate contentKey="fileManagement.description">Description</Translate>}>
          <TextArea rows={3} placeholder={translate('fileManagement.descriptionPlaceholder')} />
        </Form.Item>

        <Form.Item name="isPublic" label={<Translate contentKey="fileManagement.isPublic">Public File</Translate>} valuePropName="checked">
          <Switch />
        </Form.Item>

        {uploading && (
          <Form.Item>
            <Progress percent={uploadProgress} status="active" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default FileUploadModal;
