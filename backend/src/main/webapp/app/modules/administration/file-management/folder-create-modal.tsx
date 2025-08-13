import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Translate, translate } from 'react-jhipster';

interface IFolderCreateModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (folderPath: string) => void;
  currentPath: string;
}

const FolderCreateModal = ({ open, onCancel, onSuccess, currentPath }: IFolderCreateModalProps) => {
  const [form] = Form.useForm();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const folderPath = currentPath ? `${currentPath}/${values.folderName}` : values.folderName;

      onSuccess(folderPath);
      form.resetFields();
      message.success(translate('fileManagement.folderCreated'));
    } catch (error) {
      console.error('Folder creation error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={<Translate contentKey="fileManagement.createFolder">Create Folder</Translate>}
      open={open}
      onOk={handleCreate}
      onCancel={handleCancel}
      okText={<Translate contentKey="fileManagement.create">Create</Translate>}
      cancelText={<Translate contentKey="entity.action.cancel">Cancel</Translate>}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="folderName"
          label={<Translate contentKey="fileManagement.folderName">Folder Name</Translate>}
          rules={[
            {
              required: true,
              message: translate('fileManagement.folderNameRequired'),
            },
            {
              pattern: /^[a-zA-Z0-9_-]+$/,
              message: translate('fileManagement.folderNamePattern'),
            },
          ]}
        >
          <Input placeholder={translate('fileManagement.folderNamePlaceholder')} />
        </Form.Item>

        {currentPath && (
          <Form.Item label={<Translate contentKey="fileManagement.parentFolder">Parent Folder</Translate>}>
            <Input value={currentPath} disabled />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default FolderCreateModal;
