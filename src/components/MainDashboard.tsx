import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Space, Typography } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  TagOutlined,
  EyeOutlined,
  LogoutOutlined,
  RobotOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { UserManagement } from './UserManagement';
import { QueryTypeManagement } from './QueryTypeManagement';
import { QueryProduction } from './QueryProduction';
import { DataDistillation } from './DataDistillation';
import { DataAnnotation } from './DataAnnotation';
import { BlindEvaluation } from './BlindEvaluation';
import { DashboardHome } from './DashboardHome';
import { DistillationResults } from './DistillationResults';
// import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Language, t } from '../utils/translations';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MainDashboardProps {
  user: any;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  user,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  language,
  onToggleLanguage
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const [distillationResultsData, setDistillationResultsData] = useState<{
    taskId: number;
    taskName: string;
  } | null>(null);

  const menuItems = [
    { key: 'home', label: t('home', language), icon: <HomeOutlined />, permission: null },
    { key: 'users', label: t('userManagement', language), icon: <UserOutlined />, permission: 'admin' },
    { key: 'query-types', label: t('queryTypeManagement', language), icon: <SettingOutlined />, permission: null },
    { key: 'query-production', label: t('queryProduction', language), icon: <FileTextOutlined />, permission: null },
    { key: 'data-distillation', label: t('dataDistillation', language), icon: <DatabaseOutlined />, permission: null },
    { key: 'data-annotation', label: t('dataAnnotation', language), icon: <TagOutlined />, permission: null },
    { key: 'blind-evaluation', label: t('blindEvaluation', language), icon: <EyeOutlined />, permission: null }
  ];

  const filteredMenuItems = menuItems.filter(item => !item.permission || user.role === item.permission);

  const handleViewDistillationResults = (taskId: number, taskName: string) => {
    setDistillationResultsData({ taskId, taskName });
    setActiveTab('distillation-results');
  };

  const handleBackFromResults = () => {
    setDistillationResultsData(null);
    setActiveTab('data-distillation');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome user={user} language={language} />;
      case 'users':
        return <UserManagement language={language} />;
      case 'query-types':
        return <QueryTypeManagement language={language} />;
      case 'query-production':
        return <QueryProduction language={language} />;
      case 'data-distillation':
        return <DataDistillation language={language} onViewResults={handleViewDistillationResults} />;
      case 'data-annotation':
        return <DataAnnotation language={language} />;
      case 'blind-evaluation':
        return <BlindEvaluation language={language} />;
      case 'distillation-results':
        return distillationResultsData ? (
          <DistillationResults
            language={language}
            taskId={distillationResultsData.taskId}
            taskName={distillationResultsData.taskName}
            onBack={handleBackFromResults}
          />
        ) : (
          <DashboardHome user={user} language={language} />
        );
      default:
        return <DashboardHome user={user} language={language} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Space size="middle">
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#1890ff',
                color: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RobotOutlined style={{ fontSize: '16px' }} />
            </div>
            {!collapsed && (
              <div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                  {language === 'zh' ? '微调系统' : 'Fine-tuning System'}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '12px' }}>V1.0</div>
              </div>
            )}
          </Space>
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeTab]}
          items={filteredMenuItems}
          onClick={({ key }) => setActiveTab(key)}
          style={{ borderRight: 0 }}
        />

        {/* Footer Section */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#001529'
          }}
        >
          {!collapsed && (
            <div style={{ marginBottom: '12px' }}>
              <Space>
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {user.name.charAt(0)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
                    {user.name}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '12px' }}>
                    {user.role === 'admin' ? t('admin', language) : t('producer', language)}
                  </div>
                </div>
              </Space>
            </div>
          )}

          {!collapsed && (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {/* <ThemeToggle isDark={isDarkMode} onToggle={onToggleDarkMode} language={language} /> */}
              <LanguageToggle language={language} onToggle={onToggleLanguage} />
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={onLogout}
                style={{ width: '100%', justifyContent: 'flex-start', color: 'white' }}
              >
                {t('logout', language)}
              </Button>
            </Space>
          )}

          {collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Avatar style={{ backgroundColor: '#1890ff' }}>
                {user.name.charAt(0)}
              </Avatar>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={onLogout}
                style={{ color: 'white' }}
              />
            </div>
          )}
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Text strong style={{ fontSize: '16px' }}>
              {filteredMenuItems.find(item => item.key === activeTab)?.label || t('home', language)}
            </Text>
          </Space>
        </Header>

        <Content
          style={{
            margin: 0,
            minHeight: 280,
            background: '#f0f2f5'
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};
