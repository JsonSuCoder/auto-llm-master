import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { 
  Eye, Users, BarChart3, Download, Settings, 
  Clock, CheckCircle, AlertTriangle, Play,
  ChevronLeft, ChevronRight, SkipForward, Save
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language, t } from '../utils/translations';

interface BlindEvaluationProps {
  language: Language;
}

export const BlindEvaluation: React.FC<BlindEvaluationProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('task-list');

  // 盲评任务列表
  const [evaluationTasks, setEvaluationTasks] = useState(() => [
    {
      id: 1,
      name: 'Query质量盲评任务01',
      nameEn: 'Query Quality Blind Evaluation Task 01',
      type: 'T1H1 机会发现',
      typeEn: 'T1H1 Opportunity Discovery',
      scope: '来自Query生产',
      scopeEn: 'From Query Production',
      status: 'running',
      progress: 65,
      evaluators: 3,
      totalSamples: 100,
      completedSamples: 65,
      startTime: '2024-03-15 10:00',
      endTime: null,
      estimatedTime: 25,
      error: null
    },
    {
      id: 2,
      name: '标注结果盲评任务02',
      nameEn: 'Annotation Results Blind Evaluation Task 02',
      type: 'T2H2 趋势研判',
      typeEn: 'T2H2 Trend Analysis',
      scope: '来自数据标注',
      scopeEn: 'From Data Annotation',
      status: 'completed',
      progress: 100,
      evaluators: 5,
      totalSamples: 200,
      completedSamples: 200,
      startTime: '2024-03-10 14:30',
      endTime: '2024-03-15 17:00',
      estimatedTime: null,
      error: null
    },
    {
      id: 4,
      name: '综合质量盲评任务04',
      nameEn: 'General Quality Blind Evaluation Task 04',
      type: 'T4H1 机会发现',
      typeEn: 'T4H1 Opportunity Discovery',
      scope: '来自Query生产',
      scopeEn: 'From Query Production',
      status: 'pending',
      progress: 0,
      evaluators: 4,
      totalSamples: 80,
      completedSamples: 0,
      startTime: null,
      endTime: null,
      estimatedTime: null,
      error: null
    }
  ]);

  // 当前评估项目（工作台模拟）
  const [currentEvaluation, setCurrentEvaluation] = useState({
    taskId: 1,
    currentIndex: 0,
    totalItems: 100,
    anonymousData: {
      queryId: 'EVAL-001',
      content: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
      type: 'T10H1 机会发现',
      isABTest: true,
      resultA: 'Step 1: Establish Narrative Alignment and Sector Positioning \nBegin by rigorously determining the token\'s core narrative alignment, as this forms the foundation for all subsequent comparative analysis. This involves a dual-track approach: first, conduct a deep-dive into the project\'s official documentation, whitepaper, and technical resources to extract its primary purpose, technology stack, and intended sector narrative (e.g., L1, DePIN, AI, RWA). Simultaneously, assess market perception by aggregating narrative tags from leading data aggregators (such as CoinGecko, Messari) and quantifying keyword associations in both official communications and organic social discourse. This triangulation ensures that both the project\'s self-identified narrative and the prevailing market-assigned narrative are captured, with discrepancies flagged for further scrutiny. Dominant narrative alignment should be weighted by resource allocation and marketing focus, while secondary alignments are noted for context. This step is critical because accurate narrative placement determines the relevant competitive landscape and frames all peer comparisons.',
      resultB: 'Define and Segment the Peer Group for Benchmarking \nWith the narrative established, construct a robust peer set for benchmarking. Identify direct competitors by extracting all tokens categorized under the same primary narrative from aggregator APIs, then refine this set by segmenting according to market capitalization tiers (e.g., Large-Cap, Mid-Cap, Small-Cap) to ensure comparability. Further sub-segment by functional niche within the narrative (e.g., within DePIN, distinguish between Storage, Compute, Connectivity) to isolate the most relevant comparators. Manual verification of the top 5–10 closest peers based on business model and product delivery is essential to mitigate inconsistent aggregator tagging and to exclude outliers or projects lacking sufficient operational history. This segmentation is foundational for "apples-to-apples" analysis and ensures that all subsequent metrics are interpreted within an appropriate competitive context.'
    },
    selectedResult: '',
    comments: ''
  });

  // 评估结果数据
  const [evaluationResults, setEvaluationResults] = useState(() => [
    {
      id: 1,
      queryId: 'EVAL-001',
      content: 'Which narrative track does this token align with...',
      winningResult: 'A',
      evaluator: '盲评者001',
      evaluatorEn: 'Evaluator001',
      category: '机会发现',
      categoryEn: 'Opportunity Discovery'
    },
    {
      id: 2,
      queryId: 'EVAL-002',
      content: 'Why did BTC rise first and then fall after...',
      winningResult: 'B',
      evaluator: '盲评者002',
      evaluatorEn: 'Evaluator002',
      category: '趋势研判',
      categoryEn: 'Trend Analysis'
    },
    {
      id: 3,
      queryId: 'EVAL-003',
      content: 'What are the key factors driving...',
      winningResult: 'A',
      evaluator: '盲评者003',
      evaluatorEn: 'Evaluator003',
      category: '交易决策支持',
      categoryEn: 'Trading Decision Support'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">{t('running', language)}</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">{t('completed', language)}</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">{t('pending', language)}</Badge>;
      case 'exceptional':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">{t('exceptional', language)}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleTaskAction = (taskId: number, action: string) => {
    switch (action) {
      case 'start':
        setEvaluationTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, status: 'running' } : task
        ));
        toast.success(language === 'zh' ? '任���已开始' : 'Task started');
        break;
      case 'delete':
        setEvaluationTasks(prev => prev.filter(task => task.id !== taskId));
        toast.success(language === 'zh' ? '任务已删除' : 'Task deleted');
        break;
      case 'view':
        // 这里可以添加查看任务详情的逻辑
        toast.info(language === 'zh' ? '查看任务详情' : 'View task details');
        break;
    }
  };



  const handleSaveEvaluation = () => {
    if (!currentEvaluation.selectedResult) {
      toast.error(language === 'zh' ? '请选择一个结果' : 'Please select a result');
      return;
    }
    
    // 模拟保存到对应query的逻辑
    const evaluationRecord = {
      queryId: currentEvaluation.anonymousData.queryId,
      selectedResult: currentEvaluation.selectedResult,
      comments: currentEvaluation.comments,
      timestamp: new Date().toISOString(),
      evaluatorId: Math.random().toString(36).substr(2, 9) // 匿名ID
    };
    
    console.log('Saving evaluation:', evaluationRecord);
    toast.success(t('evaluationSaved', language));
    
    // 自动跳转到下一条，如果不是最后一条
    if (currentEvaluation.currentIndex < currentEvaluation.totalItems - 1) {
      setTimeout(() => {
        setCurrentEvaluation(prev => ({ 
          ...prev, 
          currentIndex: prev.currentIndex + 1,
          selectedResult: '',
          comments: ''
        }));
      }, 500); // 延迟500ms以让用户看到保存成功的提示
    } else {
      // 如果是最后一条，显示完成提示
      setTimeout(() => {
        toast.success(language === 'zh' ? '所有评估已完成！' : 'All evaluations completed!');
      }, 500);
    }
  };

  const renderTaskListTab = () => (
    <div className="space-y-6">
      {/* 任务列表 */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'zh' ? '盲评任务列表' : 'Evaluation Task List'}</CardTitle>
          <CardDescription>
            {language === 'zh' ? '管理和监控盲评任务进度' : 'Manage and monitor evaluation task progress'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'zh' ? '任务信息' : 'Task Info'}</TableHead>
                  <TableHead>{language === 'zh' ? '进度' : 'Progress'}</TableHead>
                  <TableHead>{language === 'zh' ? '盲评状态' : 'Evaluation Status'}</TableHead>
                  <TableHead>{language === 'zh' ? '时间信息' : 'Time Info'}</TableHead>
                  <TableHead className="text-right">{language === 'zh' ? '操作' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluationTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{(language === 'zh' ? task.type : task.typeEn).split(' ')[0]}</div>
                        <div className="text-sm text-muted-foreground">
                          {(language === 'zh' ? task.type : task.typeEn).split(' ').slice(1).join(' ')} • {task.totalSamples} {language === 'zh' ? '条Query' : 'Queries'}
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
                          <span>{task.completedSamples}/{task.totalSamples}</span>
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
                        <div>
                          {language === 'zh' ? '开始：' : 'Started: '}{task.startTime}
                        </div>
                      )}
                      {task.endTime && (
                        <div>
                          {language === 'zh' ? '结束：' : 'Ended: '}{task.endTime}
                        </div>
                      )}
                      {!task.startTime && (
                        <div className="text-muted-foreground">
                          {language === 'zh' ? '未开始' : 'Not started'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {task.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('workbench')}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {task.status === 'running' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('workbench')}
                          >
                            <Play className="w-4 h-4" />
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
                        {task.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('results')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {evaluationTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {language === 'zh' ? '暂无盲评任务' : 'No evaluation tasks'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkbenchTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('evaluatorWorkbench', language)}</CardTitle>
          <CardDescription>
            {language === 'zh' ? `任务进度：${currentEvaluation.currentIndex + 1}/${currentEvaluation.totalItems}` : 
             `Task Progress: ${currentEvaluation.currentIndex + 1}/${currentEvaluation.totalItems}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={(currentEvaluation.currentIndex + 1) / currentEvaluation.totalItems * 100} className="w-full" />

          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{currentEvaluation.anonymousData.queryId}</Badge>
                <Badge>{currentEvaluation.anonymousData.type}</Badge>
              </div>
              <p className="text-sm mb-4">{currentEvaluation.anonymousData.content}</p>
              
              {currentEvaluation.anonymousData.isABTest && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`border rounded p-0 cursor-pointer transition-all h-[400px] flex flex-col ${
                      currentEvaluation.selectedResult === 'A' 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setCurrentEvaluation(prev => ({ ...prev, selectedResult: 'A' }))}
                  >
                    <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0">
                      <h4 className="font-medium">{language === 'zh' ? '结果 A' : 'Result A'}</h4>
                      {currentEvaluation.selectedResult === 'A' && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 pt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{currentEvaluation.anonymousData.resultA}</p>
                    </div>
                  </div>
                  <div 
                    className={`border rounded p-0 cursor-pointer transition-all h-[400px] flex flex-col ${
                      currentEvaluation.selectedResult === 'B' 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setCurrentEvaluation(prev => ({ ...prev, selectedResult: 'B' }))}
                  >
                    <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0">
                      <h4 className="font-medium">{language === 'zh' ? '结果 B' : 'Result B'}</h4>
                      {currentEvaluation.selectedResult === 'B' && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 pt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{currentEvaluation.anonymousData.resultB}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button 
              variant="outline"
              disabled={currentEvaluation.currentIndex === 0}
              onClick={() => setCurrentEvaluation(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }))}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t('previousItem', language)}
            </Button>

            <Button 
              onClick={handleSaveEvaluation}
              disabled={!currentEvaluation.selectedResult}
              className="px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('save', language)}
            </Button>

            <Button 
              disabled={currentEvaluation.currentIndex === currentEvaluation.totalItems - 1}
              onClick={() => setCurrentEvaluation(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }))}
            >
              {t('nextItem', language)}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );



  const renderResultsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('evaluationResults', language)}</CardTitle>
              <CardDescription>{t('statisticalMetrics', language)}</CardDescription>
            </div>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              {t('downloadReport', language)}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">67%</div>
                <div className="text-sm text-muted-foreground">{language === 'zh' ? '蒸馏获胜率' : 'Distillation Win Rate'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">33%</div>
                <div className="text-sm text-muted-foreground">{language === 'zh' ? '标注获胜率' : 'Annotation Win Rate'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">{language === 'zh' ? '已完成评估' : 'Completed Evaluations'}</div>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'zh' ? 'Query内容' : 'Query Content'}</TableHead>
                  <TableHead>{language === 'zh' ? '获胜结果' : 'Winning Result'}</TableHead>
                  <TableHead>{language === 'zh' ? '盲评者' : 'Evaluator'}</TableHead>
                  <TableHead>{t('category', language)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluationResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={result.content}>
                        {result.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={result.winningResult === 'A' ? 'default' : 'secondary'}>
                        {result.winningResult === 'A' 
                          ? (language === 'zh' ? '蒸馏' : 'Distillation')
                          : (language === 'zh' ? '标注' : 'Annotation')
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{language === 'zh' ? result.evaluator : result.evaluatorEn}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{language === 'zh' ? result.category : result.categoryEn}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t('blindEvaluationTitle', language)}</h1>
        <p className="text-muted-foreground">
          {language === 'zh' 
            ? '��持从Query生产、数据标注和数据蒸馏创建盲评任务，确保数据质量客观评估' 
            : 'Support creating blind evaluation tasks from Query production, data annotation, and data distillation to ensure objective data quality assessment'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="task-list" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {language === 'zh' ? '盲评任务列表' : 'Evaluation Task List'}
          </TabsTrigger>
          <TabsTrigger value="workbench" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t('evaluationWorkbench', language)}
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t('evaluationResults', language)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="task-list">
          {renderTaskListTab()}
        </TabsContent>

        <TabsContent value="workbench">
          {renderWorkbenchTab()}
        </TabsContent>

        <TabsContent value="results">
          {renderResultsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};