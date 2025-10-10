import React from 'react';
import { Card, Tag, Space, Typography } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  TagOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Language, t } from '../utils/translations';

const { Title, Text, Paragraph } = Typography;

interface DashboardHomeProps {
  user: any;
  language: Language;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ user, language }) => {
  const stats = [
    {
      title: language === 'zh' ? '总任务进度' : 'Total Tasks',
      completed: 283,
      total: 390,
      change: '+15',
      icon: FileTextOutlined,
      color: '#52c41a'
    },
    {
      title: language === 'zh' ? '蒸馏任务' : 'Distillation Tasks',
      completed: 142,
      total: 195,
      change: '+8',
      icon: DatabaseOutlined,
      color: '#fa8c16'
    },
    {
      title: language === 'zh' ? '标注任务' : 'Annotation Tasks',
      completed: 89,
      total: 124,
      change: '+5',
      icon: TagOutlined,
      color: '#722ed1'
    },
    {
      title: language === 'zh' ? '盲评任务' : 'Blind Evaluation Tasks',
      completed: 67,
      total: 85,
      change: '+3',
      icon: RiseOutlined,
      color: '#1890ff'
    }
  ];

  const producersData = [
    {
      name: language === 'zh' ? '张三' : 'Alice Wang',
      avatar: 'ZS',
      tasks: {
        total: { completed: 85, total: 100, color: '#8c8c8c', yesterdayChange: 5 },
        query: { completed: 25, total: 30, color: '#1890ff', yesterdayChange: 3 },
        distillation: { completed: 22, total: 28, color: '#fa8c16', yesterdayChange: 2 },
        annotation: { completed: 20, total: 24, color: '#722ed1', yesterdayChange: 4 },
        evaluation: { completed: 18, total: 18, color: '#52c41a', yesterdayChange: 1 }
      }
    },
    {
      name: language === 'zh' ? '李四' : 'Bob Chen',
      avatar: 'LS',
      tasks: {
        total: { completed: 78, total: 95, color: '#8c8c8c', yesterdayChange: 4 },
        query: { completed: 20, total: 25, color: '#1890ff', yesterdayChange: 2 },
        distillation: { completed: 18, total: 23, color: '#fa8c16', yesterdayChange: 3 },
        annotation: { completed: 22, total: 26, color: '#722ed1', yesterdayChange: 2 },
        evaluation: { completed: 18, total: 21, color: '#52c41a', yesterdayChange: 3 }
      }
    },
    {
      name: language === 'zh' ? '王五' : 'Carol Li',
      avatar: 'WW',
      tasks: {
        total: { completed: 65, total: 80, color: '#8c8c8c', yesterdayChange: 3 },
        query: { completed: 15, total: 20, color: '#1890ff', yesterdayChange: 1 },
        distillation: { completed: 16, total: 20, color: '#fa8c16', yesterdayChange: 2 },
        annotation: { completed: 18, total: 22, color: '#722ed1', yesterdayChange: 3 },
        evaluation: { completed: 16, total: 18, color: '#52c41a', yesterdayChange: 1 }
      }
    }
  ];

  const taskTypes: Array<{ key: keyof typeof producersData[0]['tasks'], label: string, icon: any }> = [
    { key: 'total', label: language === 'zh' ? '总任务' : 'Total Tasks', icon: FileTextOutlined },
    { key: 'query', label: language === 'zh' ? 'Query生产' : 'Query Production', icon: DatabaseOutlined },
    { key: 'distillation', label: language === 'zh' ? '蒸馏任务' : 'Distillation', icon: ThunderboltOutlined },
    { key: 'annotation', label: language === 'zh' ? '标注任务' : 'Annotation', icon: TagOutlined },
    { key: 'evaluation', label: language === 'zh' ? '盲评任务' : 'Blind Evaluation', icon: CheckCircleOutlined }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Welcome Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
            color: 'white',
            borderRadius: '8px',
            padding: '32px'
          }}
        >
          <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>
            {t('welcomeBack', language)}，{user.name}！
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: 0, fontSize: '16px' }}>
            {user.role === 'admin' ? t('adminWelcome', language) : t('producerWelcome', language)}
          </Paragraph>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} hoverable>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                      {stat.title}
                    </Text>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {language === 'zh' ? '完成率：' : 'Completion: '}
                      </Text>
                      <Text strong style={{ fontSize: '12px' }}>
                        {Math.round((stat.completed / stat.total) * 100)}%
                      </Text>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                      <span style={{ color: '#52c41a' }}>{stat.completed}</span>
                      <span style={{ color: '#d9d9d9', margin: '0 4px' }}>/</span>
                      <span>{stat.total}</span>
                    </div>
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                      {stat.change} {t('comparedToYesterday', language)}
                    </Text>
                  </div>
                  <IconComponent style={{ fontSize: '32px', color: stat.color }} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Producer Progress Details */}
        <Card
          title={
            <Space>
              <UserOutlined />
              <span>{language === 'zh' ? '数据生产员任务进度详情' : 'Data Producer Task Progress Details'}</span>
            </Space>
          }
          extra={
            <Text type="secondary">
              {language === 'zh' ? '各生产员在不同任务类型中的详细进度情况' : 'Detailed progress of producers across different task types'}
            </Text>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {producersData.map((producer, index) => {
              const isTopPerformer = index < 2;
              return (
                <div
                  key={index}
                  style={{
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Space>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#e6f7ff',
                          color: '#1890ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 500
                        }}
                      >
                        {producer.avatar}
                      </div>
                      <div>
                        <Space size={8}>
                          <Text strong>{producer.name}</Text>
                          {isTopPerformer && (
                            <Tag color="gold">
                              {index === 0 ? '🥇' : '🥈'}
                            </Tag>
                          )}
                        </Space>
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {language === 'zh' ? '总体完成率：' : 'Overall completion: '}
                            {Math.round((producer.tasks.total.completed / producer.tasks.total.total) * 100)}%
                          </Text>
                        </div>
                      </div>
                    </Space>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    {taskTypes.map((taskType) => {
                      const task = producer.tasks[taskType.key];
                      const IconComponent = taskType.icon;
                      return (
                        <div key={taskType.key}>
                          <Space size={4} style={{ marginBottom: '8px' }}>
                            <IconComponent style={{ fontSize: '12px', color: '#8c8c8c' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {taskType.label}
                            </Text>
                          </Space>
                          <div>
                            <Text strong style={{ fontSize: '14px' }}>
                              {task.completed}{language === 'zh' ? '个' : ''}
                            </Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {language === 'zh' ? '相比昨天 +' : 'vs yesterday +'}
                            {task.yesterdayChange}
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </Space>
        </Card>
      </Space>
    </div>
  );
};
