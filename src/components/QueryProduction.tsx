import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Tabs, Progress, message } from 'antd';
import { PlusOutlined, UploadOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Language, t } from '../utils/translations';
import QueryProductionDialog from './dialog/QueryProductionDialog';
import { getAllQueryTypes, QueryTypeItem } from '../api/querytype';
const { TabPane } = Tabs;
const { Option } = Select;

interface QueryProductionProps {
  language: Language;
}

export const QueryProduction: React.FC<QueryProductionProps> = ({ language }) => {
  const [selectedType, setSelectedType] = useState('');

  // Query types from API
  const [queryTypes, setQueryTypes] = useState<QueryTypeItem[]>([]);
  const [selectedQueryType, setSelectedQueryType] = useState<QueryTypeItem | null>(null);
  const [loadingQueryTypes, setLoadingQueryTypes] = useState(false);

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateCount, setGenerateCount] = useState(100);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newQuery, setNewQuery] = useState('');

  // Fetch query types from API
  useEffect(() => {
    const fetchQueryTypes = async () => {
      setLoadingQueryTypes(true);
      try {
        const response: any = await getAllQueryTypes();
        if (response.code === 200 && Array.isArray(response.queries)) {
          setQueryTypes(response.queries);
        }
      } catch (error) {
        message.error(language === 'zh' ? '获取Query类型失败' : 'Failed to fetch query types');
        console.error('Error fetching query types:', error);
      } finally {
        setLoadingQueryTypes(false);
      }
    };

    fetchQueryTypes();
  }, [language]);

  // Handle query type code selection
  const handleQueryTypeChange = (code: string) => {
    const queryType = queryTypes.find(qt => qt.code === code);
    if (queryType) {
      setSelectedQueryType(queryType);
      setSelectedType(code);
      // Update editable fields with current query type data
      setCurrentGuidance(queryType.guidance || '');
      setCurrentPrompt(queryType.prompt || '');
      setCurrentQuality(queryType.qualityStandard || '');
    }
  };
  const handleGenerateQueries = async () => {
    if (!selectedType || !selectedQueryType) {
      message.error(language === 'zh' ? '请选择Query类型编号' : 'Please select a Query type code');
      return;
    }

    setIsGenerating(true);

  };

  const handleAddQuery = () => {
    if (!selectedType || !newQuery) {
      message.error(language === 'zh' ? '请选择Query类型并输入内容' : 'Please select Query type and enter content');
      return;
    }
  };

  return (
    <div className='p-[24px] flex flex-col gap-[24px]'>
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
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>{language === 'zh' ? 'Query类型编号 (Query Type Code)' : 'Query Type Code'}</div>
            <Select
              style={{ width: '100%' }}
              value={selectedType}
              onChange={handleQueryTypeChange}
              placeholder={language === 'zh' ? '选择Query类型编号' : 'Select Query Type Code'}
              loading={loadingQueryTypes}
              showSearch
              optionFilterProp="children"
            >
              {queryTypes.map((queryType) => (
                <Option key={queryType.code} value={queryType.code}>
                  {queryType.code} - {queryType.description}
                </Option>
              ))}
            </Select>
          </div>

          {/* Display read-only information */}
          {selectedQueryType && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontWeight: 500, color: 'rgba(0, 0, 0, 0.45)' }}>
                    {language === 'zh' ? '一级场景 (S):' : 'L1 Scene (S):'}
                  </span>
                  <span style={{ marginLeft: '8px' }}>{selectedQueryType.L1_SCENE_ID}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 500, color: 'rgba(0, 0, 0, 0.45)' }}>
                    {language === 'zh' ? '二级场景 (T):' : 'L2 Scene (T):'}
                  </span>
                  <span style={{ marginLeft: '8px' }}>{selectedQueryType.L2_SCENE_ID}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 500, color: 'rgba(0, 0, 0, 0.45)' }}>
                    {language === 'zh' ? '三级场景 (H):' : 'L3 Scene (H):'}
                  </span>
                  <span style={{ marginLeft: '8px' }}>{selectedQueryType.L3_SCENE_ID}</span>
                </div>
              </div>
              <div>
                <span style={{ fontWeight: 500, color: 'rgba(0, 0, 0, 0.45)' }}>
                  {language === 'zh' ? '描述:' : 'Description:'}
                </span>
                <span style={{ marginLeft: '8px' }}>{selectedQueryType.description}</span>
              </div>
            </div>
          )}
        </div>

        {selectedType && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
            <Card
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{t('guidance', language)}</span>
                </div>
              }
              style={{ backgroundColor: '#e6f7ff' }}
            >
              <div className='text-black/65 text-[14px] max-h-[300px] overflow-auto'>
                {currentGuidance}
              </div>
            </Card>

            <Card
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{language === 'zh' ? '提示语模板' : 'Prompt Template'}</span>
                </div>
              }
              style={{ backgroundColor: '#f6ffed' }}
            >
              <div className='text-black/65 text-[14px] max-h-[300px] overflow-auto'>
                {currentPrompt}
              </div>
            </Card>

            <Card
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{t('qualityStandard', language)}</span>
                </div>
              }
              style={{ backgroundColor: '#f9f0ff' }}
            >
              <div className='text-black/65 text-[14px] max-h-[300px] overflow-auto'>
                {currentQuality.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
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