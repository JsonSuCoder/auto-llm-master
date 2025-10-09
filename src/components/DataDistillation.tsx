import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { 
  Database, Play, Pause, Download, Eye, Trash2, 
  Clock, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language, t } from '../utils/translations';

interface DataDistillationProps {
  language: Language;
  onViewResults: (taskId: number, taskName: string) => void;
}

export const DataDistillation: React.FC<DataDistillationProps> = ({ language, onViewResults }) => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedQueries, setSelectedQueries] = useState<number[]>([]);
  const [selectedNumber, setSelectedNumber] = useState('');
  const [selectedSecondLevel, setSelectedSecondLevel] = useState('');
  const [selectedThirdLevel, setSelectedThirdLevel] = useState('');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: language === 'zh' ? '问答类数据蒸馏任务01' : 'Q&A Data Distillation Task 01',
      type: language === 'zh' ? '问答类Query' : 'Q&A Query',
      status: 'completed',
      progress: 100,
      queryCount: 500,
      resultCount: 485,
      startTime: '2024-03-15 09:00',
      endTime: '2024-03-15 10:30',
      estimatedTime: null,
      error: null
    },
    {
      id: 2,
      name: language === 'zh' ? '对话类数据蒸馏任务02' : 'Dialog Data Distillation Task 02',
      type: language === 'zh' ? '对话类Query' : 'Dialog Query',
      status: 'running',
      progress: 65,
      queryCount: 300,
      resultCount: 195,
      startTime: '2024-03-15 11:00',
      endTime: null,
      estimatedTime: 15,
      error: null
    },
    {
      id: 3,
      name: language === 'zh' ? '分类标注蒸馏任务03' : 'Classification Distillation Task 03',
      type: language === 'zh' ? '分类标注Query' : 'Classification Query',
      status: 'failed',
      progress: 23,
      queryCount: 200,
      resultCount: 0,
      startTime: '2024-03-15 12:00',
      endTime: '2024-03-15 12:15',
      estimatedTime: null,
      error: language === 'zh' ? '模型API调用超时' : 'Model API call timeout'
    },
    {
      id: 4,
      name: language === 'zh' ? '问答类数据蒸馏任务04' : 'Q&A Data Distillation Task 04',
      type: language === 'zh' ? '问答类Query' : 'Q&A Query',
      status: 'pending',
      progress: 0,
      queryCount: 150,
      resultCount: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null
    }
  ]);

  const [availableQueries] = useState([
    { 
      id: 1, 
      content: language === 'zh' ? '什么是机器学习？' : 'What is machine learning?', 
      type: language === 'zh' ? '问答类Query' : 'Q&A Query', 
      score: 8.5, 
      selected: false 
    },
    { 
      id: 2, 
      content: language === 'zh' ? '深度学习的原理是什么？' : 'What are the principles of deep learning?', 
      type: language === 'zh' ? '问答类Query' : 'Q&A Query', 
      score: 9.2, 
      selected: false 
    },
    { 
      id: 3, 
      content: language === 'zh' 
        ? '用户：你好\\n助手：您好，有什么可以帮助您的吗？' 
        : 'User: Hello\\nAssistant: Hello, how can I help you?', 
      type: language === 'zh' ? '对话类Query' : 'Dialog Query', 
      score: 7.8, 
      selected: false 
    },
    { 
      id: 4, 
      content: language === 'zh' ? '这是一篇关于人工智能的文章...' : 'This is an article about artificial intelligence...', 
      type: language === 'zh' ? '分类标注Query' : 'Classification Query', 
      score: 8.0, 
      selected: false 
    }
  ]);



  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [distillationCount, setDistillationCount] = useState(0);

  // 级联逻辑：当上级选择改变时重置下级选择
  useEffect(() => {
    setSelectedSecondLevel('');
    setSelectedThirdLevel('');
  }, [selectedNumber]);

  useEffect(() => {
    setSelectedThirdLevel('');
  }, [selectedSecondLevel]);

  // 根据三级选择生成最终的selectedType
  useEffect(() => {
    if (selectedNumber && selectedSecondLevel && selectedThirdLevel) {
      const secondLevelText = selectedSecondLevel === 'opportunity' ? 
        (language === 'zh' ? '机会发现' : 'Opportunity Discovery') :
        selectedSecondLevel === 'trend' ? 
        (language === 'zh' ? '趋势研判' : 'Trend Analysis') :
        (language === 'zh' ? '交易决策支持' : 'Trading Decision Support');
      
      setSelectedType(`T${selectedNumber}H${selectedSecondLevel === 'opportunity' ? '1' : selectedSecondLevel === 'trend' ? '2' : '3'} ${secondLevelText}`);
    } else {
      setSelectedType('');
    }
  }, [selectedNumber, selectedSecondLevel, selectedThirdLevel, language]);

  const queryTypes = [
    { value: language === 'zh' ? 'T10H1 机会发现' : 'T10H1 Opportunity Discovery', label: language === 'zh' ? 'T10H1 机会发现' : 'T10H1 Opportunity Discovery' },
    { value: language === 'zh' ? 'T10H2 趋势研判' : 'T10H2 Trend Analysis', label: language === 'zh' ? 'T10H2 趋势研判' : 'T10H2 Trend Analysis' },
    { value: language === 'zh' ? 'T10H3 交易决策支持' : 'T10H3 Trading Decision Support', label: language === 'zh' ? 'T10H3 交易决策支持' : 'T10H3 Trading Decision Support' }
  ];

  const filteredQueries = availableQueries.filter(query => 
    !selectedType || query.type === selectedType
  );

  const handleCreateTask = () => {
    if (!selectedType || selectedQueries.length === 0) {
      toast.error(language === 'zh' ? '请选择Query类型并设置蒸馏数量' : 'Please select query type and set distillation count');
      return;
    }

    const newTask = {
      id: tasks.length + 1,
      name: `${selectedType} ${language === 'zh' ? '蒸馏任务' : 'Distillation Task'} ${String(tasks.length + 1).padStart(2, '0')}`,
      type: selectedType,
      status: 'pending',
      progress: 0,
      queryCount: selectedQueries.length,
      resultCount: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null
    };

    setTasks([...tasks, newTask]);
    setSelectedQueries([]);
    setDistillationCount(0);
    setIsCreateDialogOpen(false);
    toast.success(t('taskCreated', language));
  };

  const handleStartTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            status: 'running',
            startTime: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US'),
            estimatedTime: Math.ceil(task.queryCount / 10) // 模拟预估时间
          }
        : task
    ));
    toast.success(t('taskStarted', language));
    
    // 模拟任务进度更新
    simulateTaskProgress(taskId);
  };

  const handleViewResults = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onViewResults(taskId, task.name);
    }
  };

  const simulateTaskProgress = (taskId: number) => {
    const interval = setInterval(() => {
      setTasks(currentTasks => {
        const updatedTasks = currentTasks.map(task => {
          if (task.id === taskId && task.status === 'running') {
            const newProgress = Math.min(task.progress + Math.random() * 10, 100);
            const newResultCount = Math.floor((newProgress / 100) * task.queryCount);
            
            if (newProgress >= 100) {
              clearInterval(interval);
              return {
                ...task,
                progress: 100,
                resultCount: newResultCount,
                status: 'completed',
                endTime: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US'),
                estimatedTime: null
              };
            }
            
            return {
              ...task,
              progress: newProgress,
              resultCount: newResultCount,
              estimatedTime: Math.max(0, task.estimatedTime - 1)
            };
          }
          return task;
        });
        
        return updatedTasks;
      });
    }, 2000);
  };

  const handlePauseTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: 'paused' }
        : task
    ));
    toast.success(t('taskPaused', language));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success(t('taskDeleted', language));
  };

  const handleExportResults = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.success(t('exportingResults', language, { name: task.name }));
    }
  };

  const handleQuerySelection = (queryId: number, checked: boolean) => {
    if (checked) {
      setSelectedQueries([...selectedQueries, queryId]);
    } else {
      setSelectedQueries(selectedQueries.filter(id => id !== queryId));
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
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            {t('failed', language)}
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

  return (
    <div className="space-y-6">
      {/* 创建新任务 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {t('dataDistillation', language)}
          </CardTitle>
          <CardDescription>
            {language === 'zh' 
              ? '选择Query进行数据蒸馏，生成高质量的训练数据'
              : 'Select Queries for data distillation and generate high-quality training data'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Play className="w-4 h-4 mr-2" />
                {t('createTask', language)}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none overflow-y-auto flex flex-col">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>{t('createDistillationTask', language)}</DialogTitle>
                <DialogDescription>
                  {t('selectQueryTypeAndData', language)}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 flex flex-col p-6 space-y-6">
                {/* Query类型选择 */}
                <div className="space-y-4">
                  <Label>{language === 'zh' ? 'Query类型' : 'Query Type'}</Label>
                  
                  {/* 第一级：二级场景选择 */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2">
                      {language === 'zh' ? '二级场景 (提问动机-H)' : 'Second Level (Motivation-H)'}
                    </Label>
                    <Select 
                      value={selectedSecondLevel} 
                      onValueChange={setSelectedSecondLevel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'zh' ? '选择二级场景' : 'Select Secondary Scenario'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opportunity">
                          {language === 'zh' ? '机会发现' : 'Opportunity Discovery'}
                        </SelectItem>
                        <SelectItem value="trend">
                          {language === 'zh' ? '趋势研判' : 'Trend Analysis'}
                        </SelectItem>
                        <SelectItem value="trading">
                          {language === 'zh' ? '交易决策支持' : 'Trading Decision Support'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 第二级：三级场景选择 */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2">
                      {language === 'zh' ? '三级场景（赛道-T）' : 'Third Level (Track-T)'}
                    </Label>
                    <Select 
                      value={selectedThirdLevel} 
                      onValueChange={setSelectedThirdLevel}
                      disabled={!selectedSecondLevel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'zh' ? '选择三级场景' : 'Select Tertiary Scenario'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rwa">RWA</SelectItem>
                        <SelectItem value="general">
                          {language === 'zh' ? '综合 (General)' : 'General'}
                        </SelectItem>
                        <SelectItem value="blue-chip">
                          {language === 'zh' ? '主流蓝筹 (Blue-Chip)' : 'Blue-Chip'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 第三级：编号选择 */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2">
                      {language === 'zh' ? 'Query编号' : 'Query Number'}
                    </Label>
                    <Select value={selectedNumber} onValueChange={setSelectedNumber} disabled={!selectedThirdLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'zh' ? '选择编号' : 'Select Number'} />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 当前选择的组合显示 */}
                  {selectedSecondLevel && selectedThirdLevel && selectedNumber && (
                    <div className="p-3 bg-muted rounded-lg">
                      <Label className="text-sm">
                        {language === 'zh' ? '当前选择：' : 'Current Selection:'}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {
                          selectedSecondLevel === 'opportunity' ? (language === 'zh' ? '机会发现' : 'Opportunity Discovery') :
                          selectedSecondLevel === 'trend' ? (language === 'zh' ? '趋势研判' : 'Trend Analysis') :
                          (language === 'zh' ? '交易决策支持' : 'Trading Decision Support')
                        } + {
                          selectedThirdLevel === 'rwa' ? 'RWA' :
                          selectedThirdLevel === 'general' ? (language === 'zh' ? '综合' : 'General') :
                          (language === 'zh' ? '主流蓝筹' : 'Blue-Chip')
                        } + {selectedNumber}
                      </p>
                    </div>
                  )}
                </div>

                {/* Query数据配置模块 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>
                      {language === 'zh' ? 'Query数据配置' : 'Query Data Configuration'}
                    </Label>
                    {selectedType && (
                      <div className="text-sm text-muted-foreground">
                        {language === 'zh' ? `当前类型可用: ${filteredQueries.length} 条` : `Available: ${filteredQueries.length} queries`}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="max-w-sm">
                      <Label htmlFor="distillationCount">
                        {language === 'zh' ? '蒸馏数量' : 'Distillation Count'}
                      </Label>
                      <Input
                        id="distillationCount"
                        type="number"
                        min="1"
                        max={500}
                        placeholder={language === 'zh' ? '输入要蒸馏的Query数量' : 'Enter number of queries to distill'}
                        className="mt-2"
                        value={selectedQueries.length}
                        onChange={(e) => {
                          const count = Math.min(parseInt(e.target.value) || 0, 500);
                          setSelectedQueries(Array.from({length: count}, (_, i) => i + 1));
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'zh' ? `最多可选择 500 条` : `Maximum 500 queries available`}
                      </p>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {language === 'zh' ? '待蒸馏query数量：500' : 'Queries pending distillation: 500'}
                    </div>
                  </div>
                </div>

                {/* 蒸馏Prompt模块 */}
                <div className="flex-1">
                  <Label htmlFor="distillationPrompt">
                    {language === 'zh' ? '蒸馏Prompt' : 'Distillation Prompt'}
                  </Label>
                  <div className="mt-2" style={{ height: '400px' }}>
                    <textarea
                      id="distillationPrompt"
                      className="w-full h-full p-3 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder={language === 'zh' 
                        ? '请输入用于数据蒸馏的Prompt命令，用于指导模型如何处理和生成数据...' 
                        : 'Enter the prompt instructions for data distillation to guide the model on how to process and generate data...'
                      }
                      defaultValue={selectedType ? `You are an expert financial analyst. Please analyze the following query and provide structured insights based on the scenario type: ${selectedType}

Instructions:
1. Extract key market indicators and metrics mentioned in the query
2. Identify the primary focus area (opportunity discovery, trend analysis, or trading decision support)
3. Provide actionable insights with clear reasoning
4. Include relevant risk factors and considerations
5. Structure your response in a clear, professional format

Query to analyze: [QUERY_CONTENT_PLACEHOLDER]

Please provide your analysis following the above guidelines.` : ''}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === 'zh' 
                      ? '此Prompt将用于指导AI模型进行数据蒸馏，生成高质量的训练数据' 
                      : 'This prompt will guide the AI model in data distillation to generate high-quality training data'
                    }
                  </p>
                </div>
              </div>

              <DialogFooter className="p-6 pt-0">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t('cancel', language)}
                </Button>
                <Button onClick={handleCreateTask}>
                  {t('createTask', language)}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('distillationTaskList', language)}</CardTitle>
          <CardDescription>
            {t('manageDistillationTasks', language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('taskInfo', language)}</TableHead>
                  <TableHead>{t('progress', language)}</TableHead>
                  <TableHead>{language === 'zh' ? '蒸馏状态' : 'Distillation Status'}</TableHead>
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
                          <span>{task.resultCount}/{task.queryCount}</span>
                          <span>{task.progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={task.progress} className="w-24" />
                        {task.estimatedTime && (
                          <div className="text-xs text-muted-foreground">
                            {t('estimatedRemaining', language, { minutes: task.estimatedTime.toString() })}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(task.status)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {task.startTime && (
                        <div>{t('startTime', language, { time: task.startTime })}</div>
                      )}
                      {task.endTime && (
                        <div>{t('endTime', language, { time: task.endTime })}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {task.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartTask(task.id)}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {task.status === 'running' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePauseTask(task.id)}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {task.status === 'completed' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExportResults(task.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewResults(task.id)}
                              disabled={task.status !== 'completed'}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-destructive hover:text-destructive"
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
              {t('noDistillationTasks', language)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('totalTasks', language)}</p>
                <p className="text-xl font-semibold">{tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('completed', language)}</p>
                <p className="text-xl font-semibold">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('running', language)}</p>
                <p className="text-xl font-semibold">
                  {tasks.filter(t => t.status === 'running').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('failed', language)}</p>
                <p className="text-xl font-semibold">
                  {tasks.filter(t => t.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};