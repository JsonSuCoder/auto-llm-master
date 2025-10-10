import React, { useState, useEffect } from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import Badge from 'antd/es/badge';
import Table from 'antd/es/table';
import Pagination from 'antd/es/pagination';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { Language, t } from '../utils/translations';
import QueryTypeDialog from './dialog/QueryTypeDialog';
import { QueryTypeItem, getQueryTypes, createQueryTypes, updateQueryTypes, deleteQueryTypes } from '../api/query';

interface QueryTypeManagementProps {
  language: Language;
}

export const QueryTypeManagement: React.FC<QueryTypeManagementProps> = ({ language }) => {
  const [queryTypes, setQueryTypes] = useState<QueryTypeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
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

  const filteredTypes = queryTypes.filter(type =>
    type.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 分页逻辑
  const totalPages = Math.ceil(filteredTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTypes = filteredTypes.slice(startIndex, endIndex);

  // 当搜索条件改变时重置到第一页
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

    // 加载查询类型列表
  const fetchQueryTypes = () => {
    setLoading(true);
    getQueryTypes({ page: currentPage, size: itemsPerPage })
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
  }, [currentPage, itemsPerPage]);

  const handleAddQuery = () => {
    if(!queryData?.data) return;
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
    if(!typeId) return;
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
    <div className="space-y-6">
      <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingOutlined style={{ fontSize: '18px' }} />
          {t('queryTypeManagement', language)}
        </div>
      }
        extra={<span>{t('configureQueryType', language)}</span>}
      >
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Input
              prefix={<SearchOutlined />}
              placeholder={language === 'zh' ? '搜索Query类型...' : 'Search Query types...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '250px' }}
            />
          </div>

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
          dataSource={currentTypes}
          rowKey="id"
          pagination={false}
          bordered
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
              render: (time) => <span style={{ color: '#666' }}>{time}</span>
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
        />

        {/* 分页组件 */}
        {filteredTypes.length > 0 && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <Pagination
              current={currentPage}
              total={filteredTypes.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        )}

        {/* 分页信息显示 */}
        {filteredTypes.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
            <div>
              {language === 'zh'
                ? `显示 ${startIndex + 1}-${Math.min(endIndex, filteredTypes.length)} 条，共 ${filteredTypes.length} 条记录`
                : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredTypes.length)} of ${filteredTypes.length} results`
              }
            </div>
            <div>
              {language === 'zh'
                ? `第 ${currentPage} 页，共 ${totalPages} 页`
                : `Page ${currentPage} of ${totalPages}`
              }
            </div>
          </div>
        )}

        {filteredTypes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#666' }}>
            {t('noMatchingTypes', language)}
          </div>
        )}
      </Card>
    </div>
  );
};