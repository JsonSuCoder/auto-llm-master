import React, { useState, useEffect } from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Badge from 'antd/es/badge';
import Table from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { Language, t } from '../utils/translations';
import QueryTypeDialog from './dialog/QueryTypeDialog';
import { QueryTypeItem, getQueryTypes, createQueryTypes, updateQueryTypes, deleteQueryTypes } from '../api/querytype';
import { formatPostgresTimestamp } from '../utils/util';

interface QueryTypeManagementProps {
  language: Language;
}

export const QueryTypeManagement: React.FC<QueryTypeManagementProps> = ({ language }) => {
  const [queryTypes, setQueryTypes] = useState<QueryTypeItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [queryData, setQueryData] = useState<{
    type: 'add' | 'edit';
    data: QueryTypeItem;
  } | null>({
    type: 'add',
    data: {
      id: '',
      code: '',
      L1_SCENE_ID: '',
      L2_SCENE_ID: '',
      L3_SCENE_ID: '',
      description: '',
      guidance: '',
      prompt: '',
      distilledPrompt: '',
      qualityStandard: ''
    }
  });

  // 加载查询类型列表
  const fetchQueryTypes = () => {
    setLoading(true);
    getQueryTypes({ page: currentPage, size: pageSize })
      .then((response: any) => {
        setQueryTypes(response.queries || []);
        setTotalItems(response.total || 0);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取查询类型列表失败:', error);
        message.error(t('fetchQueryTypesFailed', language));
        setLoading(false);
      });
  };

  // 初始加载和页码变化时重新加载数据
  useEffect(() => {
    fetchQueryTypes();
  }, [currentPage, pageSize]);

  const handleAddQuery = () => {
    if (!queryData?.data) return;
    const { data } = queryData;
    if (!data.code || !data.description) {
      message.error(t('pleaseEnterRequiredFields', language));
      return;
    }

    createQueryTypes(data)
      .then((response: any) => {
        message.success(t('queryTypeAddSuccess', language));
        setIsDialogOpen(false);
        setQueryData({
          type: 'add',
          data: {
            id: '',
            code: '',
            L1_SCENE_ID: '',
            L2_SCENE_ID: '',
            L3_SCENE_ID: '',
            description: '',
            guidance: '',
            prompt: '',
            distilledPrompt: '',
            qualityStandard: ''
          }
        });
        fetchQueryTypes();
      })
      .catch(error => {
        console.error('添加查询类型失败:', error);
        message.error(t('addFailed', language));
      });
  };

  const handleUpdateQuery = () => {
    if (!queryData) return;
    const { data } = queryData;
    if (!data.code || !data.description) {
      message.error(t('pleaseEnterRequiredFields', language));
      return;
    }

    const { id } = data;
    if (!id) {
      message.error(t('invalidQueryId', language));
      return;
    }

    updateQueryTypes(id, data)
      .then((response: any) => {
        message.success(t('queryTypeUpdateSuccess', language));
        setIsDialogOpen(false);
        setQueryData({
          type: 'add',
          data: {
            id: '',
            code: '',
            L1_SCENE_ID: '',
            L2_SCENE_ID: '',
            L3_SCENE_ID: '',
            description: '',
            guidance: '',
            prompt: '',
            distilledPrompt: '',
            qualityStandard: ''
          }
        });
        fetchQueryTypes();
      })
      .catch(error => {
        console.error('更新查询类型失败:', error);
        message.error(t('updateFailed', language));
      });
  };

  const handleEditQuery = (query: QueryTypeItem) => {
    setQueryData({
      type: 'edit',
      data: query
    });
    setIsDialogOpen(true);
  };

  const handleDeleteType = (typeId: string | undefined) => {
    if (!typeId) return;
    deleteQueryTypes(typeId)
      .then((response: any) => {
        message.success(t('queryTypeDeleted', language));
        fetchQueryTypes();
      })
      .catch(error => {
        console.error('删除查询类型失败:', error);
        message.error(t('deleteFailed', language));
      });
  };

  return (
    <div className="space-y-6 p-[24px]">
      <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingOutlined style={{ fontSize: '18px' }} />
          {t('queryTypeManagement', language)}
        </div>
      }
        extra={<span>{t('configureQueryType', language)}</span>}
      >
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            {t('addType', language)}
          </Button>

          <QueryTypeDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={queryData?.type === 'edit' ? handleUpdateQuery : handleAddQuery}
            type={queryData?.type || 'add'}
            queryData={queryData?.data || null}
            setQueryData={(data) => setQueryData({ type: queryData?.type || 'add', data })}
            language={language}
          />
        </div>

        <Table
          dataSource={queryTypes}
          rowKey="id"
          bordered
          loading={loading}
          columns={[
            {
              title: t('code', language),
              dataIndex: 'code',
              key: 'code',
              render: (code) => <Badge status="default" text={code} style={{ fontFamily: 'monospace' }} />
            },
            {
              title: language === 'zh' ? '一级级场景 (驱动-A)' : 'Secondary Scene (Motivation-H)',
              dataIndex: 'L1_SCENE_ID',
              key: 'L1_SCENE_ID',
              render: (text) => <div style={{ fontSize: '14px' }}>{text}</div>
            },
            {
              title: language === 'zh' ? '二级场景 (提问动机-H)' : 'Secondary Scene (Motivation-H)',
              dataIndex: 'L2_SCENE_ID',
              key: 'L2_SCENE_ID',
              render: (text) => <div style={{ fontSize: '14px' }}>{text}</div>
            },
            {
              title: language === 'zh' ? '三级场景（赛道-T）' : 'Tertiary Scene (Track-T)',
              dataIndex: 'L3_SCENE_ID',
              key: 'L3_SCENE_ID',
              render: (text) => <div style={{ fontSize: '14px' }}>{text}</div>
            },
            {
              title: t('createdTime', language),
              dataIndex: 'createdAt',
              key: 'createdAt',
              render: (time) => <span style={{ color: '#666' }}>{formatPostgresTimestamp(time)}</span>
            },
            {
              title: t('actions', language),
              key: 'actions',
              align: 'right',
              render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditQuery(record)}
                    size="small"
                  />
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteType(record?.id)}
                    danger
                    size="small"
                  />
                </div>
              )
            }
          ]}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
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
        {queryTypes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#666' }}>
            {t('noMatchingTypes', language)}
          </div>
        )}
      </Card>
    </div>
  );
};