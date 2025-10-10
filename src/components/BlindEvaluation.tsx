import React, { useState } from 'react';
import {
  Card,
  Button,
  Table,
  Progress,
  Tag,
  Space,
  Typography,
  Tabs,
  Radio,
  message as antdMessage
} from 'antd';
import {
  EyeOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { Language, t } from '../utils/translations';

const { Title, Text, Paragraph } = Typography;

interface BlindEvaluationProps {
  language: Language;
}

interface EvaluationTask {
  id: number;
  name: string;
  nameEn: string;
  type: string;
  typeEn: string;
  scope: string;
  scopeEn: string;
  status: string;
  progress: number;
  evaluators: number;
  totalSamples: number;
  completedSamples: number;
  startTime: string | null;
  endTime: string | null;
  estimatedTime: number | null;
  error: string | null;
}

interface EvaluationResult {
  id: number;
  queryId: string;
  content: string;
  winningResult: string;
  evaluator: string;
  evaluatorEn: string;
  category: string;
  categoryEn: string;
}

export const BlindEvaluation: React.FC<BlindEvaluationProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('task-list');

  const [evaluationTasks] = useState<EvaluationTask[]>([
    {
      id: 1,
      name: 'Query质量盲评任务01',
      nameEn: 'Query Quality Blind Evaluation Task 01',
      type: 'T1H1 机会发现',
      typeEn: 'T1H1 Opportunity Discovery',
      scope: '来自Query生产',
      scopeEn: 'From Query Production',
      status: 'running',
      progress: 65,
      evaluators: 3,
      totalSamples: 100,
      completedSamples: 65,
      startTime: '2024-03-15 10:00',
      endTime: null,
      estimatedTime: 25,
      error: null
    },
    {
      id: 2,
      name: '标注结果盲评任务02',
      nameEn: 'Annotation Results Blind Evaluation Task 02',
      type: 'T2H2 趋势研判',
      typeEn: 'T2H2 Trend Analysis',
      scope: '来自数据标注',
      scopeEn: 'From Data Annotation',
      status: 'completed',
      progress: 100,
      evaluators: 5,
      totalSamples: 200,
      completedSamples: 200,
      startTime: '2024-03-10 14:30',
      endTime: '2024-03-15 17:00',
      estimatedTime: null,
      error: null
    },
    {
      id: 4,
      name: '综合质量盲评任务04',
      nameEn: 'General Quality Blind Evaluation Task 04',
      type: 'T4H1 机会发现',
      typeEn: 'T4H1 Opportunity Discovery',
      scope: '来自Query生产',
      scopeEn: 'From Query Production',
      status: 'pending',
      progress: 0,
      evaluators: 4,
      totalSamples: 80,
      completedSamples: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null
    }
  ]);

  const [currentEvaluation, setCurrentEvaluation] = useState({
    taskId: 1,
    currentIndex: 0,
    totalItems: 100,
    anonymousData: {
      queryId: 'EVAL-001',
      content: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
      type: 'T10H1 机会发现',
      isABTest: true,
      resultA: 'Step 1: Establish Narrative Alignment and Sector Positioning \nBegin by rigorously determining the token\'s core narrative alignment, as this forms the foundation for all subsequent comparative analysis. This involves a dual-track approach: first, conduct a deep-dive into the project\'s official documentation, whitepaper, and technical resources to extract its primary purpose, technology stack, and intended sector narrative (e.g., L1, DePIN, AI, RWA). Simultaneously, assess market perception by aggregating narrative tags from leading data aggregators (such as CoinGecko, Messari) and quantifying keyword associations in both official communications and organic social discourse.',
      resultB: 'Define and Segment the Peer Group for Benchmarking \nWith the narrative established, construct a robust peer set for benchmarking. Identify direct competitors by extracting all tokens categorized under the same primary narrative from aggregator APIs, then refine this set by segmenting according to market capitalization tiers (e.g., Large-Cap, Mid-Cap, Small-Cap) to ensure comparability. Further sub-segment by functional niche within the narrative (e.g., within DePIN, distinguish between Storage, Compute, Connectivity) to isolate the most relevant comparators.'
    },
    selectedResult: '',
    comments: ''
  });

  const [evaluationResults] = useState<EvaluationResult[]>([
    {
      id: 1,
      queryId: 'EVAL-001',
      content: 'Which narrative track does this token align with...',
      winningResult: 'A',
      evaluator: '盲评者001',
      evaluatorEn: 'Evaluator001',
      category: '机会发现',
      categoryEn: 'Opportunity Discovery'
    },
    {
      id: 2,
      queryId: 'EVAL-002',
      content: 'Why did BTC rise first and then fall after...',
      winningResult: 'B',
      evaluator: '盲评者002',
      evaluatorEn: 'Evaluator002',
      category: '趋势研判',
      categoryEn: 'Trend Analysis'
    },
    {
      id: 3,
      queryId: 'EVAL-003',
      content: 'What are the key factors driving...',
      winningResult: 'A',
      evaluator: '盲评者003',
      evaluatorEn: 'Evaluator003',
      category: '交易决策支持',
      categoryEn: 'Trading Decision Support'
    }
  ]);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'running':
        return <Tag color="processing">{t('running', language)}</Tag>;
      case 'completed':
        return <Tag color="success">{t('completed', language)}</Tag>;
      case 'pending':
        return <Tag color="default">{t('pending', language)}</Tag>;
      case 'exceptional':
        return <Tag color="error">{t('exceptional', language)}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const handleSaveEvaluation = () => {
    if (!currentEvaluation.selectedResult) {
      antdMessage.error(language === 'zh' ? '请选择一个结果' : 'Please select a result');
      return;
    }

    antdMessage.success(t('evaluationSaved', language));

    if (currentEvaluation.currentIndex < currentEvaluation.totalItems - 1) {
      setTimeout(() => {
        setCurrentEvaluation(prev => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          selectedResult: '',
          comments: ''
        }));
      }, 500);
    } else {
      setTimeout(() => {
        antdMessage.success(language === 'zh' ? '所有评估已完成！' : 'All evaluations completed!');
      }, 500);
    }
  };

  const taskColumns = [
    {
      title: language === 'zh' ? '任务信息' : 'Task Info',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: EvaluationTask) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {(language === 'zh' ? record.type : record.typeEn).split(' ')[0]}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {(language === 'zh' ? record.type : record.typeEn).split(' ').slice(1).join(' ')} • {record.totalSamples} {language === 'zh' ? '条Query' : 'Queries'}
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
      title: language === 'zh' ? '进度' : 'Progress',
      key: 'progress',
      render: (_: any, record: EvaluationTask) => (
        <div style={{ width: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>{record.completedSamples}/{record.totalSamples}</span>
            <span>{record.progress.toFixed(0)}%</span>
          </div>
          <Progress percent={record.progress} size="small" />
          {record.estimatedTime && (
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              {language === 'zh' ? `预计剩余 ${record.estimatedTime} 分钟` : `Estimated ${record.estimatedTime} min remaining`}
            </div>
          )}
        </div>
      )
    },
    {
      title: language === 'zh' ? '盲评状态' : 'Evaluation Status',
      key: 'status',
      render: (_: any, record: EvaluationTask) => getStatusTag(record.status)
    },
    {
      title: language === 'zh' ? '时间信息' : 'Time Info',
      key: 'time',
      render: (_: any, record: EvaluationTask) => (
        <div style={{ fontSize: '12px', color: '#666' }}>
          {record.startTime && (
            <div>{language === 'zh' ? '开始：' : 'Started: '}{record.startTime}</div>
          )}
          {record.endTime && (
            <div>{language === 'zh' ? '结束：' : 'Ended: '}{record.endTime}</div>
          )}
          {!record.startTime && (
            <div style={{ color: '#999' }}>
              {language === 'zh' ? '未开始' : 'Not started'}
            </div>
          )}
        </div>
      )
    },
    {
      title: language === 'zh' ? '操作' : 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: EvaluationTask) => (
        <Space size="small">
          {(record.status === 'pending' || record.status === 'running') && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => setActiveTab('workbench')}
            />
          )}
          {record.status === 'completed' && (
            <>
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => {
                  antdMessage.success(language === 'zh' ? '正在下载结果...' : 'Downloading results...');
                }}
              />
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => setActiveTab('results')}
              />
            </>
          )}
        </Space>
      )
    }
  ];

  const resultColumns = [
    {
      title: language === 'zh' ? 'Query内容' : 'Query Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxWidth: '400px' }} title={text}>
          <Text ellipsis>{text}</Text>
        </div>
      )
    },
    {
      title: language === 'zh' ? '获胜结果' : 'Winning Result',
      dataIndex: 'winningResult',
      key: 'winningResult',
      render: (result: string) => (
        <Tag color={result === 'A' ? 'blue' : 'green'}>
          {result === 'A'
            ? (language === 'zh' ? '蒸馏' : 'Distillation')
            : (language === 'zh' ? '标注' : 'Annotation')
          }
        </Tag>
      )
    },
    {
      title: language === 'zh' ? '盲评者' : 'Evaluator',
      dataIndex: 'evaluator',
      key: 'evaluator',
      render: (text: string, record: EvaluationResult) => (
        <Tag color="default">{language === 'zh' ? record.evaluator : record.evaluatorEn}</Tag>
      )
    },
    {
      title: t('category', language),
      dataIndex: 'category',
      key: 'category',
      render: (text: string, record: EvaluationResult) => (
        <Tag color="default">{language === 'zh' ? record.category : record.categoryEn}</Tag>
      )
    }
  ];

  const renderTaskListTab = () => (
    <div style={{ padding: '24px 0' }}>
      <Card
        title={language === 'zh' ? '盲评任务列表' : 'Evaluation Task List'}
        extra={
          <Text type="secondary">
            {language === 'zh' ? '管理和监控盲评任务进度' : 'Manage and monitor evaluation task progress'}
          </Text>
        }
      >
        <Table
          columns={taskColumns}
          dataSource={evaluationTasks}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: language === 'zh' ? '暂无盲评任务' : 'No evaluation tasks'
          }}
        />
      </Card>
    </div>
  );

  const renderWorkbenchTab = () => (
    <div style={{ padding: '24px 0' }}>
      <Card
        title={t('evaluatorWorkbench', language)}
        extra={
          <Text type="secondary">
            {language === 'zh' ? `任务进度：${currentEvaluation.currentIndex + 1}/${currentEvaluation.totalItems}` :
              `Task Progress: ${currentEvaluation.currentIndex + 1}/${currentEvaluation.totalItems}`}
          </Text>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Progress percent={(currentEvaluation.currentIndex + 1) / currentEvaluation.totalItems * 100} />

          <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Tag>{currentEvaluation.anonymousData.queryId}</Tag>
                <Tag color="blue">{currentEvaluation.anonymousData.type}</Tag>
              </div>
              <Paragraph style={{ fontSize: '14px', marginBottom: '16px' }}>
                {currentEvaluation.anonymousData.content}
              </Paragraph>

              {currentEvaluation.anonymousData.isABTest && (
                <Radio.Group
                  value={currentEvaluation.selectedResult}
                  onChange={(e) => setCurrentEvaluation(prev => ({ ...prev, selectedResult: e.target.value }))}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div
                      style={{
                        border: currentEvaluation.selectedResult === 'A' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        borderRadius: '8px',
                        padding: '16px',
                        backgroundColor: currentEvaluation.selectedResult === 'A' ? '#e6f7ff' : '#fff',
                        cursor: 'pointer',
                        height: '300px',
                        overflowY: 'auto'
                      }}
                      onClick={() => setCurrentEvaluation(prev => ({ ...prev, selectedResult: 'A' }))}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Text strong>{language === 'zh' ? '结果 A' : 'Result A'}</Text>
                        {currentEvaluation.selectedResult === 'A' && (
                          <CheckCircleOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                        )}
                      </div>
                      <Text style={{ fontSize: '13px', color: '#666' }}>
                        {currentEvaluation.anonymousData.resultA}
                      </Text>
                    </div>

                    <div
                      style={{
                        border: currentEvaluation.selectedResult === 'B' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        borderRadius: '8px',
                        padding: '16px',
                        backgroundColor: currentEvaluation.selectedResult === 'B' ? '#e6f7ff' : '#fff',
                        cursor: 'pointer',
                        height: '300px',
                        overflowY: 'auto'
                      }}
                      onClick={() => setCurrentEvaluation(prev => ({ ...prev, selectedResult: 'B' }))}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Text strong>{language === 'zh' ? '结果 B' : 'Result B'}</Text>
                        {currentEvaluation.selectedResult === 'B' && (
                          <CheckCircleOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                        )}
                      </div>
                      <Text style={{ fontSize: '13px', color: '#666' }}>
                        {currentEvaluation.anonymousData.resultB}
                      </Text>
                    </div>
                  </Space>
                </Radio.Group>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              disabled={currentEvaluation.currentIndex === 0}
              onClick={() => setCurrentEvaluation(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }))}
              icon={<LeftOutlined />}
            >
              {t('previousItem', language)}
            </Button>

            <Button
              type="primary"
              onClick={handleSaveEvaluation}
              disabled={!currentEvaluation.selectedResult}
              icon={<SaveOutlined />}
            >
              {t('save', language)}
            </Button>

            <Button
              disabled={currentEvaluation.currentIndex === currentEvaluation.totalItems - 1}
              onClick={() => setCurrentEvaluation(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }))}
            >
              {t('nextItem', language)}
              <RightOutlined />
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );

  const renderResultsTab = () => (
    <div style={{ padding: '24px 0' }}>
      <Card
        title={t('evaluationResults', language)}
        extra={
          <Button type="primary" icon={<DownloadOutlined />}>
            {t('downloadReport', language)}
          </Button>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>67%</div>
                <Text type="secondary">{language === 'zh' ? '蒸馏获胜率' : 'Distillation Win Rate'}</Text>
              </div>
            </Card>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>33%</div>
                <Text type="secondary">{language === 'zh' ? '标注获胜率' : 'Annotation Win Rate'}</Text>
              </div>
            </Card>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14' }}>3</div>
                <Text type="secondary">{language === 'zh' ? '已完成评估' : 'Completed Evaluations'}</Text>
              </div>
            </Card>
          </div>

          <Table
            columns={resultColumns}
            dataSource={evaluationResults}
            rowKey="id"
            pagination={false}
          />
        </Space>
      </Card>
    </div>
  );

  const tabItems = [
    {
      key: 'task-list',
      label: (
        <span>
          <EyeOutlined />
          {language === 'zh' ? ' 盲评任务列表' : ' Evaluation Task List'}
        </span>
      ),
      children: renderTaskListTab()
    },
    {
      key: 'workbench',
      label: (
        <span>
          <PlayCircleOutlined />
          {' '}{t('evaluationWorkbench', language)}
        </span>
      ),
      children: renderWorkbenchTab()
    },
    {
      key: 'results',
      label: (
        <span>
          <DownloadOutlined />
          {' '}{t('evaluationResults', language)}
        </span>
      ),
      children: renderResultsTab()
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          {t('blindEvaluationTitle', language)}
        </Title>
        <Paragraph type="secondary">
          {language === 'zh'
            ? '支持从Query生产、数据标注和数据蒸馏创建盲评任务，确保数据质量客观评估'
            : 'Support creating blind evaluation tasks from Query production, data annotation, and data distillation to ensure objective data quality assessment'}
        </Paragraph>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </div>
  );
};
