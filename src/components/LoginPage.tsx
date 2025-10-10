import React, { useState } from 'react';
import { Card, Button, Input, Form, Alert, Space, Typography } from 'antd';
import { LockOutlined, MailOutlined, RobotOutlined } from '@ant-design/icons';
// import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Language, t } from '../utils/translations';
import { onLogin, User } from '../api/user';

const { Title, Paragraph, Text } = Typography;

interface LoginPageProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  isDarkMode,
  onToggleDarkMode,
  language,
  onToggleLanguage
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (values.email && values.password) {
        onLogin(values.email, values.password)
          .then((res: any) => {
            setLoading(false);
            if (res.code === 200) {
              // 保存用户信息到localStorage，设置12小时有效期
              const expiresAt = new Date().getTime() + 12 * 60 * 60 * 1000; // 12小时后的时间戳
              const userData = {
                ...res.user,
                expiresAt
              };
              localStorage.setItem('user', JSON.stringify(userData));
              onLoginSuccess(res.user);
            } else {
              setError(res.message || '登录失败，请检查账号和密码');
            }
          })
          .catch(err => {
            console.log(err);
            setError('登录失败，请稍后再试');
            setLoading(false);
          });
      }
    }, 1000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative'
      }}
    >
      {/* 主题和语言切换按钮 - 左下角 */}
      <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
        <Space direction="vertical" size="small">
          {/* <ThemeToggle isDark={isDarkMode} onToggle={onToggleDarkMode} language={language} /> */}
          <LanguageToggle language={language} onToggle={onToggleLanguage} />
        </Space>
      </div>

      <div style={{ width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              backgroundColor: '#1890ff',
              color: 'white',
              borderRadius: '50%',
              marginBottom: '16px'
            }}
          >
            <RobotOutlined style={{ fontSize: '32px' }} />
          </div>
          <Title level={2} style={{ marginBottom: '8px' }}>
            {t('loginTitle', language)}
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {t('loginSubtitle', language)}
          </Paragraph>
        </div>

        <Card
          style={{
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
        >
          <Title level={4} style={{ marginBottom: '8px' }}>
            {t('login', language)}
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
            {t('loginDescription', language)}
          </Paragraph>

          <Form onFinish={handleLogin} layout="vertical" size="large">
            <Form.Item
              label={t('username', language)}
              name="email"
              rules={[
                { required: true, message: language === 'zh' ? '请输入邮箱' : 'Please enter email' },
                { type: 'email', message: language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入邮箱"
                status={error ? 'error' : ''}
              />
            </Form.Item>

            <Form.Item
              label={t('password', language)}
              name="password"
              rules={[{ required: true, message: t('enterPassword', language) }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder={t('enterPassword', language)}
                status={error ? 'error' : ''}
              />
            </Form.Item>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError('')}
                style={{ marginBottom: '16px' }}
              />
            )}

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {loading ? t('loggingIn', language) : t('loginButton', language)}
              </Button>
            </Form.Item>
          </Form>

          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}
          >
            <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              {t('testAccounts', language)}
            </Text>
            <div style={{ fontSize: '12px' }}>
              <div style={{ marginBottom: '4px' }}>
                <Text strong>{t('admin', language)}：</Text> admin@gmail.com / {t('anyPassword', language)}
              </div>
              <div>
                <Text strong>{t('producer', language)}：</Text> producer@gmail.com / {t('anyPassword', language)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
