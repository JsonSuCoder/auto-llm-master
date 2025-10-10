import React, { useState } from 'react';
import { Card, Button, Table, Modal, Tag, Space, Typography, message } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { Language } from '../utils/translations';

const { Title, Text, Paragraph } = Typography;

interface DistillationResultsProps {
  language: Language;
  taskId: number;
  taskName: string;
  onBack: () => void;
}

interface Result {
  id: number;
  query: string;
  analysis: string;
  distillationStatus: string;
  annotationStatus: string;
}

export const DistillationResults: React.FC<DistillationResultsProps> = ({
  language,
  taskId,
  taskName,
  onBack
}) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<Result | null>(null);

  const handleShowDetails = (result: Result) => {
    setSelectedDetail(result);
    setIsDetailDialogOpen(true);
  };

  const getDistillationStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">{language === 'zh' ? '已完成' : 'Completed'}</Tag>;
      case 'processing':
        return <Tag color="processing">{language === 'zh' ? '处理中' : 'Processing'}</Tag>;
      case 'pending':
        return <Tag color="default">{language === 'zh' ? '待处理' : 'Pending'}</Tag>;
      case 'failed':
        return <Tag color="error">{language === 'zh' ? '失败' : 'Failed'}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getAnnotationStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">{language === 'zh' ? '已标注' : 'Annotated'}</Tag>;
      case 'pending':
        return <Tag color="default">{language === 'zh' ? '待标注' : 'Pending'}</Tag>;
      case 'in_review':
        return <Tag color="processing">{language === 'zh' ? '审核中' : 'In Review'}</Tag>;
      case 'not_required':
        return <Tag color="default">{language === 'zh' ? '无需标注' : 'Not Required'}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const newAnalysisText = `Step 1: Establish Narrative Alignment and Sector Positioning
Begin by rigorously determining the token's core narrative alignment, as this forms the foundation for all subsequent comparative analysis. This involves a dual-track approach: first, conduct a deep-dive into the project's official documentation, whitepaper, and technical resources to extract its primary purpose, technology stack, and intended sector narrative (e.g., L1, DePIN, AI, RWA). Simultaneously, assess market perception by aggregating narrative tags from leading data aggregators (such as CoinGecko, Messari) and quantifying keyword associations in both official communications and organic social discourse. This triangulation ensures that both the project's self-identified narrative and the prevailing market-assigned narrative are captured, with discrepancies flagged for further scrutiny. Dominant narrative alignment should be weighted by resource allocation and marketing focus, while secondary alignments are noted for context. This step is critical because accurate narrative placement determines the relevant competitive landscape and frames all peer comparisons.

Step 2: Define and Segment the Peer Group for Benchmarking
With the narrative established, construct a robust peer set for benchmarking. Identify direct competitors by extracting all tokens categorized under the same primary narrative from aggregator APIs, then refine this set by segmenting according to market capitalization tiers (e.g., Large-Cap, Mid-Cap, Small-Cap) to ensure comparability. Further sub-segment by functional niche within the narrative (e.g., within DePIN, distinguish between Storage, Compute, Connectivity) to isolate the most relevant comparators. Manual verification of the top 5–10 closest peers based on business model and product delivery is essential to mitigate inconsistent aggregator tagging and to exclude outliers or projects lacking sufficient operational history. This segmentation is foundational for "apples-to-apples" analysis and ensures that all subsequent metrics are interpreted within an appropriate competitive context.

Step 3: Quantify Hype, Community Quality, and Market Depth
Assess the scale and authenticity of attention surrounding the token by analyzing discussion volume, engagement quality, and diffusion structure across primary community platforms (X/Twitter, Discord, Telegram). Calculate Share of Voice (SOV) relative to the peer set over both short (7d) and long (30d) windows, and measure Quality Engagement Rate (QER) to distinguish genuine technical or product-focused interactions from low-value or incentivized activity. Passive mention ratios and cross-circle penetration (across regions, KOL types, and languages) are used to filter out manufactured hype and identify organic momentum. Durability is evaluated via half-life and 7-day extension rates post-peak. This step is crucial because it distinguishes between transient, campaign-driven spikes and sustained, authentic community traction, which are leading indicators of narrative stickiness and conversion potential.

Step 4: Evaluate User Growth, Retention, and Community Health
Analyze user acquisition and retention metrics to determine whether observed growth translates into a resilient, self-sustaining community. Track net follower growth and retention rates (e.g., R30 for X/Twitter, R7 for Telegram), and cross-verify with Discord activity rates, support responsiveness, and knowledge deposit frequency. Assess message distribution (Gini coefficient) and multi-turn conversation rates to gauge depth of engagement. This multi-platform, retention-focused approach ensures that growth is not merely superficial "traffic" but reflects genuine community formation, which is a prerequisite for long-term ecosystem vitality and product adoption.

Step 5: Analyze Sector-Specific Demand and On-Chain Fundamentals
Select and benchmark 2–3 sector-relevant, demand-side metrics that best capture the project's real-world traction and economic health. For infrastructure tokens, this may include paid gas usage, contract deployments, and cross-chain net inflows; for DeFi, volume/TVL utilization, fee generation, and order book depth; for social/gaming/AI, user retention curves and ARPU/ARPPU. Compare these metrics against the peer set, aligning time windows with key narrative events (e.g., listings, airdrops) to assess whether hype translates into measurable demand. This step is vital for validating that narrative momentum is underpinned by substantive, on-chain user and economic activity, rather than speculative or promotional cycles.

Step 6: Assess Ecosystem Vitality, Development, and Governance
Evaluate the project's long-term viability by examining development activity (active developers, external PRs, release cadence), integration velocity (announcement-to-production deployment time, hackathon-to-mainnet conversion), and ecosystem self-drive (external proposals, grant conversion rates, redundancy in key positions). Analyze TVL quality (native vs. mercenary capital), cross-chain inflows, and governance decentralization (multisig, timelock, audit status). Identify green flags (e.g., passive integration growth, stable release rhythm) and red flags (e.g., logo wall without production integrations, single-point control). This comprehensive ecosystem assessment provides insight into the project's capacity for sustained innovation, resilience, and organic expansion beyond initial hype cycles.`;

  // Mock distillation results data
  const distillationResults: Record<number, Result[]> = {
    1: [
      {
        id: 1,
        query: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
        analysis: newAnalysisText,
        distillationStatus: 'completed',
        annotationStatus: 'pending'
      },
      {
        id: 2,
        query: 'Why did BTC rise first and then fall after the September 5 NFP release?',
        analysis: newAnalysisText,
        distillationStatus: 'completed',
        annotationStatus: 'pending'
      },
      {
        id: 3,
        query: 'CPI will be released on July 15. What is the current market expectation, and how might BTC rise or fall under different CPI outcomes?',
        analysis: newAnalysisText,
        distillationStatus: 'processing',
        annotationStatus: 'pending'
      }
    ],
    2: [
      {
        id: 4,
        query: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
        analysis: newAnalysisText,
        distillationStatus: 'completed',
        annotationStatus: 'pending'
      },
      {
        id: 5,
        query: 'Why did BTC rise first and then fall after the September 5 NFP release?',
        analysis: newAnalysisText,
        distillationStatus: 'failed',
        annotationStatus: 'pending'
      }
    ]
  };

  const results = distillationResults[taskId] || [];

  const handleDownload = () => {
    const csvContent = [
      ['Query', 'Analysis', 'Distillation Status', 'Annotation Status'],
      ...results.map(result => [result.query, result.analysis, result.distillationStatus, result.annotationStatus])
    ].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `distillation-results-${taskName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    link.click();

    message.success(language === 'zh' ? '导出成功' : 'Export successful');
  };

  const columns = [
    {
      title: language === 'zh' ? 'Query' : 'Query',
      dataIndex: 'query',
      key: 'query',
      width: '33%',
      ellipsis: true,
      render: (text: string, record: Result) => (
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
      title: language === 'zh' ? '分析结果' : 'Analysis',
      dataIndex: 'analysis',
      key: 'analysis',
      width: '33%',
      ellipsis: true,
      render: (text: string, record: Result) => (
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
      render: (status: string) => getAnnotationStatusTag(status)
    },
    {
      title: language === 'zh' ? '操作' : 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, record: Result) => (
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
                {language === 'zh' ? '蒸馏结果' : 'Distillation Results'}
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
          title={language === 'zh' ? '蒸馏结果' : 'Distillation Results'}
          extra={
            <Text type="secondary">
              {language === 'zh'
                ? `共找到 ${results.length} 条蒸馏结果`
                : `Found ${results.length} distillation results`
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
              emptyText: language === 'zh' ? '暂无蒸馏结果' : 'No distillation results available'
            }}
          />
        </Card>

        {/* Detail Modal */}
        <Modal
          title={language === 'zh' ? '详细内容' : 'Detail Content'}
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
                  {language === 'zh' ? '分析结果:' : 'Analysis:'}
                </Title>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedDetail.analysis}
                  </Paragraph>
                </div>
              </div>

              <div>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  {language === 'zh' ? '状态信息:' : 'Status Information:'}
                </Title>
                <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                        {language === 'zh' ? '蒸馏状态:' : 'Distillation Status:'}
                      </Text>
                      {getDistillationStatusTag(selectedDetail.distillationStatus)}
                    </div>

                    <div>
                      <Text strong style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                        {language === 'zh' ? '标注状态:' : 'Annotation Status:'}
                      </Text>
                      {getAnnotationStatusTag(selectedDetail.annotationStatus)}
                    </div>
                  </Space>
                </div>
              </div>
            </Space>
          )}
        </Modal>
      </Space>
    </div>
  );
};
