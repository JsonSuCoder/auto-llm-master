import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Select, InputNumber, message } from 'antd';
import { Language, t } from '../../utils/translations';
import { getAllQueryTypes } from '../../api/querytype';
import { getUnfilteredQueryCount, startFilteringQueries } from '../../api/queries';

const { Option } = Select;

interface BatchEvaluateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    language: Language;
}

interface QueryTypeItem {
    id: string;
    code: string;
    description: string;
}

const BatchEvaluateDialog: React.FC<BatchEvaluateDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    language
}) => {
    const [form] = Form.useForm();
    const [queryTypes, setQueryTypes] = useState<QueryTypeItem[]>([]);
    const [selectedQueryTypeId, setSelectedQueryTypeId] = useState<number | null>(null);
    const [unfilteredCount, setUnfilteredCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [loadingCount, setLoadingCount] = useState(false);

    // 获取 QueryType 列表
    useEffect(() => {
        if (isOpen) {
            getAllQueryTypes().then((res: any) => {
                if (res.code === 200) {
                    setQueryTypes(res.queries || []);
                }
            });
        }
    }, [isOpen]);

    // 当选择 QueryType 时获取未评分数量
    useEffect(() => {
        if (selectedQueryTypeId) {
            setLoadingCount(true);
            getUnfilteredQueryCount(selectedQueryTypeId).then((res: any) => {
                if (res.code === 200) {
                    const count = res.unfiltered_count || 0;
                    setUnfilteredCount(count);
                    // 自动设置评分数量为未评分数量
                    form.setFieldsValue({ filter_count: count });
                }
                setLoadingCount(false);
            }).catch(() => {
                setLoadingCount(false);
            });
        }
    }, [selectedQueryTypeId, form]);

    // 重置弹窗
    useEffect(() => {
        if (isOpen) {
            form.resetFields();
            setSelectedQueryTypeId(null);
            setUnfilteredCount(0);
            // 设置默认值
            form.setFieldsValue({
                passing_score: 70
            });
        }
    }, [isOpen, form]);

    // 处理提交
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const result = await startFilteringQueries({
                querytype_id: values.querytype_id,
                filter_count: values.filter_count,
                passing_score: values.passing_score
            });

            if (result.code === 200) {
                message.success(language === 'zh' ? '开始批量评分成功' : 'Batch evaluation started successfully');
                onSuccess();
                onClose();
            } else {
                message.error(result.message || (language === 'zh' ? '启动失败' : 'Failed to start'));
            }
        } catch (error: any) {
            if (error.errorFields) {
                message.error(language === 'zh' ? '请填写所有必填项' : 'Please fill in all required fields');
            } else {
                message.error(language === 'zh' ? '启动失败' : 'Failed to start');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={language === 'zh' ? '一键评判' : 'Batch Evaluate'}
            open={isOpen}
            onCancel={onClose}
            width="500px"
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t('cancel', language)}
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
                    {language === 'zh' ? '开始评判' : 'Start Evaluation'}
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                style={{ marginTop: '20px' }}
            >
                <Form.Item
                    name="querytype_id"
                    label={language === 'zh' ? '选择 QueryType' : 'Select QueryType'}
                    rules={[{ required: true, message: language === 'zh' ? '请选择 QueryType' : 'Please select QueryType' }]}
                >
                    <Select
                        placeholder={language === 'zh' ? '请选择 QueryType' : 'Please select QueryType'}
                        onChange={(value) => setSelectedQueryTypeId(value)}
                        showSearch
                        optionFilterProp="children"
                    >
                        {queryTypes.map(qt => (
                            <Option key={qt.id} value={parseInt(qt.id)}>
                                {qt.code} - {qt.description}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="filter_count"
                    label={language === 'zh' ? '评分数量' : 'Filter Count'}
                    rules={[
                        { required: true, message: language === 'zh' ? '请输入评分数量' : 'Please enter filter count' },
                        {
                            validator: (_, value) => {
                                if (value && value > unfilteredCount) {
                                    return Promise.reject(
                                        language === 'zh'
                                            ? `输入的数量不能大于未评分数量 (${unfilteredCount})`
                                            : `Count cannot exceed unfiltered count (${unfilteredCount})`
                                    );
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                    extra={
                        selectedQueryTypeId && !loadingCount
                            ? (language === 'zh'
                                ? `当前未评分数量: ${unfilteredCount}`
                                : `Current unfiltered count: ${unfilteredCount}`)
                            : null
                    }
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        max={unfilteredCount || undefined}
                        placeholder={language === 'zh' ? '请输入评分数量' : 'Please enter filter count'}
                        disabled={!selectedQueryTypeId || loadingCount}
                    />
                </Form.Item>

                <Form.Item
                    name="passing_score"
                    label={language === 'zh' ? '评分阈值 (0-100)' : 'Passing Score (0-100)'}
                    rules={[
                        { required: true, message: language === 'zh' ? '请输入评分阈值' : 'Please enter passing score' },
                        {
                            type: 'number',
                            min: 0,
                            max: 100,
                            message: language === 'zh' ? '评分阈值必须在 0-100 之间' : 'Passing score must be between 0-100'
                        }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        max={100}
                        placeholder={language === 'zh' ? '请输入评分阈值 (默认70)' : 'Please enter passing score (default 70)'}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BatchEvaluateDialog;
