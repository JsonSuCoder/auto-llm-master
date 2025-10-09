import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { 
  Tag, Play, Pause, Download, Eye, Trash2,
  Clock, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language, t } from '../utils/translations';
import { AnnotationResults } from './AnnotationResults';

interface DataAnnotationProps {
  language: Language;
}

export const DataAnnotation: React.FC<DataAnnotationProps> = ({ language }) => {
  const [currentView, setCurrentView] = useState<'main' | 'results'>('main');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedTaskName, setSelectedTaskName] = useState<string>('');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: language === 'zh' ? '机会发现标注任务01' : 'Opportunity Discovery Annotation Task 01',
      type: language === 'zh' ? 'T1H1 机会发现' : 'T1H1 Opportunity Discovery',
      status: 'completed',
      progress: 100,
      queryCount: 500,
      annotatedCount: 485,
      startTime: '2024-03-15 09:00',
      endTime: '2024-03-15 12:30',
      estimatedTime: null,
      error: null,
      uploadedFiles: ['queries_batch_1.csv']
    },
    {
      id: 2,
      name: language === 'zh' ? '趋势研判标注任务02' : 'Trend Analysis Annotation Task 02',
      type: language === 'zh' ? 'T2H2 趋势研判' : 'T2H2 Trend Analysis',
      status: 'running',
      progress: 65,
      queryCount: 300,
      annotatedCount: 195,
      startTime: '2024-03-15 14:00',
      endTime: null,
      estimatedTime: 25,
      error: null,
      uploadedFiles: ['market_analysis_queries.xlsx']
    },
    {
      id: 3,
      name: language === 'zh' ? '交易决策标注任务03' : 'Trading Decision Annotation Task 03',
      type: language === 'zh' ? 'T3H3 交易决策支持' : 'T3H3 Trading Decision Support',
      status: 'pending',
      progress: 0,
      queryCount: 200,
      annotatedCount: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null,
      uploadedFiles: ['trading_queries.json']
    },
    {
      id: 4,
      name: language === 'zh' ? '综合场景标注任务04' : 'General Scenario Annotation Task 04',
      type: language === 'zh' ? 'T4H1 机会发现' : 'T4H1 Opportunity Discovery',
      status: 'pending',
      progress: 0,
      queryCount: 150,
      annotatedCount: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null,
      uploadedFiles: ['general_queries.csv']
    }
  ]);



  const handleTaskAction = (taskId: number, action: string) => {
    if (action === 'start') {
      // 对于待开始的任务，直接跳转到标注结果页面
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status === 'pending') {
        handleViewResults(taskId, task.type);
        return;
      }
    }

    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        switch (action) {
          case 'start':
            return { 
              ...task, 
              status: 'running', 
              startTime: new Date().toLocaleString() 
            };
          case 'pause':
            return { ...task, status: 'paused' };
          case 'resume':
            return { ...task, status: 'running' };
          case 'delete':
            return null;
          default:
            return task;
        }
      }
      return task;
    }).filter(Boolean));

    if (action === 'delete') {
      toast.success(language === 'zh' ? '任务已删除' : 'Task deleted');
    } else {
      toast.success(language === 'zh' ? '操作成功' : 'Operation successful');
    }
  };



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('completed', language)}
          </Badge>
        );
      case 'running':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            {t('running', language)}
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="outline">
            <Pause className="w-3 h-3 mr-1" />
            {t('paused', language)}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            {t('waiting', language)}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewResults = (taskId: number, taskName: string) => {
    setSelectedTaskId(taskId);
    setSelectedTaskName(taskName);
    setCurrentView('results');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedTaskId(null);
    setSelectedTaskName('');
  };

  if (currentView === 'results' && selectedTaskId) {
    return (
      <AnnotationResults
        language={language}
        taskId={selectedTaskId}
        taskName={selectedTaskName}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 创建新任务 */}
      <Card>
        <CardHeader className="p-[24px]">
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            {t('dataAnnotationTitle', language)}
          </CardTitle>
          <CardDescription>
            {language === 'zh' 
              ? '管理和查看数据标注任务进度'
              : 'Manage and view data annotation task progress'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 任务列表 */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'zh' ? '标注任务列表' : 'Annotation Task List'}</CardTitle>
          <CardDescription>
            {language === 'zh' ? '管理和监控标注任务进度' : 'Manage and monitor annotation task progress'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('taskInfo', language)}</TableHead>
                  <TableHead>{t('progress', language)}</TableHead>
                  <TableHead>{language === 'zh' ? '标注状态' : 'Annotation Status'}</TableHead>
                  <TableHead>{t('timeInfo', language)}</TableHead>
                  <TableHead className="text-right">{t('actions', language)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">T10H1</div>
                        <div className="text-sm text-muted-foreground">
                          机会发现 • {task.queryCount} {language === 'zh' ? '条Query' : 'Queries'}
                        </div>
                        {task.error && (
                          <div className="text-xs text-red-600 mt-1">
                            {language === 'zh' ? '错误：' : 'Error: '}{task.error}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{task.annotatedCount}/{task.queryCount}</span>
                          <span>{task.progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={task.progress} className="w-24" />
                        {task.estimatedTime && (
                          <div className="text-xs text-muted-foreground">
                            {language === 'zh' ? `预计剩余 ${task.estimatedTime} 分钟` : `Estimated ${task.estimatedTime} min remaining`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(task.status)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {task.startTime && (
                        <div>{language === 'zh' ? '开始：' : 'Start: '}{task.startTime}</div>
                      )}
                      {task.endTime && (
                        <div>{language === 'zh' ? '结束：' : 'End: '}{task.endTime}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {task.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTaskAction(task.id, 'start')}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {task.status === 'running' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewResults(task.id, task.type)}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {task.status === 'paused' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTaskAction(task.id, 'resume')}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {task.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewResults(task.id, task.type)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {task.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast.success(language === 'zh' ? '正在下载结果...' : 'Downloading results...');
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskAction(task.id, 'delete')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {language === 'zh' ? '暂无标注任务' : 'No annotation tasks'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};