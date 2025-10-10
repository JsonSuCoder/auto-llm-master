import React, { useState } from 'react';
import { Card, Button, Table, Modal, Tag, Space, Typography, Input, message } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { Language } from '../utils/translations';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface AnnotationResultsProps {
  language: Language;
  taskId: number;
  taskName: string;
  onBack: () => void;
}

interface AnnotationResult {
  id: number;
  query: string;
  analysisResult: string;
  distillationStatus: string;
  annotationStatus: string;
  annotatedBy: string | null;
  annotatedAt: string | null;
}

export const AnnotationResults: React.FC<AnnotationResultsProps> = ({
  language,
  taskId,
  taskName,
  onBack
}) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<AnnotationResult | null>(null);
  const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<AnnotationResult | null>(null);
  const [annotationValue, setAnnotationValue] = useState('');

  const handleShowDetails = (result: AnnotationResult) => {
    setSelectedDetail(result);
    setIsDetailDialogOpen(true);
  };

  const handleAnnotationClick = (query: AnnotationResult) => {
    setSelectedQuery(query);
    setAnnotationValue(query.analysisResult);
    setIsAnnotationDialogOpen(true);
  };

  const handleAnnotationSubmit = () => {
    if (!annotationValue) {
      message.error(language === 'zh' ? '请输入分析结果' : 'Please enter analysis result');
      return;
    }
    message.success(language === 'zh' ? '标注已提交' : 'Annotation submitted');
    setIsAnnotationDialogOpen(false);
    setSelectedQuery(null);
    setAnnotationValue('');
  };

  const getStatusTag = (status: string, query?: AnnotationResult) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">{language === 'zh' ? '已完成' : 'Completed'}</Tag>;
      case 'pending':
        return (
          <Tag
            color="default"
            style={{ cursor: 'pointer' }}
            onClick={() => query && handleAnnotationClick(query)}
          >
            {language === 'zh' ? '待标注' : 'Pending'}
          </Tag>
        );
      case 'in_review':
        return <Tag color="processing">{language === 'zh' ? '审核中' : 'In Review'}</Tag>;
      case 'rejected':
        return <Tag color="error">{language === 'zh' ? '已驳回' : 'Rejected'}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getDistillationStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">{language === 'zh' ? '已完成' : 'Completed'}</Tag>;
      case 'processing':
        return <Tag color="processing">{language === 'zh' ? '处理中' : 'Processing'}</Tag>;
      case 'failed':
        return <Tag color="error">{language === 'zh' ? '失败' : 'Failed'}</Tag>;
      case 'pending':
        return <Tag color="default">{language === 'zh' ? '待处理' : 'Pending'}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Mock annotation results data
  const annotationResults: Record<number, AnnotationResult[]> = {
    1: [
      {
        id: 1,
        query: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
        analysisResult: language === 'zh'
          ? '该代币主要与AI基础设施赛道相关，在估值方面相对同行处于合理区间，具有一定投资价值。技术面显示突破关键阻力位，建议关注后续走势。'
          : 'This token is primarily related to AI infrastructure track, with valuation reasonably positioned compared to peers, showing investment value. Technical analysis indicates breakthrough of key resistance level, recommend monitoring subsequent trends.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '张三' : 'Zhang San',
        annotatedAt: '2024-03-15 14:30'
      },
      {
        id: 2,
        query: 'Why did BTC rise first and then fall after the September 5 NFP release?',
        analysisResult: language === 'zh'
          ? 'NFP数据发布前市场预期乐观推动BTC上涨，但实际数据超预期强劲，加剧了美联储鹰派预期，导致风险资产回调。建议关注后续货币政策信号。'
          : 'Market optimism before NFP release drove BTC up, but stronger-than-expected data intensified Fed hawkish expectations, leading to risk asset correction. Recommend monitoring subsequent monetary policy signals.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '李四' : 'Li Si',
        annotatedAt: '2024-03-15 15:45'
      },
      {
        id: 3,
        query: 'CPI will be released on July 15. What is the current market expectation, and how might BTC rise or fall under different CPI outcomes?',
        analysisResult: language === 'zh'
          ? '市场预期CPI同比3.1%，环比0.2%。若数据低于预期，BTC可能上涨至$32000；若高于预期，可能回调至$28000。建议设置止损位$29500。'
          : 'Market expects CPI at 3.1% YoY, 0.2% MoM. If below expectations, BTC may rise to $32,000; if above, may correct to $28,000. Recommend stop-loss at $29,500.',
        distillationStatus: 'processing',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      }
    ],
    2: [
      {
        id: 11,
        query: 'What are the key factors driving the recent surge in DeFi token prices?',
        analysisResult: language === 'zh'
          ? '主要驱动因素包括：1)机构资金流入增加；2)新协议上线带来的创新预期；3)整体流动性改善。建议重点关注TVL增长较快的项目。'
          : 'Key drivers include: 1) Increased institutional capital inflows; 2) Innovation expectations from new protocol launches; 3) Overall liquidity improvement. Recommend focusing on projects with rapid TVL growth.',
        distillationStatus: 'completed',
        annotationStatus: 'in_review',
        annotatedBy: language === 'zh' ? '赵六' : 'Zhao Liu',
        annotatedAt: '2024-03-15 17:10'
      }
    ]
  };

  const results = annotationResults[taskId] || [];

  const handleDownload = () => {
    const csvContent = [
      ['Query', 'Analysis Result', 'Distillation Status', 'Annotation Status', 'Annotated By', 'Annotated At'],
      ...results.map(result => [
        result.query,
        result.analysisResult,
        result.distillationStatus,
        result.annotationStatus,
        result.annotatedBy || '',
        result.annotatedAt || ''
      ])
    ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `annotation-results-${taskName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    link.click();

    message.success(language === 'zh' ? '导出成功' : 'Export successful');
  };

  const columns = [
    {
      title: language === 'zh' ? 'Query' : 'Query',
      dataIndex: 'query',
      key: 'query',
      width: '20%',
      ellipsis: true,
      render: (text: string, record: AnnotationResult) => (
        <div
          style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
          className="hover:bg-gray-100"
          onClick={() => handleShowDetails(record)}
          title={language === 'zh' ? '点击查看详情' : 'Click to view details'}
        >
          <Text ellipsis>{text}</Text>
        </div>
      )
    },
    {
      title: language === 'zh' ? '分析结果' : 'Analysis Result',
      dataIndex: 'analysisResult',
      key: 'analysisResult',
      width: '40%',
      ellipsis: true,
      render: (text: string) => <Text ellipsis>{text}</Text>
    },
    {
      title: language === 'zh' ? '蒸馏状态' : 'Distillation Status',
      dataIndex: 'distillationStatus',
      key: 'distillationStatus',
      width: '12%',
      render: (status: string) => getDistillationStatusTag(status)
    },
    {
      title: language === 'zh' ? '标注状态' : 'Annotation Status',
      dataIndex: 'annotationStatus',
      key: 'annotationStatus',
      width: '12%',
      render: (status: string, record: AnnotationResult) => getStatusTag(status, record)
    },
    {
      title: language === 'zh' ? '操作' : 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, record: AnnotationResult) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleShowDetails(record)}
        >
          {language === 'zh' ? '详情' : 'Details'}
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size="middle" align="center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {language === 'zh' ? '标注结果' : 'Annotation Results'}
              </Title>
              <Text type="secondary">
                {language === 'zh' ? `任务：${taskName}` : `Task: ${taskName}`}
              </Text>
            </div>
          </Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            {language === 'zh' ? '导出结果' : 'Export Results'}
          </Button>
        </div>

        {/* Results Table */}
        <Card
          title={language === 'zh' ? '标注结果' : 'Annotation Results'}
          extra={
            <Text type="secondary">
              {language === 'zh'
                ? `共找到 ${results.length} 条标注结果`
                : `Found ${results.length} annotation results`
              }
            </Text>
          }
        >
          <Table
            columns={columns}
            dataSource={results}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => language === 'zh' ? `共 ${total} 条` : `Total ${total} items`
            }}
            locale={{
              emptyText: language === 'zh' ? '暂无标注结果' : 'No annotation results available'
            }}
          />
        </Card>

        {/* Detail Modal */}
        <Modal
          title={language === 'zh' ? '标注详情' : 'Annotation Details'}
          open={isDetailDialogOpen}
          onCancel={() => setIsDetailDialogOpen(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setIsDetailDialogOpen(false)}>
              {language === 'zh' ? '关闭' : 'Close'}
            </Button>
          ]}
          width="90vw"
          style={{ top: 20 }}
          styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflowY: 'auto' } }}
        >
          {selectedDetail && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  {language === 'zh' ? 'Query:' : 'Query:'}
                </Title>
                <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedDetail.query}
                  </Paragraph>
                </div>
              </div>

              <div>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  {language === 'zh' ? '分析结果:' : 'Analysis Result:'}
                </Title>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedDetail.analysisResult}
                  </Paragraph>
                </div>
              </div>

              <div>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  {language === 'zh' ? '标注信息:' : 'Annotation Information:'}
                </Title>
                <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                        {language === 'zh' ? '标注状态:' : 'Annotation Status:'}
                      </Text>
                      {getStatusTag(selectedDetail.annotationStatus, selectedDetail)}
                    </div>

                    <div>
                      <Text strong style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                        {language === 'zh' ? '标注信息:' : 'Annotation Info:'}
                      </Text>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        <div>{language === 'zh' ? '标注者：' : 'Annotated by: '}{selectedDetail.annotatedBy || '-'}</div>
                        <div>{language === 'zh' ? '标注时间：' : 'Annotated at: '}{selectedDetail.annotatedAt || '-'}</div>
                      </div>
                    </div>
                  </Space>
                </div>
              </div>
            </Space>
          )}
        </Modal>

        {/* Annotation Dialog */}
        <Modal
          title={language === 'zh' ? '标注详情' : 'Annotation Details'}
          open={isAnnotationDialogOpen}
          onCancel={() => {
            setIsAnnotationDialogOpen(false);
            setAnnotationValue('');
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setIsAnnotationDialogOpen(false);
                setAnnotationValue('');
              }}
            >
              {language === 'zh' ? '取消' : 'Cancel'}
            </Button>,
            <Button key="submit" type="primary" onClick={handleAnnotationSubmit}>
              {language === 'zh' ? '提交标注' : 'Submit Annotation'}
            </Button>
          ]}
          width="90vw"
          style={{ top: 20 }}
          styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflowY: 'auto' } }}
        >
          {selectedQuery && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  {language === 'zh' ? 'Query:' : 'Query:'}
                </Title>
                <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <Paragraph style={{ margin: 0 }}>
                    {selectedQuery.query}
                  </Paragraph>
                </div>
              </div>

              <div>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  {language === 'zh' ? '分析结果:' : 'Analysis Result:'}
                </Title>
                <TextArea
                  rows={15}
                  value={annotationValue}
                  onChange={(e) => setAnnotationValue(e.target.value)}
                  placeholder={language === 'zh' ? '请输入分析结果...' : 'Please enter analysis result...'}
                />
              </div>
            </Space>
          )}
        </Modal>
      </Space>
    </div>
  );
};
