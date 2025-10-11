import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, Tabs, Select } from 'antd';
import { Language, t } from '../../utils/translations';
import { PlusOutlined } from '@ant-design/icons';
import { getScenes } from '../../api/scenes';
import { QueryTypeItem } from '../../api/querytype';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

interface QueryTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  type: 'add' | 'edit';
  queryData: QueryTypeItem | null;
  setQueryData: (data: QueryTypeItem) => void;
  language: Language;
}

const QueryTypeDialog: React.FC<QueryTypeDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  queryData,
  setQueryData,
  language
}) => {
  if (!queryData) {
    queryData = {
      id: '',
      code: '',
      L1_SCENE_ID: '',
      L2_SCENE_ID: '',
      L3_SCENE_ID: '',
      createdAt: '',
      description: '',
      guidance: '',
      prompt: '',
      distilledPrompt: '',
      qualityStandard: '',
    }
  }
  const isEditing = type === 'edit';
  const [scenes, setScenes] = useState<{
    L1_SCENE: Array<{ id: string, angle_code: string, angle_name: string, angle_description: string }>,
    L2_SCENE: Array<{ id: string, motivation_code: string, motivation_name: string, motivation_description: string }>,
    L3_SCENE: Array<{ id: string, target_code: string, target_name: string, target_description: string }>
  }>({
    L1_SCENE: [],
    L2_SCENE: [],
    L3_SCENE: []
  });

  useEffect(() => {
    // 获取场景列表
    getScenes().then((res: any) => {
      console.log('场景列表', res);
      if (res.code === 200) {
        const { L1_SCENE, L2_SCENE, L3_SCENE } = res;
        setScenes({ L1_SCENE, L2_SCENE, L3_SCENE });
      }
    });
  }, []);
  return (
    <Modal
      title={isEditing ? t('editQueryType', language) : t('addQueryType', language)}
      open={isOpen}
      onCancel={onClose}
      width="80%"
      height="80%"
      // style={{ width: '80%', height: '80%', padding: 0 }}
      // bodyStyle={{ height:'100%',padding: 0, overflow: 'auto' }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('cancel', language)}
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          {isEditing ? t('update', language) : t('save', language)}
        </Button>
      ]}
    >
      <div style={{ padding: '20px' }}>
        <p>{t('configureQueryType', language)}</p>
        <Tabs defaultActiveKey="basic">
          <TabPane tab={t('basicInfo', language)} key="basic">
            <Form layout="vertical">
              <Form.Item label={t('code', language)}>
                <Input
                  value={queryData.code || ''}
                  onChange={(e) => setQueryData({ ...queryData, code: e.target.value })}
                  placeholder={t('enterCode', language)}
                />
              </Form.Item>
              <Form.Item label={t('firstScene', language)}>
                <Select
                  value={queryData.L1_SCENE_ID}
                  onChange={(value) => setQueryData({ ...queryData, L1_SCENE_ID: value })}
                  placeholder={t('selectFirstScene', language)}
                >
                  {scenes.L1_SCENE.map(scene => (
                    <Option key={scene.angle_code} value={scene.angle_code}>
                      <span>{scene.angle_code}</span>
                      <span>{scene.angle_name}</span>
                      <span>{scene.angle_description}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={t('secondaryScene', language)}>
                <Select
                  value={queryData.L2_SCENE_ID}
                  onChange={(value) => setQueryData({ ...queryData, L2_SCENE_ID: value })}
                  placeholder={t('selectSecondaryScene', language)}
                >
                  {scenes.L2_SCENE.map(scene => (
                    <Option key={scene.motivation_code} value={scene.motivation_code}>
                      <span>{scene.motivation_code}</span>
                      <span>{scene.motivation_name}</span>
                      <span>{scene.motivation_description}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={t('tertiaryScene', language)}>
                <Select
                  value={queryData.L3_SCENE_ID}
                  onChange={(value) => setQueryData({ ...queryData, L3_SCENE_ID: value })}
                  placeholder={t('selectTertiaryScene', language)}
                >
                  {scenes.L3_SCENE.map(scene => (
                    <Option key={scene.target_code} value={scene.target_code}>
                      <span>{scene.target_code}</span>
                      <span>{scene.target_name}</span>
                      <span>{scene.target_description}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={t('description', language)}>
                <TextArea
                  value={queryData.description}
                  onChange={(e) => setQueryData({ ...queryData, description: e.target.value })}
                  placeholder={t('describeType', language)}
                  rows={3}
                />
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab={t('guidance', language)} key="guidance">
            <Form layout="vertical">
              <Form.Item label={t('productionGuidance', language)}>
                <TextArea
                  value={queryData.guidance}
                  onChange={(e) => setQueryData({ ...queryData, guidance: e.target.value })}
                  placeholder={t('detailedGuidance', language)}
                  rows={15}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  {t('guidanceHelp', language)}
                </p>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab={language === 'zh' ? '生成问题prompt' : 'Generate Question Prompt'} key="prompt">
            <Form layout="vertical">
              <Form.Item label={t('modelPrompt', language)}>
                <TextArea
                  value={queryData.prompt}
                  onChange={(e) => setQueryData({ ...queryData, prompt: e.target.value })}
                  placeholder={language === 'zh' ? '输入用于生成Query的大模型提示语' : 'Enter large model prompt for Query generation'}
                  rows={15}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  {t('promptHelp', language)}
                </p>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab={language === 'zh' ? '蒸馏的Prompt' : 'Distilled Prompt'} key="distilled">
            <Form layout="vertical">
              <Form.Item label={language === 'zh' ? '蒸馏的prompt' : 'Distilled Prompt'}>
                <TextArea
                  value={queryData.distilledPrompt || ''}
                  onChange={(e) => setQueryData({ ...queryData, distilledPrompt: e.target.value })}
                  placeholder={language === 'zh' ? '输入经过蒸馏优化的提示语模板' : 'Enter distilled and optimized prompt template'}
                  rows={15}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  {language === 'zh' ? '蒸馏的Prompt是经过优化和精简后的高效提示语版本' : 'Distilled prompt is an optimized and streamlined version of the original prompt'}
                </p>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab={t('qualityStandard', language)} key="quality">
            <Form layout="vertical">
              <Form.Item label={language === 'zh' ? '质量打分标准' : 'Quality Scoring Standard'}>
                <TextArea
                  value={queryData.qualityStandard}
                  onChange={(e) => setQueryData({ ...queryData, qualityStandard: e.target.value })}
                  placeholder={t('qualityStandardDesc', language)}
                  rows={15}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  {t('qualityStandardHelp', language)}
                </p>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default QueryTypeDialog;