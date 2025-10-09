import React, { useEffect } from 'react';
import { Language, t } from '../../utils/translations';
import { Button, Form, Input, Modal, Select } from 'antd';
import { User } from '../../api/user';


interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  type: 'add' | 'edit';
  userData: User;
  setUserData: (data: User) => void;
  language: Language;
}

const UserDialog: React.FC<UserDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  userData,
  setUserData,
  language
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(userData);
  }, [userData, form]);
  const isEditing = type === 'edit';

  return (
    <Modal
      title={isEditing ? t('editUser', language) : t('addUser', language)}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('cancel', language)}
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          {isEditing ? t('update', language) : t('create', language)}
        </Button>
      ]}
    >
      <p className="mb-4">
        {isEditing
          ? (language === 'zh' ? '修改用户信息和权限' : 'Modify user information and permissions')
          : (language === 'zh' ? '创建新的系统用户' : 'Create a new system user')
        }
      </p>
      <Form layout="vertical" form={form}>
        <Form.Item
          label={t('username', language)}
          name="username"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '邮箱格式不正确' },
          ]}
        >
          <Input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            placeholder={userData.email || '请输入邮箱地址'}
            disabled={isEditing}
          />
        </Form.Item>
        <Form.Item
          label={t('realName', language)}
          name="name"
          rules={[{ required: true, message: t('enterRealName', language) }]}
        >
          <Input
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            placeholder={t('enterRealName', language)}
          />
        </Form.Item>
        <Form.Item
          label={t('role', language)}
          name="role"
          rules={[{ required: true, message: t('selectRole', language) }]}
        >
          <Select
            value={userData.role}
            onChange={(value) => setUserData({ ...userData, role: value })}
            options={[
              { value: 'admin', label: t('admin', language) },
              { value: 'producer', label: t('producer', language) }
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserDialog;