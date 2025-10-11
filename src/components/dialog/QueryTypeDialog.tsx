import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, Tabs, Select, message } from 'antd';
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
  const [form] = Form.useForm();

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

  // 当 queryData 变化时更新表单值
  useEffect(() => {
    if (queryData) {
      form.setFieldsValue(queryData);
    }
  }, [queryData, form]);

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      onSubmit();
    } catch (error) {
      message.error('请填写所有必填项');
    }
  };
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
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEditing ? t('update', language) : t('save', language)}
        </Button>
      ]}
    >
      <div style={{ padding: '20px' }}>
        <p>{t('configureQueryType', language)}</p>
        <Form form={form} layout="vertical">
          <Tabs defaultActiveKey="basic">
            <TabPane tab={t('basicInfo', language)} key="basic">
              <Form.Item
                name="code"
                label={t('code', language)}
                rules={[{ required: true, message: '请输入编号' }]}
              >
                <Input
                  onChange={(e) => setQueryData({ ...queryData, code: e.target.value })}
                  placeholder={t('enterCode', language)}
                />
              </Form.Item>
              <Form.Item
                name="L1_SCENE_ID"
                label={t('firstScene', language)}
                rules={[{ required: true, message: '请选择场景' }]}
              >
                <Select
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
              <Form.Item
                name="L2_SCENE_ID"
                label={t('secondaryScene', language)}
                rules={[{ required: true, message: '请选择场景' }]}
              >
                <Select
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
              <Form.Item
                name="L3_SCENE_ID"
                label={t('tertiaryScene', language)}
                rules={[{ required: true, message: '请选择场景' }]}
              >
                <Select
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
              <Form.Item
                name="description"
                label={t('description', language)}
                rules={[{ required: true, message: '请输入描述' }]}
              >
                <TextArea
                  onChange={(e) => setQueryData({ ...queryData, description: e.target.value })}
                  placeholder={t('describeType', language)}
                  rows={3}
                />
              </Form.Item>
            </TabPane>

            <TabPane tab={t('guidance', language)} key="guidance">
              <Form.Item
                name="guidance"
                label={t('productionGuidance', language)}
                rules={[{ required: true, message: '请输入生产指导' }]}
              >
                <TextArea
                  onChange={(e) => setQueryData({ ...queryData, guidance: e.target.value })}
                  placeholder={t('detailedGuidance', language)}
                  rows={15}
                />
              </Form.Item>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                {t('guidanceHelp', language)}
              </p>
            </TabPane>

            <TabPane tab={language === 'zh' ? '生成问题prompt' : 'Generate Question Prompt'} key="prompt">
              <Form.Item
                name="prompt"
                label={t('modelPrompt', language)}
                rules={[{ required: true, message: '请输入模型提示词' }]}
              >
                <TextArea
                  onChange={(e) => setQueryData({ ...queryData, prompt: e.target.value })}
                  placeholder={language === 'zh' ? '输入用于生成Query的大模型提示语' : 'Enter large model prompt for Query generation'}
                  rows={15}
                />
              </Form.Item>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                {t('promptHelp', language)}
              </p>
            </TabPane>

            <TabPane tab={language === 'zh' ? '蒸馏的Prompt' : 'Distilled Prompt'} key="distilled">
              <Form.Item
                name="distilledPrompt"
                label={language === 'zh' ? '蒸馏的prompt' : 'Distilled Prompt'}
                rules={[{ required: true, message: '请输入蒸馏的提示' }]}
              >
                <TextArea
                  onChange={(e) => setQueryData({ ...queryData, distilledPrompt: e.target.value })}
                  placeholder={language === 'zh' ? '输入经过蒸馏优化的提示语模板' : 'Enter distilled and optimized prompt template'}
                  rows={15}
                />
              </Form.Item>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                {language === 'zh' ? '蒸馏的Prompt是经过优化和精简后的高效提示语版本' : 'Distilled prompt is an optimized and streamlined version of the original prompt'}
              </p>
            </TabPane>

            <TabPane tab={t('qualityStandard', language)} key="quality">
              <Form.Item
                name="qualityStandard"
                label={language === 'zh' ? '质量打分标准' : 'Quality Scoring Standard'}
                rules={[{ required: true, message: '请输入质量打分标准' }]}
              >
                <TextArea
                  onChange={(e) => setQueryData({ ...queryData, qualityStandard: e.target.value })}
                  placeholder={t('qualityStandardDesc', language)}
                  rows={15}
                />
              </Form.Item>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                {t('qualityStandardHelp', language)}
              </p>
            </TabPane>
          </Tabs>
        </Form>
      </div>
    </Modal>
  );
};

export default QueryTypeDialog;