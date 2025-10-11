import React, { useState, useEffect } from 'react';
import { Modal, Select, InputNumber, Space, Typography, Input, message } from 'antd';
import { Language, t } from '../../utils/translations';
import { QueryTypeItem, getAllQueryTypes } from '../../api/querytype';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CreateDistillationTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    selectedType: string;
    selectedQueryType: QueryTypeItem | null;
    selectedQueries: number[];
    distillationPrompt: string;
  }) => void;
  language: Language;
}

const CreateDistillationTaskDialog: React.FC<CreateDistillationTaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  language
}) => {
  // Internal state
  const [selectedType, setSelectedType] = useState('');
  const [selectedQueries, setSelectedQueries] = useState<number[]>([]);
  const [distillationPrompt, setDistillationPrompt] = useState('');
  const [queryTypes, setQueryTypes] = useState<QueryTypeItem[]>([]);
  const [selectedQueryType, setSelectedQueryType] = useState<QueryTypeItem | null>(null);
  const [loadingQueryTypes, setLoadingQueryTypes] = useState(false);

  // Fetch query types from API
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, language]);

  // Handle query type code selection
  const handleQueryTypeChange = (code: string) => {
    const queryType = queryTypes.find(qt => qt.code === code);
    if (queryType) {
      setSelectedQueryType(queryType);
      setSelectedType(code);
      // Update distillation prompt if available
      if (queryType.distilledPrompt) {
        setDistillationPrompt(queryType.distilledPrompt);
      }
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (!selectedType || selectedQueries.length === 0) {
      message.error(language === 'zh' ? '请选择Query类型并设置蒸馏数量' : 'Please select query type and set distillation count');
      return;
    }

    onSubmit({
      selectedType,
      selectedQueryType,
      selectedQueries,
      distillationPrompt
    });

    // Reset form
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setSelectedType('');
    setSelectedQueries([]);
    setDistillationPrompt('');
    setSelectedQueryType(null);
    onClose();
  };

  return (
    <Modal
      title={t('createDistillationTask', language)}
      open={isOpen}
      onCancel={handleClose}
      onOk={handleSubmit}
      width="100vw"
      style={{ top: 0, maxWidth: '100vw', paddingBottom: 0 }}
      styles={{ body: { height: 'calc(100vh - 110px)', overflowY: 'auto' } }}
      okText={t('createTask', language)}
      cancelText={t('cancel', language)}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Query类型选择 */}
        <div>
          <Title level={5}>{language === 'zh' ? 'Query类型' : 'Query Type'}</Title>

          <div style={{ marginBottom: '8px', fontSize: '14px' }}>
            {language === 'zh' ? 'Query类型编号 (Query Type Code)' : 'Query Type Code'}
          </div>
          <Select
            style={{ width: '100%' }}
            value={selectedType || undefined}
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

        {/* Query数据配置模块 */}
        <div>
          <Title level={5} style={{ margin: 0, marginBottom: '16px' }}>
            {language === 'zh' ? 'Query数据配置' : 'Query Data Configuration'}
          </Title>

          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ marginBottom: '8px', display: 'block' }}>
              {language === 'zh' ? '蒸馏数量' : 'Distillation Count'}
            </Text>
            <InputNumber
              min={1}
              max={500}
              style={{ width: '100%', maxWidth: '400px' }}
              placeholder={language === 'zh' ? '输入要蒸馏的Query数量' : 'Enter number of queries to distill'}
              value={selectedQueries.length || undefined}
              onChange={(value) => {
                const count = Math.min(value || 0, 500);
                setSelectedQueries(Array.from({ length: count }, (_, i) => i + 1));
              }}
            />
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              {language === 'zh' ? `最多可选择 500 条` : `Maximum 500 queries available`}
            </div>
          </div>

          <Text type="secondary" style={{ fontSize: '12px' }}>
            {language === 'zh' ? '待蒸馏query数量：500' : 'Queries pending distillation: 500'}
          </Text>
        </div>

        {/* 蒸馏Prompt模块 */}
        <div>
          <Text strong style={{ marginBottom: '8px', display: 'block' }}>
            {language === 'zh' ? '蒸馏Prompt' : 'Distillation Prompt'}
          </Text>
          <div className='bg-[#f5f5f5] p-[10px]'>
            {distillationPrompt}
          </div>
          <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
            {language === 'zh'
              ? '此Prompt将用于指导AI模型进行数据蒸馏，生成高质量的训练数据'
              : 'This prompt will guide the AI model in data distillation to generate high-quality training data'
            }
          </Text>
        </div>
      </Space>
    </Modal>
  );
};

export default CreateDistillationTaskDialog;
