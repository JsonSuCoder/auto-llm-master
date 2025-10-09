import React, { useState, useEffect } from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import Switch from 'antd/es/switch';
import Table from 'antd/es/table';
import Badge from 'antd/es/badge';
import Space from 'antd/es/space';
import Tooltip from 'antd/es/tooltip';
import message from 'antd/lib/message';
import { UserAddOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import { Language, t } from '../utils/translations';
import { getUsers, createUser, updateUser, deleteUser } from '../api/user';
import type { User } from '../api/user';
import UserDialog from './dialog/UserDialog';

interface UserManagementProps {
  language: Language;
}

export const UserManagement: React.FC<UserManagementProps> = ({ language }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取用户列表
  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((res: any) => {
        if (res.code === 200) {
          setUsers(res.users || []);
        } else {
          message.error(res.message || '获取用户列表失败');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        message.error('获取用户列表失败');
        setLoading(false);
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [userData, setUserData] = useState<{
    type: 'add' | 'edit';
    data: User;
  }>({
    type: 'add',
    data: {
      email: '',
      name: '',
      role: 'producer',
      is_active: true
    }
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!userData.data.name) {
      message.error(t('fillCompleteInfo', language));
      return;
    }

    setLoading(true);
    createUser({
      ...userData.data,
    })
      .then((res: any) => {
        setLoading(false);
        if (res.code === 200) {
          // 重新获取用户列表
          getUsers().then((res: any) => {
            if (res.code === 200) {
              setUsers(res.users || []);
            }
          });
          setUserData({
            type: 'add',
            data: { email: '', name: '', role: 'producer', is_active: true }
          });
          setIsAddDialogOpen(false);
          message.success(t('userAddSuccess', language));
        } else {
          message.error(res.message || '添加用户失败');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        message.error('添加用户失败');
      });
  };

  const handleEditUser = (user: User) => {
    setUserData({
      type: 'edit',
      data: user
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!userData.data.name || !userData.data.id) {
      message.error(t('fillCompleteInfo', language));
      return;
    }

    setLoading(true);
    updateUser(userData.data.id, {
      ...userData.data,
    })
      .then((res: any) => {
        setLoading(false);
        if (res.code === 200) {
          // 重新获取用户列表
          getUsers().then((res: any) => {
            if (res.code === 200) {
              setUsers(res.users || []);
            }
          });
          setUserData({
            type: 'add',
            data: { email: '', name: '', role: 'producer', is_active: true }
          });
          setIsAddDialogOpen(false);
          message.success(t('userUpdateSuccess', language));
        } else {
          message.error(res.message || '更新用户失败');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        message.error('更新用户失败');
      });
  };

  const handleToggleStatus = (userId: string) => {
    const targetUser = users.find(user => user.id === userId);
    if (!targetUser) return;

    const newStatus = targetUser.is_active ? false : true;

    setLoading(true);
    updateUser(userId, { ...targetUser, is_active: newStatus })
      .then((res: any) => {
        setLoading(false);
        if (res.code === 200) {
          // 重新获取用户列表
          getUsers().then((res: any) => {
            if (res.code === 200) {
              setUsers(res.users || []);
            }
          });
          message.success(t('userStatusUpdated', language));
        } else {
          message.error(res.message || '更新用户状态失败');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        message.error('更新用户状态失败');
      });
  };

  const handleDeleteUser = (userId: string) => {
    setLoading(true);
    deleteUser(userId)
      .then((res: any) => {
        setLoading(false);
        if (res.code === 200) {
          // 重新获取用户列表
          getUsers().then((res: any) => {
            if (res.code === 200) {
              setUsers(res.users || []);
            }
          });
          message.success(t('userDeleted', language));
        } else {
          message.error(res.message || '删除用户失败');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        message.error('删除用户失败');
      });
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge color="red">
        <Space>
          <SafetyOutlined />
          {t('admin', language)}
        </Space>
      </Badge>
    ) : (
      <Badge color="blue">
        <Space>
          <UserOutlined />
          {t('producer', language)}
        </Space>
      </Badge>
    );
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge status="success" text={t('enabled', language)} />
    ) : (
      <Badge status="default" text={t('disabled', language)} />
    );
  };

  return (
    <div className="space-y-6">
      <Card title={
        <span className="flex items-center gap-2">
          <SafetyOutlined />
          {t('userManagement', language)}
        </span>
      }>
        <p className="text-gray-500 mb-4">
          {t('userManagementDesc', language)}
        </p>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder={language === 'zh' ? '搜索用户...' : 'Search users...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
          </div>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              setUserData({
                type: 'add',
                data: { email: '', name: '', role: 'producer', is_active: true }
              });
              setIsAddDialogOpen(true);
            }}
          >
            {t('addUser', language)}
          </Button>

          <UserDialog
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onSubmit={userData.type === 'edit' ? handleUpdateUser : handleAddUser}
            type={userData.type}
            userData={userData.data}
            setUserData={(data) => setUserData({ ...userData, data })}
            language={language}
          />
        </div>

        <div className="border rounded-lg">
          <Table
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            columns={[
              {
                title: t('userInfo', language),
                key: 'userInfo',
                render: (user) => (
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">admin@gmail.com</div>
                  </div>
                )
              },
              {
                title: t('role', language),
                key: 'role',
                render: (user) => getRoleBadge(user.role)
              },
              {
                title: t('status', language),
                key: 'status',
                render: (user) => (
                  <div className="flex items-center gap-2">
                    {getStatusBadge(user.is_active)}
                    <Switch
                      checked={user.is_active}
                      onChange={() => handleToggleStatus(user.id)}
                      size="small"
                    />
                  </div>
                )
              },
              {
                title: t('createdAt', language),
                key: 'createdAt',
                dataIndex: 'createdAt',
                render: (text) => <span className="text-gray-500">{text}</span>
              },
              {
                title: t('actions', language),
                key: 'actions',
                align: 'right',
                render: (user) => (
                  <Space>
                    <Tooltip title={t('edit', language)}>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditUser(user)}
                      />
                    </Tooltip>
                    <Tooltip title={t('delete', language)}>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteUser(user.id)}
                      />
                    </Tooltip>
                  </Space>
                )
              }
            ]}
          />
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {t('noMatchingUsers', language)}
          </div>
        )}
      </Card >
    </div >
  );
};