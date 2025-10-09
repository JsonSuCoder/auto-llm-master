import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { UserPlus, Edit, Trash2, Search, Shield, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language, t } from '../utils/translations';
import { getUsers, createUser, updateUser, deleteUser } from '../api/user';

interface UserManagementProps {
  language: Language;
}

export const UserManagement: React.FC<UserManagementProps> = ({ language }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取用户列表
  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((res: any) => {
        if (res.code === 200) {
          setUsers(res.users || []);
        } else {
          toast.error(res.message || '获取用户列表失败');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('获取用户列表失败');
        setLoading(false);
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    role: 'producer'
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.username || !newUser.name) {
      toast.error(t('fillCompleteInfo', language));
      return;
    }

    setLoading(true);
    createUser({
      ...newUser,
      email: `${newUser.username}@example.com`, // 假设邮箱格式
      password: '123456', // 默认密码
      status: 'active'
    })
      .then((res: any) => {
        setLoading(false);
        if (res.code === 200) {
          // 重新获取用户列表
          getUsers().then((res: any) => {
            if (res.code === 200) {
              setUsers(res.data || []);
            }
          });
          setNewUser({ username: '', name: '', role: 'producer' });
          setIsAddDialogOpen(false);
          toast.success(t('userAddSuccess', language));
        } else {
          toast.error(res.message || '添加用户失败');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast.error('添加用户失败');
      });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      name: user.name,
      role: user.role
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!newUser.username || !newUser.name) {
      toast.error(t('fillCompleteInfo', language));
      return;
    }

    setLoading(true);
    updateUser(editingUser.id, {
      ...newUser,
      email: `${newUser.username}@example.com`, // 假设邮箱格式
    })
      .then((res: any) => {
        setLoading(false);
        if (res.code === 200) {
          // 重新获取用户列表
          getUsers().then((res: any) => {
            if (res.code === 200) {
              setUsers(res.data || []);
            }
          });
          setEditingUser(null);
          setNewUser({ username: '', name: '', role: 'producer' });
          setIsAddDialogOpen(false);
          toast.success(t('userUpdateSuccess', language));
        } else {
          toast.error(res.message || '更新用户失败');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast.error('更新用户失败');
      });
  };

  const handleToggleStatus = (userId) => {
    const targetUser = users.find(user => user.id === userId);
    if (!targetUser) return;
    
    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    
    setLoading(true);
    updateUser(userId, { status: newStatus })
      .then((res: any) => {
        setLoading(false);
        if (res.code === 200) {
          // 重新获取用户列表
          getUsers().then((res: any) => {
            if (res.code === 200) {
              setUsers(res.data || []);
            }
          });
          toast.success(t('userStatusUpdated', language));
        } else {
          toast.error(res.message || '更新用户状态失败');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast.error('更新用户状态失败');
      });
  };

  const handleDeleteUser = (userId) => {
    setLoading(true);
    deleteUser(userId)
      .then((res: any) => {
        setLoading(false);
        if (res.code === 200) {
          // 重新获取用户列表
          getUsers().then((res: any) => {
            if (res.code === 200) {
              setUsers(res.data || []);
            }
          });
          toast.success(t('userDeleted', language));
        } else {
          toast.error(res.message || '删除用户失败');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast.error('删除用户失败');
      });
  };

  const getRoleBadge = (role) => {
    return role === 'admin' ? (
      <Badge variant="default" className="bg-red-100 text-red-800">
        <Shield className="w-3 h-3 mr-1" />
        {t('admin', language)}
      </Badge>
    ) : (
      <Badge variant="secondary">
        <User className="w-3 h-3 mr-1" />
        {t('producer', language)}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    return status ? (
      <Badge variant="default" className="bg-green-100 text-green-800">{t('enabled', language)}</Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500">{t('disabled', language)}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t('userManagement', language)}
          </CardTitle>
          <CardDescription>
            {t('userManagementDesc', language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={language === 'zh' ? '搜索用户...' : 'Search users...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingUser(null);
                  setNewUser({ username: '', name: '', role: 'producer' });
                }}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('addUser', language)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? t('editUser', language) : t('addUser', language)}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser 
                      ? (language === 'zh' ? '修改用户信息和权限' : 'Modify user information and permissions')
                      : (language === 'zh' ? '创建新的系统用户' : 'Create a new system user')
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">{t('username', language)}</Label>
                    <Input
                      id="username"
                      type="email"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="请输入邮箱"
                      disabled={editingUser}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">{t('realName', language)}</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder={t('enterRealName', language)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">{t('role', language)}</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">{t('admin', language)}</SelectItem>
                        <SelectItem value="producer">{t('producer', language)}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    {t('cancel', language)}
                  </Button>
                  <Button onClick={editingUser ? handleUpdateUser : handleAddUser}>
                    {editingUser ? t('update', language) : t('create', language)}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('userInfo', language)}</TableHead>
                  <TableHead>{t('role', language)}</TableHead>
                  <TableHead>{t('status', language)}</TableHead>
                  <TableHead>{t('createdAt', language)}</TableHead>
                  <TableHead className="text-right">{t('actions', language)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">admin@gmail.com</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(user.is_active)}
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() => handleToggleStatus(user.id)}
                          size="sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('noMatchingUsers', language)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};