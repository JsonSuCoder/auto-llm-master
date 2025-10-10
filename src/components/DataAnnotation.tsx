import React, { useState } from 'react';
import {
  Card,
  Button,
  Table,
  Progress,
  Tag,
  Space,
  Typography,
  message as antdMessage
} from 'antd';
import {
  TagOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { Language, t } from '../utils/translations';
import { AnnotationResults } from './AnnotationResults';

const { Title, Text, Paragraph } = Typography;

interface DataAnnotationProps {
  language: Language;
}

interface Task {
  id: number;
  name: string;
  type: string;
  status: string;
  progress: number;
  queryCount: number;
  annotatedCount: number;
  startTime: string | null;
  endTime: string | null;
  estimatedTime: number | null;
  error: string | null;
  uploadedFiles: string[];
}

export const DataAnnotation: React.FC<DataAnnotationProps> = ({ language }) => {
  const [currentView, setCurrentView] = useState<'main' | 'results'>('main');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedTaskName, setSelectedTaskName] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: language === 'zh' ? '机会发现标注任务01' : 'Opportunity Discovery Annotation Task 01',
      type: language === 'zh' ? 'T1H1 机会发现' : 'T1H1 Opportunity Discovery',
      status: 'completed',
      progress: 100,
      queryCount: 500,
      annotatedCount: 485,
      startTime: '2024-03-15 09:00',
      endTime: '2024-03-15 12:30',
      estimatedTime: null,
      error: null,
      uploadedFiles: ['queries_batch_1.csv']
    },
    {
      id: 2,
      name: language === 'zh' ? '趋势研判标注任务02' : 'Trend Analysis Annotation Task 02',
      type: language === 'zh' ? 'T2H2 趋势研判' : 'T2H2 Trend Analysis',
      status: 'running',
      progress: 65,
      queryCount: 300,
      annotatedCount: 195,
      startTime: '2024-03-15 14:00',
      endTime: null,
      estimatedTime: 25,
      error: null,
      uploadedFiles: ['market_analysis_queries.xlsx']
    },
    {
      id: 3,
      name: language === 'zh' ? '交易决策标注任务03' : 'Trading Decision Annotation Task 03',
      type: language === 'zh' ? 'T3H3 交易决策支持' : 'T3H3 Trading Decision Support',
      status: 'pending',
      progress: 0,
      queryCount: 200,
      annotatedCount: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null,
      uploadedFiles: ['trading_queries.json']
    },
    {
      id: 4,
      name: language === 'zh' ? '综合场景标注任务04' : 'General Scenario Annotation Task 04',
      type: language === 'zh' ? 'T4H1 机会发现' : 'T4H1 Opportunity Discovery',
      status: 'pending',
      progress: 0,
      queryCount: 150,
      annotatedCount: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null,
      uploadedFiles: ['general_queries.csv']
    }
  ]);

  const handleTaskAction = (taskId: number, action: string) => {
    if (action === 'start') {
      // 对于待开始的任务，直接跳转到标注结果页面
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status === 'pending') {
        handleViewResults(taskId, task.type);
        return;
      }
    }

    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        switch (action) {
          case 'start':
            return {
              ...task,
              status: 'running',
              startTime: new Date().toLocaleString()
            };
          case 'pause':
            return { ...task, status: 'paused' };
          case 'resume':
            return { ...task, status: 'running' };
          case 'delete':
            return null;
          default:
            return task;
        }
      }
      return task;
    }).filter(Boolean) as Task[]);

    if (action === 'delete') {
      antdMessage.success(language === 'zh' ? '任务已删除' : 'Task deleted');
    } else {
      antdMessage.success(language === 'zh' ? '操作成功' : 'Operation successful');
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {t('completed', language)}
          </Tag>
        );
      case 'running':
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            {t('running', language)}
          </Tag>
        );
      case 'paused':
        return (
          <Tag icon={<PauseCircleOutlined />} color="warning">
            {t('paused', language)}
          </Tag>
        );
      case 'pending':
        return (
          <Tag icon={<ClockCircleOutlined />} color="default">
            {t('waiting', language)}
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const handleViewResults = (taskId: number, taskName: string) => {
    setSelectedTaskId(taskId);
    setSelectedTaskName(taskName);
    setCurrentView('results');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedTaskId(null);
    setSelectedTaskName('');
  };

  if (currentView === 'results' && selectedTaskId) {
    return (
      <AnnotationResults
        language={language}
        taskId={selectedTaskId}
        taskName={selectedTaskName}
        onBack={handleBackToMain}
      />
    );
  }

  const columns = [
    {
      title: t('taskInfo', language),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Task) => (
        <div>
          <div style={{ fontWeight: 500 }}>T10H1</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            机会发现 • {record.queryCount} {language === 'zh' ? '条Query' : 'Queries'}
          </div>
          {record.error && (
            <div style={{ fontSize: '11px', color: '#ff4d4f', marginTop: '4px' }}>
              {language === 'zh' ? '错误：' : 'Error: '}{record.error}
            </div>
          )}
        </div>
      )
    },
    {
      title: t('progress', language),
      key: 'progress',
      render: (_: any, record: Task) => (
        <div style={{ width: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>{record.annotatedCount}/{record.queryCount}</span>
            <span>{record.progress.toFixed(0)}%</span>
          </div>
          <Progress percent={record.progress} size="small" />
          {record.estimatedTime && (
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              {t('estimatedRemaining', language, { minutes: record.estimatedTime.toString() })}
            </div>
          )}
        </div>
      )
    },
    {
      title: language === 'zh' ? '标注状态' : 'Annotation Status',
      key: 'status',
      render: (_: any, record: Task) => getStatusTag(record.status)
    },
    {
      title: t('timeInfo', language),
      key: 'time',
      render: (_: any, record: Task) => (
        <div style={{ fontSize: '12px', color: '#666' }}>
          {record.startTime && (
            <div>{t('startTime', language, { time: record.startTime })}</div>
          )}
          {record.endTime && (
            <div>{t('endTime', language, { time: record.endTime })}</div>
          )}
        </div>
      )
    },
    {
      title: t('actions', language),
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Task) => (
        <Space size="small">
          {record.status === 'pending' && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => handleTaskAction(record.id, 'start')}
            />
          )}
          {record.status === 'running' && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => handleViewResults(record.id, record.type)}
            />
          )}
          {record.status === 'paused' && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => handleTaskAction(record.id, 'resume')}
            />
          )}
          {record.status === 'completed' && (
            <>
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewResults(record.id, record.type)}
              />
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => {
                  antdMessage.success(language === 'zh' ? '正在下载结果...' : 'Downloading results...');
                }}
              />
            </>
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleTaskAction(record.id, 'delete')}
          />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 标题区域 */}
        <Card>
          <div style={{ marginBottom: '8px' }}>
            <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TagOutlined />
              {t('dataAnnotationTitle', language)}
            </Title>
          </div>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {language === 'zh'
              ? '管理和查看数据标注任务进度'
              : 'Manage and view data annotation task progress'
            }
          </Paragraph>
        </Card>

        {/* 任务列表 */}
        <Card
          title={language === 'zh' ? '标注任务列表' : 'Annotation Task List'}
          extra={
            <Text type="secondary">
              {language === 'zh' ? '管理和监控标注任务进度' : 'Manage and monitor annotation task progress'}
            </Text>
          }
        >
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: language === 'zh' ? '暂无标注任务' : 'No annotation tasks'
            }}
          />
        </Card>
      </Space>
    </div>
  );
};
