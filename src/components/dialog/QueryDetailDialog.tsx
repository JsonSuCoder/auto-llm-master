import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { Language, t } from '../../utils/translations';
import { StarOutlined } from '@ant-design/icons';

interface QueryType {
    id: number;
    combination_id: string;
    angle_code: string;
    angle_name: string;
    target_name: string;
    motivation_code: string;
    motivation_name: string;
    query: string;
    is_filtered: boolean;
    passed_filter: boolean;
    evaluation_score: number;
    filter_reasons: string;
    created_at: string;
    filtered_at: string;
    querytype_id: number;
    manual_confirmed: string;
}

interface QueryDetailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    queryData: QueryType | null;
    language: Language;
}

const QueryDetailDialog: React.FC<QueryDetailDialogProps> = ({
    isOpen,
    onClose,
    queryData,
    language
}) => {
    if (!queryData) {
        return null;
    }

    const getStatusBadge = (status: boolean) => {
        if (status) {
            return <Tag color="green">已评判</Tag>;
        } else {
            return <Tag color="red">待评判</Tag>;
        }
    };

    const getConfirmBadge = (status: string) => {
        switch (status) {
            case '待评':
                return <Tag color="yellow">待评</Tag>;
            case '已确认':
                return <Tag color="green">已确认</Tag>;
            case '已拒绝':
                return <Tag color="red">已拒绝</Tag>;
            default:
                return null;
        }
    };

    const getScoreBadge = (score: number | null): React.ReactNode | null => {
        if (!score) return null;
        const color = score >= 8 ? '#52c41a' : score >= 7 ? '#faad14' : '#f5222d';
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color }}>
                <StarOutlined style={{ fontSize: '14px' }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{score.toFixed(1)}</span>
            </div>
        );
    };

    const getFilterBadge = (passed: boolean) => {
        return passed
            ? <Tag color="green">通过</Tag>
            : <Tag color="red">未通过</Tag>;
    };

    return (
        <Modal
            title={language === 'zh' ? 'Query详细信息' : 'Query Details'}
            open={isOpen}
            onCancel={onClose}
            width="800px"
            footer={null}
        >
            <Descriptions bordered column={1} style={{ marginTop: '16px' }}>
                <Descriptions.Item label="ID">
                    {queryData.id}
                </Descriptions.Item>

                <Descriptions.Item label="Query内容">
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {queryData.query}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="组合ID">
                    {queryData.combination_id}
                </Descriptions.Item>

                <Descriptions.Item label="QueryType ID">
                    {queryData.querytype_id}
                </Descriptions.Item>

                <Descriptions.Item label="角度编码">
                    {queryData.angle_code}
                </Descriptions.Item>

                <Descriptions.Item label="角度名称">
                    {queryData.angle_name}
                </Descriptions.Item>

                <Descriptions.Item label="动机编码">
                    {queryData.motivation_code}
                </Descriptions.Item>

                <Descriptions.Item label="动机名称">
                    {queryData.motivation_name}
                </Descriptions.Item>

                <Descriptions.Item label="目标名称">
                    {queryData.target_name}
                </Descriptions.Item>

                <Descriptions.Item label={t('score', language)}>
                    {getScoreBadge(queryData.evaluation_score)}
                </Descriptions.Item>

                <Descriptions.Item label="自动评判状态">
                    {getStatusBadge(queryData.is_filtered)}
                </Descriptions.Item>

                <Descriptions.Item label="过滤结果">
                    {getFilterBadge(queryData.passed_filter)}
                </Descriptions.Item>

                <Descriptions.Item label="过滤原因">
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {queryData.filter_reasons || '-'}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="人工确认状态">
                    {getConfirmBadge(queryData.manual_confirmed)}
                </Descriptions.Item>

                <Descriptions.Item label={t('createdAt', language)}>
                    {queryData.created_at}
                </Descriptions.Item>

                <Descriptions.Item label="过滤时间">
                    {queryData.filtered_at || '-'}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default QueryDetailDialog;
