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
  DatabaseOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { Language, t } from '../utils/translations';
import CreateDistillationTaskDialog from './dialog/CreateDistillationTaskDialog';

const { Title, Text, Paragraph } = Typography;

interface DataDistillationProps {
  language: Language;
  onViewResults: (taskId: number, taskName: string) => void;
}

interface Task {
  id: number;
  name: string;
  type: string;
  status: string;
  progress: number;
  queryCount: number;
  resultCount: number;
  startTime: string | null;
  endTime: string | null;
  estimatedTime: number | null;
  error: string | null;
}

export const DataDistillation: React.FC<DataDistillationProps> = ({ language, onViewResults }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: language === 'zh' ? '问答类数据蒸馏任务01' : 'Q&A Data Distillation Task 01',
      type: language === 'zh' ? '问答类Query' : 'Q&A Query',
      status: 'completed',
      progress: 100,
      queryCount: 500,
      resultCount: 485,
      startTime: '2024-03-15 09:00',
      endTime: '2024-03-15 10:30',
      estimatedTime: null,
      error: null
    },
    {
      id: 2,
      name: language === 'zh' ? '对话类数据蒸馏任务02' : 'Dialog Data Distillation Task 02',
      type: language === 'zh' ? '对话类Query' : 'Dialog Query',
      status: 'running',
      progress: 65,
      queryCount: 300,
      resultCount: 195,
      startTime: '2024-03-15 11:00',
      endTime: null,
      estimatedTime: 15,
      error: null
    },
    {
      id: 3,
      name: language === 'zh' ? '分类标注蒸馏任务03' : 'Classification Distillation Task 03',
      type: language === 'zh' ? '分类标注Query' : 'Classification Query',
      status: 'failed',
      progress: 23,
      queryCount: 200,
      resultCount: 0,
      startTime: '2024-03-15 12:00',
      endTime: '2024-03-15 12:15',
      estimatedTime: null,
      error: language === 'zh' ? '模型API调用超时' : 'Model API call timeout'
    },
    {
      id: 4,
      name: language === 'zh' ? '问答类数据蒸馏任务04' : 'Q&A Data Distillation Task 04',
      type: language === 'zh' ? '问答类Query' : 'Q&A Query',
      status: 'pending',
      progress: 0,
      queryCount: 150,
      resultCount: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null
    }
  ]);

  const handleCreateTask = (data: {
    selectedType: string;
    selectedQueryType: any;
    selectedQueries: number[];
    distillationPrompt: string;
  }) => {
    const newTask: Task = {
      id: tasks.length + 1,
      name: `${data.selectedType} ${language === 'zh' ? '蒸馏任务' : 'Distillation Task'} ${String(tasks.length + 1).padStart(2, '0')}`,
      type: data.selectedType,
      status: 'pending',
      progress: 0,
      queryCount: data.selectedQueries.length,
      resultCount: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null
    };

    setTasks([...tasks, newTask]);
    antdMessage.success(t('taskCreated', language));
  };

  const handleStartTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            status: 'running',
            startTime: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US'),
            estimatedTime: Math.ceil(task.queryCount / 10)
          }
        : task
    ));
    antdMessage.success(t('taskStarted', language));

    simulateTaskProgress(taskId);
  };

  const handleViewResults = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onViewResults(taskId, task.name);
    }
  };

  const simulateTaskProgress = (taskId: number) => {
    const interval = setInterval(() => {
      setTasks(currentTasks => {
        const updatedTasks = currentTasks.map(task => {
          if (task.id === taskId && task.status === 'running') {
            const newProgress = Math.min(task.progress + Math.random() * 10, 100);
            const newResultCount = Math.floor((newProgress / 100) * task.queryCount);

            if (newProgress >= 100) {
              clearInterval(interval);
              return {
                ...task,
                progress: 100,
                resultCount: newResultCount,
                status: 'completed',
                endTime: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US'),
                estimatedTime: null
              };
            }

            return {
              ...task,
              progress: newProgress,
              resultCount: newResultCount,
              estimatedTime: task.estimatedTime ? Math.max(0, task.estimatedTime - 1) : null
            };
          }
          return task;
        });

        return updatedTasks;
      });
    }, 2000);
  };

  const handlePauseTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: 'paused' }
        : task
    ));
    antdMessage.success(t('taskPaused', language));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    antdMessage.success(t('taskDeleted', language));
  };

  const handleExportResults = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      antdMessage.success(t('exportingResults', language, { name: task.name }));
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
      case 'failed':
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {t('failed', language)}
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
            <span>{record.resultCount}/{record.queryCount}</span>
            <span>{record.progress.toFixed(0)}%</span>
          </div>
          <Progress percent={record.progress} size="small" status={record.status === 'failed' ? 'exception' : undefined} />
          {record.estimatedTime && (
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              {t('estimatedRemaining', language, { minutes: record.estimatedTime.toString() })}
            </div>
          )}
        </div>
      )
    },
    {
      title: language === 'zh' ? '蒸馏状态' : 'Distillation Status',
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
              onClick={() => handleStartTask(record.id)}
            />
          )}
          {record.status === 'running' && (
            <Button
              type="text"
              icon={<PauseCircleOutlined />}
              onClick={() => handlePauseTask(record.id)}
            />
          )}
          {record.status === 'completed' && (
            <>
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => handleExportResults(record.id)}
              />
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewResults(record.id)}
                disabled={record.status !== 'completed'}
              />
            </>
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTask(record.id)}
          />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 创建新任务 */}
        <Card>
          <div style={{ marginBottom: '8px' }}>
            <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DatabaseOutlined />
              {t('dataDistillation', language)}
            </Title>
          </div>
          <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
            {language === 'zh'
              ? '选择Query进行数据蒸馏，生成高质量的训练数据'
              : 'Select Queries for data distillation and generate high-quality training data'
            }
          </Paragraph>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            {t('createTask', language)}
          </Button>
        </Card>

        {/* 创建任务对话框 */}
        <CreateDistillationTaskDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateTask}
          language={language}
        />

        {/* 任务列表 */}
        <Card
          title={t('distillationTaskList', language)}
          extra={
            <Text type="secondary">
              {t('manageDistillationTasks', language)}
            </Text>
          }
        >
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: t('noDistillationTasks', language)
            }}
          />
        </Card>

        {/* 统计信息 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
                <DatabaseOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>{t('totalTasks', language)}</Text>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>{tasks.length}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
                <CheckCircleOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>{t('completed', language)}</Text>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: '#fff7e6', borderRadius: '8px' }}>
                <SyncOutlined style={{ fontSize: '20px', color: '#fa8c16' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>{t('running', language)}</Text>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>
                  {tasks.filter(t => t.status === 'running').length}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: '#fff1f0', borderRadius: '8px' }}>
                <CloseCircleOutlined style={{ fontSize: '20px', color: '#f5222d' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>{t('failed', language)}</Text>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>
                  {tasks.filter(t => t.status === 'failed').length}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Space>
    </div>
  );
};
