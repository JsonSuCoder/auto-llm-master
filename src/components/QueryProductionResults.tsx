import { Button, Card, Select, Table, Tag, message } from "antd";
import { Language, t } from "../utils/translations";
import { CheckOutlined, CloseOutlined, EyeOutlined, StarOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getQueries, patchQueryStatus } from "../api/queries";
import QueryDetailDialog from "./dialog/QueryDetailDialog";
import { formatPostgresTimestamp } from "../utils/util";

interface QueryProductionProps {
    language: Language;
}
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
    manual_confirmed: '待评' | '已确认' | '已拒绝';
}
const { Option } = Select;
export const QueryProductionResults: React.FC<QueryProductionProps> = ({ language }) => {
    const [queries, setQueries] = useState<QueryType[]>([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState<QueryType | null>(null);

    // 获取查询列表
    const fetchQueries = async (page: number, size: number, status: string) => {
        setLoading(true);
        try {
            // 构建查询参数，当 filterStatus='all' 时不传 manual_confirmed
            const params: any = { page, size };
            if (status !== 'all') {
                params.manual_confirmed = status;
            }

            const res = await getQueries(params);
            if (res.code === 200) {
                const { queries, total } = res;
                setQueries(queries);
                setTotal(total);
            }
        } catch (error) {
            message.error('获取数据失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries(currentPage, pageSize, filterStatus);
    }, [currentPage, pageSize, filterStatus])
    const handleConfirmQuery = (queryId: number) => {
        patchQueryStatus(queryId.toString(), '已确认').then(res => {
            if (res.code === 200) {
                message.success(t('queryConfirmed', language));
                setQueries(queries.map(query =>
                    query.id === queryId
                        ? { ...query, manual_confirmed: '已确认' }
                        : query
                ));
            } else {
                message.error(res.message || '更新用户状态失败');
            }
        });
    };

    const handleRejectQuery = (queryId: number) => {
        patchQueryStatus(queryId.toString(), '已拒绝').then(res => {
            if (res.code === 200) {
                message.success(t('queryRejected', language));
                setQueries(queries.map(query =>
                    query.id === queryId
                        ? { ...query, manual_confirmed: '已拒绝' }
                        : query
                ));
            } else {
                message.error(res.message || '更新用户状态失败');
            }
        });

    };

    const getStatusBadge = (status: string) => {
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
        }
    };

    const getScoreBadge = (score: number | null): React.ReactNode | null => {
        if (!score) return null;
        const color = score >= 8 ? 'green' : score >= 7 ? 'gold' : 'red';
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: color === 'green' ? '#52c41a' : color === 'gold' ? '#faad14' : '#f5222d' }}>
                <StarOutlined style={{ fontSize: '12px' }} />
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{score.toFixed(1)}</span>
            </div>
        );
    };


    // 一键评判功能
    const handleBatchEvaluate = () => {

    };

    // 查看详情
    const handleViewDetails = (queryId: number) => {
        const query = queries.find(q => q.id === queryId);
        if (query) {
            setSelectedQuery(query);
            setIsDetailDialogOpen(true);
        }
    };

    // 表格列定义
    const columns = [
        {
            title: 'Query内容',
            dataIndex: 'query',
            key: 'query',
            width: 280,
            onCell: () => ({
                style: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 280, // 限制列宽以触发省略号
                },
            }),
        },
        {
            title: '类型',
            dataIndex: 'combination_id',
            key: 'combination_id',
            width: 80,
        },
        {
            title: t('score', language),
            dataIndex: 'evaluation_score',
            key: 'evaluation_score',
            width: 40,
            render: (score: number | null) => getScoreBadge(score),
        },
        {
            title: '自动评判',
            dataIndex: 'is_filtered',
            key: 'is_filtered',
            width: 80,
            render: (status: string) => getStatusBadge(status),
        },
        {
            title: '状态',
            dataIndex: 'manual_confirmed',
            key: 'manual_confirmed',
            width: 80,
            render: (status: string) => getConfirmBadge(status),
        },
        {
            title: t('createdAt', language),
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
            render: (time:string) => <span style={{ color: '#666' }}>{formatPostgresTimestamp(time)}</span>
        },
        {
            title: t('actions', language),
            key: 'actions',
            width: 120,
            render: (_: any, record: QueryType) => {
                return (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {record.manual_confirmed === '待评' && (
                            <>
                                <Button
                                    type="text"
                                    icon={<CheckOutlined />}
                                    size="small"
                                    onClick={() => handleConfirmQuery(record.id)}
                                    style={{ color: '#52c41a' }}
                                />
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    size="small"
                                    onClick={() => handleRejectQuery(record.id)}
                                    style={{ color: '#f5222d' }}
                                />
                            </>
                        )}
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(record.id)}
                        />
                    </div>
                )

            },
        },
    ];
    return (
        <div className='p-[24px]'>
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
                    <Select
                        value={filterStatus}
                        onChange={(value) => {
                            setFilterStatus(value);
                            setCurrentPage(1); // 切换过滤状态时重置到第一页
                        }}
                        style={{ width: '150px' }}
                    >
                        <Option value="all">{t('allStatus', language)}</Option>
                        <Option value="待评">待评</Option>
                        <Option value="已确认">已确认</Option>
                        <Option value="已拒绝">已拒绝</Option>
                    </Select>
                </div>

                <Table
                    dataSource={queries}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        showTotal: (total) => `${t('total', language)}: ${total}`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            if (size !== pageSize) {
                                setPageSize(size);
                                setCurrentPage(1); // 改变每页显示数量时重置到第一页
                            }
                        },
                    }}
                />
            </Card>

            {/* Query详情弹窗 */}
            <QueryDetailDialog
                isOpen={isDetailDialogOpen}
                onClose={() => setIsDetailDialogOpen(false)}
                queryData={selectedQuery}
                language={language}
            />
        </div>
    );
};