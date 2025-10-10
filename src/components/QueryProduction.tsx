import React, { useState } from 'react';
import { Card, Button, Input, Select, Tabs, Progress, Table, Badge, message } from 'antd';
import { PlusOutlined, UploadOutlined, FileTextOutlined, SearchOutlined, EditOutlined, CheckOutlined, CloseOutlined, StarOutlined, ExclamationCircleOutlined, DownloadOutlined, FilterOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Language, t } from '../utils/translations';
import QueryProductionDialog from './dialog/QueryProductionDialog';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

interface QueryProductionProps {
  language: Language;
}

// 定义查询类型接口
interface QueryType {
  id: number;
  type: string;
  content: string;
  score: number | null;
  status: string;
  autoEvaluated: boolean;
  createdAt: string;
  confirmedBy: string | null;
}

export const QueryProduction: React.FC<QueryProductionProps> = ({ language }) => {
  const [selectedType, setSelectedType] = useState('');
  
  // 三级联动选择框状态
  const [selectedQueryNumber, setSelectedQueryNumber] = useState('');
  const [selectedSecondLevel, setSelectedSecondLevel] = useState('');
  const [selectedThirdLevel, setSelectedThirdLevel] = useState('');
  
  // 编辑相关状态
  const [isEditingGuidance, setIsEditingGuidance] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isEditingQuality, setIsEditingQuality] = useState(false);
  const [editGuidanceText, setEditGuidanceText] = useState('');
  const [editPromptText, setEditPromptText] = useState('');
  const [editQualityText, setEditQualityText] = useState('');
  
  // 存储当前内容
  const [currentGuidance, setCurrentGuidance] = useState(
    language === 'zh'
      ? '生成自然的问答对话，包含问题和标准答案，确保问题具有明确性和答案的准确性。'
      : 'Generate natural Q&A conversations, including questions and standard answers, ensuring questions are clear and answers are accurate.'
  );
  const [currentPrompt, setCurrentPrompt] = useState(
    language === 'zh'
      ? '请生成一个关于{topic}的问答对话，要求问题清晰明确，答案准确详细。'
      : 'Please generate a Q&A conversation about {topic}, with clear questions and detailed accurate answers.'
  );
  const [currentQuality, setCurrentQuality] = useState(
    language === 'zh'
      ? '• 问题表述清晰无歧义\n• 答案准确且完整\n• 语言自然流畅'
      : '• Questions are clear and unambiguous\n• Answers are accurate and complete\n• Language is natural and fluent'
  );
  
  const [queries, setQueries] = useState<QueryType[]>([
    {
      id: 1,
      type: language === 'zh' ? 'QT002+趋势研判' : 'QT002+Trend Analysis',
      content: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
      score: 8.5,
      status: 'confirmed',
      autoEvaluated: true,
      createdAt: '2024-03-15 14:30',
      confirmedBy: language === 'zh' ? '张三' : 'Zhang San'
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateCount, setGenerateCount] = useState(100);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newQuery, setNewQuery] = useState('');

  // 三级联动数据结构 - 重构为以二级场景为key
  const cascadeData = {
    [language === 'zh' ? '机会发现' : 'Opportunity Discovery']: {
      thirdLevel: [
        { value: 'rwa', label: 'RWA' },
        { value: 'general', label: language === 'zh' ? '综合 (General)' : 'General' },
        { value: 'bluechip', label: language === 'zh' ? '主流蓝筹 (Blue-Chip)' : 'Blue-Chip' }
      ],
      queryNumbers: [
        { value: 'T10H1', label: 'T10H1' }
      ]
    },
    [language === 'zh' ? '趋势研判' : 'Trend Analysis']: {
      thirdLevel: [
        { value: 'rwa', label: 'RWA' },
        { value: 'general', label: language === 'zh' ? '综合 (General)' : 'General' },
        { value: 'bluechip', label: language === 'zh' ? '主流蓝筹 (Blue-Chip)' : 'Blue-Chip' }
      ],
      queryNumbers: [
        { value: 'T10H2', label: 'T10H2' }
      ]
    },
    [language === 'zh' ? '交易决策支持' : 'Trading Decision Support']: {
      thirdLevel: [
        { value: 'rwa', label: 'RWA' },
        { value: 'general', label: language === 'zh' ? '综合 (General)' : 'General' },
        { value: 'bluechip', label: language === 'zh' ? '主流蓝筹 (Blue-Chip)' : 'Blue-Chip' }
      ],
      queryNumbers: [
        { value: 'T10H3', label: 'T10H3' }
      ]
    }
  };

  const secondLevelOptions = [
    { value: language === 'zh' ? '机会发现' : 'Opportunity Discovery', label: language === 'zh' ? '机会发现' : 'Opportunity Discovery' },
    { value: language === 'zh' ? '趋势研判' : 'Trend Analysis', label: language === 'zh' ? '趋势研判' : 'Trend Analysis' },
    { value: language === 'zh' ? '交易决策支持' : 'Trading Decision Support', label: language === 'zh' ? '交易决策支持' : 'Trading Decision Support' }
  ];
  
  // 级联选择处理函数 - 重构为新的顺序
  const handleSecondLevelChange = (value: string) => {
    setSelectedSecondLevel(value);
    setSelectedThirdLevel('');
    setSelectedQueryNumber('');
    // 清空类型选择
    setSelectedType('');
  };

  const handleThirdLevelChange = (value: string) => {
    setSelectedThirdLevel(value);
    setSelectedQueryNumber('');
    // 清空类型选择
    setSelectedType('');
  };

  const handleQueryNumberChange = (value: string) => {
    setSelectedQueryNumber(value);
    // 组合成完整的类型值
    if (selectedSecondLevel && selectedThirdLevel && value) {
      const fullType = `${value}+${selectedSecondLevel}`;
      setSelectedType(fullType);
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || query.status === filterStatus;
    const matchesType = !selectedType || query.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleGenerateQueries = async () => {
    if (!selectedSecondLevel || !selectedThirdLevel || !selectedQueryNumber) {
      message.error(language === 'zh' ? '请完成三级选择：二级场景、三级场景和Query编号' : 'Please complete all three levels: Second Level, Third Level, and Query Number');
      return;
    }

    setIsGenerating(true);
    
    // 模拟生成过程
    setTimeout(() => {
      const newQueries = Array.from({ length: generateCount }, (_, index) => ({
        id: queries.length + index + 1,
        type: selectedType,
        content: language === 'zh' 
          ? `自动生成的${selectedType}内容 ${index + 1}`
          : `Auto-generated ${selectedType} content ${index + 1}`,
        score: Math.random() * 4 + 6, // 6-10分
        status: Math.random() > 0.3 ? 'pending' : 'rejected',
        autoEvaluated: false,
        createdAt: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US'),
        confirmedBy: null
      }));

      setQueries([...queries, ...newQueries]);
      setIsGenerating(false);
      message.success(t('generateSuccess', language, { count: generateCount.toString() }));
    }, 3000);
  };

  const handleAddQuery = () => {
    if (!selectedType || !newQuery) {
      message.error(language === 'zh' ? '请选择Query类型并输入内容' : 'Please select Query type and enter content');
      return;
    }

    const query: QueryType = {
      id: queries.length + 1,
      type: selectedType,
      content: newQuery,
      score: null,
      status: 'draft',
      autoEvaluated: false,
      createdAt: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US'),
      confirmedBy: null
    };

    setQueries([...queries, query]);
    setNewQuery('');
    setIsAddDialogOpen(false);
    message.success(t('queryAddSuccess', language));
  };

  const handleConfirmQuery = (queryId: number) => {
    setQueries(queries.map(query =>
      query.id === queryId
        ? { ...query, status: 'confirmed', confirmedBy: language === 'zh' ? '当前用户' : 'Current User' }
        : query
    ));
    message.success(t('queryConfirmed', language));
  };

  const handleRejectQuery = (queryId: number) => {
    setQueries(queries.map(query =>
      query.id === queryId
        ? { ...query, status: 'rejected' }
        : query
    ));
    message.success(t('queryRejected', language));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge color="green" text={t('confirmed', language)} />;
      case 'pending':
        return <Badge color="gold" text={t('pending', language)} />;
      case 'rejected':
        return <Badge color="red" text={t('rejected', language)} />;
      case 'draft':
        return <Badge color="default" text={language === 'zh' ? '草稿' : 'Draft'} />;
      default:
        return <Badge color="blue" text={status} />;
    }
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return null;
    const color = score >= 8 ? 'green' : score >= 7 ? 'gold' : 'red';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: color === 'green' ? '#52c41a' : color === 'gold' ? '#faad14' : '#f5222d' }}>
        <StarOutlined style={{ fontSize: '12px' }} />
        <span style={{ fontSize: '12px', fontWeight: 500 }}>{score.toFixed(1)}</span>
      </div>
    );
  };

  // 编辑处理函数
  const handleEditGuidance = () => {
    setEditGuidanceText(currentGuidance);
    setIsEditingGuidance(true);
  };

  const handleEditPrompt = () => {
    setEditPromptText(currentPrompt);
    setIsEditingPrompt(true);
  };

  const handleEditQuality = () => {
    setEditQualityText(currentQuality);
    setIsEditingQuality(true);
  };

  const handleSaveGuidance = () => {
    setCurrentGuidance(editGuidanceText);
    setIsEditingGuidance(false);
    message.success(language === 'zh' ? '生产指引已更新' : 'Guidance updated successfully');
  };

  const handleSavePrompt = () => {
    setCurrentPrompt(editPromptText);
    setIsEditingPrompt(false);
    message.success(language === 'zh' ? '提示语模板已更新' : 'Prompt template updated successfully');
  };

  const handleSaveQuality = () => {
    setCurrentQuality(editQualityText);
    setIsEditingQuality(false);
    message.success(language === 'zh' ? '质量标准已更新' : 'Quality standard updated successfully');
  };

  // 一键评判功能
  const handleBatchEvaluate = () => {
    const unevaluatedQueries = queries.filter(query => !query.autoEvaluated);
    
    if (unevaluatedQueries.length === 0) {
      message.info(language === 'zh' ? '所有Query已完成自动评判' : 'All queries have been auto-evaluated');
      return;
    }

    message.info(language === 'zh' ? `开始评判${unevaluatedQueries.length}条Query...` : `Starting evaluation of ${unevaluatedQueries.length} queries...`);
    
    // 模拟批量评判过程
    setTimeout(() => {
      setQueries(prevQueries => 
        prevQueries.map(query => 
          !query.autoEvaluated 
            ? { 
                ...query, 
                autoEvaluated: true,
                score: query.score || Math.random() * 4 + 6 // 6-10分
              }
            : query
        )
      );
      
      message.success(language === 'zh' ? `成功完成${unevaluatedQueries.length}条Query的自动评判` : `Successfully completed auto-evaluation of ${unevaluatedQueries.length} queries`);
    }, 2000);
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: t('type', language),
      dataIndex: 'type',
      key: 'type',
      width: 180,
    },
    {
      title: t('content', language),
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: t('score', language),
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score) => getScoreBadge(score),
    },
    {
      title: t('status', language),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusBadge(status),
    },
    {
      title: t('createdAt', language),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: t('actions', language),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {record.status !== 'confirmed' && (
            <Button 
              type="text" 
              icon={<CheckOutlined />} 
              size="small" 
              onClick={() => handleConfirmQuery(record.id)}
              style={{ color: '#52c41a' }}
            />
          )}
          {record.status !== 'rejected' && (
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              size="small" 
              onClick={() => handleRejectQuery(record.id)}
              style={{ color: '#f5222d' }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 类型选择和信息展示 */}
      <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileTextOutlined />
          {t('queryProduction', language)}
        </div>
      }>
        <div style={{ marginBottom: '16px', color: 'rgba(0, 0, 0, 0.45)' }}>
          {language === 'zh' 
            ? '选择Query类型，通过批量生成、上传或手动录入的方式生产高质量Query'
            : 'Select Query type, produce high-quality Queries through batch generation, upload or manual entry'
          }
        </div>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>{t('selectQueryType', language)}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* 第一级：二级场景 */}
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px' }}>{language === 'zh' ? '二级场景 (提问动机-H)' : 'Second Level (Motivation-H)'}</div>
              <Select
                style={{ width: '100%' }}
                value={selectedSecondLevel}
                onChange={handleSecondLevelChange}
                placeholder={language === 'zh' ? '选择场景' : 'Select Scenario'}
              >
                {secondLevelOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            
            {/* 第二级：三级场景 */}
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px' }}>{language === 'zh' ? '三级场景（赛道-T）' : 'Third Level (Track-T)'}</div>
              <Select
                style={{ width: '100%' }}
                value={selectedThirdLevel}
                onChange={handleThirdLevelChange}
                disabled={!selectedSecondLevel}
                placeholder={language === 'zh' ? '选择赛道' : 'Select Track'}
              >
                {selectedSecondLevel && cascadeData[selectedSecondLevel]?.thirdLevel.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            
            {/* 第三级：Query编号 */}
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px' }}>{language === 'zh' ? 'Query编号' : 'Query Number'}</div>
              <Select
                style={{ width: '100%' }}
                value={selectedQueryNumber}
                onChange={handleQueryNumberChange}
                disabled={!selectedThirdLevel}
                placeholder={language === 'zh' ? '选择编号' : 'Select Number'}
              >
                {selectedSecondLevel && cascadeData[selectedSecondLevel]?.queryNumbers.map((number) => (
                  <Option key={number.value} value={number.value}>
                    {number.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {selectedType && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
            <Card
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{t('guidance', language)}</span>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={handleEditGuidance}
                    style={{ padding: 0 }}
                  />
                </div>
              }
              style={{ backgroundColor: '#e6f7ff' }}
            >
              {isEditingGuidance ? (
                <div>
                  <TextArea
                    value={editGuidanceText}
                    onChange={(e) => setEditGuidanceText(e.target.value)}
                    rows={4}
                    style={{ marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button size="small" onClick={() => setIsEditingGuidance(false)}>
                      {t('cancel', language)}
                    </Button>
                    <Button size="small" type="primary" onClick={handleSaveGuidance}>
                      {t('save', language)}
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', fontSize: '14px' }}>
                  {currentGuidance}
                </div>
              )}
            </Card>

            <Card
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{language === 'zh' ? '提示语模板' : 'Prompt Template'}</span>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={handleEditPrompt}
                    style={{ padding: 0 }}
                  />
                </div>
              }
              style={{ backgroundColor: '#f6ffed' }}
            >
              {isEditingPrompt ? (
                <div>
                  <TextArea
                    value={editPromptText}
                    onChange={(e) => setEditPromptText(e.target.value)}
                    rows={4}
                    style={{ marginBottom: '8px', fontFamily: 'monospace' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button size="small" onClick={() => setIsEditingPrompt(false)}>
                      {t('cancel', language)}
                    </Button>
                    <Button size="small" type="primary" onClick={handleSavePrompt}>
                      {t('save', language)}
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', fontSize: '14px', fontFamily: 'monospace' }}>
                  {currentPrompt}
                </div>
              )}
            </Card>

            <Card
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{t('qualityStandard', language)}</span>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={handleEditQuality}
                    style={{ padding: 0 }}
                  />
                </div>
              }
              style={{ backgroundColor: '#f9f0ff' }}
            >
              {isEditingQuality ? (
                <div>
                  <TextArea
                    value={editQualityText}
                    onChange={(e) => setEditQualityText(e.target.value)}
                    rows={4}
                    style={{ marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button size="small" onClick={() => setIsEditingQuality(false)}>
                      {t('cancel', language)}
                    </Button>
                    <Button size="small" type="primary" onClick={handleSaveQuality}>
                      {t('save', language)}
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', fontSize: '14px' }}>
                  {currentQuality.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </Card>

      {/* 生产操作 */}
      {selectedType && (
        <Card title={t('productionOperations', language)}>
          <Tabs defaultActiveKey="generate">
            <TabPane tab={t('batchGeneration', language)} key="generate">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ marginBottom: '8px' }}>{t('generateCount', language)}</div>
                  <Input
                    type="number"
                    value={generateCount}
                    onChange={(e) => setGenerateCount(Number(e.target.value))}
                    min="1"
                    max="500"
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button 
                    type="primary"
                    onClick={handleGenerateQueries} 
                    disabled={isGenerating}
                    style={{ width: '100%' }}
                    icon={<ThunderboltOutlined />}
                  >
                    {isGenerating ? t('generating', language) : t('startGeneration', language)}
                  </Button>
                </div>
              </div>
              
              {isGenerating && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span>{language === 'zh' ? '正在生成Query...' : 'Generating Queries...'}</span>
                    <span>{t('estimatedCompletion', language)}</span>
                  </div>
                  <Progress percent={33} />
                </div>
              )}
            </TabPane>

            <TabPane tab={t('batchUpload', language)} key="upload">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', border: '1px dashed #d9d9d9', borderRadius: '2px' }}>
                <UploadOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                <div style={{ marginBottom: '16px' }}>{t('dragOrClickUpload', language)}</div>
                <Button icon={<UploadOutlined />}>{t('selectFile', language)}</Button>
              </div>
            </TabPane>

            <TabPane tab={t('singleEntry', language)} key="manual">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  {t('addQuery', language)}
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      )}

      {/* 查询列表 */}
      <Card 
        title={t('queryList', language)}
        extra={
          <Button 
            type="primary" 
            icon={<ThunderboltOutlined />}
            onClick={handleBatchEvaluate}
          >
            {t('batchEvaluate', language)}
          </Button>
        }
      >
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Input 
            placeholder={t('searchQuery', language)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
            prefix={<SearchOutlined />}
          />
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            style={{ width: '150px' }}
          >
            <Option value="all">{t('allStatus', language)}</Option>
            <Option value="confirmed">{t('confirmed', language)}</Option>
            <Option value="pending">{t('pending', language)}</Option>
            <Option value="rejected">{t('rejected', language)}</Option>
            <Option value="draft">{language === 'zh' ? '草稿' : 'Draft'}</Option>
          </Select>
        </div>

        <Table 
          dataSource={filteredQueries} 
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `${t('total', language)}: ${total}`,
          }}
        />
      </Card>

      {/* 添加查询对话框 */}
      <QueryProductionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddQuery}
        newQuery={newQuery}
        setNewQuery={setNewQuery}
        language={language}
      />
    </div>
  );
};