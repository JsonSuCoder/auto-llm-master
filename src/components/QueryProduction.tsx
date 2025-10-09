import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Plus, Upload, FileText, Wand2, Search, Edit, Check, X, 
  Star, AlertCircle, Download, Filter, Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language, t } from '../utils/translations';

interface QueryProductionProps {
  language: Language;
}

export const QueryProduction: React.FC<QueryProductionProps> = ({ language }) => {
  const [selectedType, setSelectedType] = useState('');
  
  // 三级联动选择框状态
  const [selectedQueryNumber, setSelectedQueryNumber] = useState('');
  const [selectedSecondLevel, setSelectedSecondLevel] = useState('');
  const [selectedThirdLevel, setSelectedThirdLevel] = useState('');
  
  // 编辑相关状态
  const [isEditingGuidance, setIsEditingGuidance] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isEditingQuality, setIsEditingQuality] = useState(false);
  const [editGuidanceText, setEditGuidanceText] = useState('');
  const [editPromptText, setEditPromptText] = useState('');
  const [editQualityText, setEditQualityText] = useState('');
  
  // 存储当前内容
  const [currentGuidance, setCurrentGuidance] = useState(
    language === 'zh'
      ? '生成自然的问答对话，包含问题和标准答案，确保问题具有明确性和答案的准确性。'
      : 'Generate natural Q&A conversations, including questions and standard answers, ensuring questions are clear and answers are accurate.'
  );
  const [currentPrompt, setCurrentPrompt] = useState(
    language === 'zh'
      ? '请生成一个关于{topic}的问答对话，要求问题清晰明确，答案准确详细。'
      : 'Please generate a Q&A conversation about {topic}, with clear questions and detailed accurate answers.'
  );
  const [currentQuality, setCurrentQuality] = useState(
    language === 'zh'
      ? '• 问题表述清晰无歧义\n• 答案准确且完整\n• 语言自然流畅'
      : '• Questions are clear and unambiguous\n• Answers are accurate and complete\n• Language is natural and fluent'
  );
  
  const [queries, setQueries] = useState([
    {
      id: 1,
      type: language === 'zh' ? 'QT002+趋势研判' : 'QT002+Trend Analysis',
      content: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
      score: 8.5,
      status: 'confirmed',
      autoEvaluated: true,
      createdAt: '2024-03-15 14:30',
      confirmedBy: language === 'zh' ? '张三' : 'Zhang San'
    },
    {
      id: 2,
      type: language === 'zh' ? 'QT003+交易决策支持' : 'QT003+Trading Decision Support',
      content: 'Why did BTC rise first and then fall after the September 5 NFP release?',
      score: 9.2,
      status: 'confirmed',
      autoEvaluated: true,
      createdAt: '2024-03-15 14:28',
      confirmedBy: language === 'zh' ? '张三' : 'Zhang San'
    },
    {
      id: 3,
      type: language === 'zh' ? 'QT001+机会发现' : 'QT001+Opportunity Discovery',
      content: language === 'zh' 
        ? '用户：你好，我想了解RWA代币化的投资机会\\n助手：您好！我很乐意为您介绍RWA代币化的投资机会...'
        : 'User: Hello, I want to learn about RWA tokenization investment opportunities\\nAssistant: Hello! I\'d be happy to introduce you to RWA tokenization investment opportunities...',
      score: 7.8,
      status: 'pending',
      autoEvaluated: false,
      createdAt: '2024-03-15 14:25',
      confirmedBy: null
    },
    {
      id: 4,
      type: language === 'zh' ? 'QT002+趋势研判' : 'QT002+Trend Analysis',
      content: 'CPI will be released on July 15. What is the current market expectation, and how might BTC rise or fall under different CPI outcomes?',
      score: 6.5,
      status: 'rejected',
      autoEvaluated: true,
      createdAt: '2024-03-15 14:20',
      confirmedBy: null
    },
    {
      id: 5,
      type: language === 'zh' ? 'QT001+机会发现' : 'QT001+Opportunity Discovery',
      content: language === 'zh' 
        ? 'RWA代币化项目中哪些资产类别具有最高的投资潜力？'
        : 'Which asset classes in RWA tokenization projects have the highest investment potential?',
      score: 8.7,
      status: 'confirmed',
      autoEvaluated: true,
      createdAt: '2024-03-15 13:45',
      confirmedBy: language === 'zh' ? '李四' : 'Li Si'
    },
    {
      id: 6,
      type: language === 'zh' ? 'QT003+交易决策支持' : 'QT003+Trading Decision Support',
      content: language === 'zh'
        ? '基于当前市场情况，应该在什么时机进入RWA相关代币？'
        : 'Based on current market conditions, when should we enter RWA-related tokens?',
      score: 7.9,
      status: 'pending',
      autoEvaluated: false,
      createdAt: '2024-03-15 13:20',
      confirmedBy: null
    },
    {
      id: 7,
      type: language === 'zh' ? 'QT002+趋势研判' : 'QT002+Trend Analysis',
      content: 'What are the key regulatory developments affecting RWA tokenization in 2024?',
      score: 8.1,
      status: 'confirmed',
      autoEvaluated: true,
      createdAt: '2024-03-15 12:55',
      confirmedBy: language === 'zh' ? '王五' : 'Wang Wu'
    },
    {
      id: 8,
      type: language === 'zh' ? 'QT001+机会发现' : 'QT001+Opportunity Discovery',
      content: language === 'zh'
        ? '房地产代币化项目中存在哪些投资机会和风险？'
        : 'What investment opportunities and risks exist in real estate tokenization projects?',
      score: 7.3,
      status: 'pending',
      autoEvaluated: false,
      createdAt: '2024-03-15 12:30',
      confirmedBy: null
    },
    {
      id: 9,
      type: language === 'zh' ? 'QT003+交易决策支持' : 'QT003+Trading Decision Support',
      content: 'How should we adjust our RWA portfolio allocation considering the recent market volatility?',
      score: 6.8,
      status: 'rejected',
      autoEvaluated: true,
      createdAt: '2024-03-15 12:10',
      confirmedBy: null
    },
    {
      id: 10,
      type: language === 'zh' ? 'QT002+趋势研判' : 'QT002+Trend Analysis',
      content: language === 'zh'
        ? '传统金融机构对RWA代币化的态度如何变化？'
        : 'How is the attitude of traditional financial institutions towards RWA tokenization changing?',
      score: 8.4,
      status: 'confirmed',
      autoEvaluated: true,
      createdAt: '2024-03-15 11:45',
      confirmedBy: language === 'zh' ? '张三' : 'Zhang San'
    },
    {
      id: 11,
      type: language === 'zh' ? 'QT001+机会发现' : 'QT001+Opportunity Discovery',
      content: 'Which DeFi protocols are leading the RWA integration space?',
      score: 7.6,
      status: 'pending',
      autoEvaluated: false,
      createdAt: '2024-03-15 11:20',
      confirmedBy: null
    },
    {
      id: 12,
      type: language === 'zh' ? 'QT003+交易决策支持' : 'QT003+Trading Decision Support',
      content: language === 'zh'
        ? '在当前利率环境下，RWA代币的收益率预期如何？'
        : 'What are the yield expectations for RWA tokens in the current interest rate environment?',
      score: 8.9,
      status: 'confirmed',
      autoEvaluated: true,
      createdAt: '2024-03-15 10:55',
      confirmedBy: language === 'zh' ? '李四' : 'Li Si'
    },
    {
      id: 13,
      type: language === 'zh' ? 'QT002+趋势研判' : 'QT002+Trend Analysis',
      content: 'What impact will CBDCs have on the RWA tokenization market?',
      score: 7.2,
      status: 'pending',
      autoEvaluated: false,
      createdAt: '2024-03-15 10:30',
      confirmedBy: null
    },
    {
      id: 14,
      type: language === 'zh' ? 'QT001+机会发现' : 'QT001+Opportunity Discovery',
      content: language === 'zh'
        ? '艺术品和收藏品代币化领域有哪些新兴机会？'
        : 'What emerging opportunities exist in the art and collectibles tokenization space?',
      score: 6.9,
      status: 'rejected',
      autoEvaluated: true,
      createdAt: '2024-03-15 10:05',
      confirmedBy: null
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateCount, setGenerateCount] = useState(100);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newQuery, setNewQuery] = useState('');

  // 三级联动数据结构 - 重构为以二级场景为key
  const cascadeData = {
    [language === 'zh' ? '机会发现' : 'Opportunity Discovery']: {
      thirdLevel: [
        { value: 'rwa', label: 'RWA' },
        { value: 'general', label: language === 'zh' ? '综合 (General)' : 'General' },
        { value: 'bluechip', label: language === 'zh' ? '主流蓝筹 (Blue-Chip)' : 'Blue-Chip' }
      ],
      queryNumbers: [
        { value: 'T10H1', label: 'T10H1' }
      ]
    },
    [language === 'zh' ? '趋势研判' : 'Trend Analysis']: {
      thirdLevel: [
        { value: 'rwa', label: 'RWA' },
        { value: 'general', label: language === 'zh' ? '综合 (General)' : 'General' },
        { value: 'bluechip', label: language === 'zh' ? '主流蓝筹 (Blue-Chip)' : 'Blue-Chip' }
      ],
      queryNumbers: [
        { value: 'T10H2', label: 'T10H2' }
      ]
    },
    [language === 'zh' ? '交易决策支持' : 'Trading Decision Support']: {
      thirdLevel: [
        { value: 'rwa', label: 'RWA' },
        { value: 'general', label: language === 'zh' ? '综合 (General)' : 'General' },
        { value: 'bluechip', label: language === 'zh' ? '主流蓝筹 (Blue-Chip)' : 'Blue-Chip' }
      ],
      queryNumbers: [
        { value: 'T10H3', label: 'T10H3' }
      ]
    }
  };

  const secondLevelOptions = [
    { value: language === 'zh' ? '机会发现' : 'Opportunity Discovery', label: language === 'zh' ? '机会发现' : 'Opportunity Discovery' },
    { value: language === 'zh' ? '趋势研判' : 'Trend Analysis', label: language === 'zh' ? '趋势研判' : 'Trend Analysis' },
    { value: language === 'zh' ? '交易决策支持' : 'Trading Decision Support', label: language === 'zh' ? '交易决策支持' : 'Trading Decision Support' }
  ];

  const queryTypes = [
    { 
      value: language === 'zh' ? 'QT001+机会发现' : 'QT001+Opportunity Discovery', 
      label: language === 'zh' ? 'QT001+机会发现' : 'QT001+Opportunity Discovery' 
    },
    { 
      value: language === 'zh' ? 'QT002+趋势研判' : 'QT002+Trend Analysis', 
      label: language === 'zh' ? 'QT002+趋势研判' : 'QT002+Trend Analysis' 
    },
    { 
      value: language === 'zh' ? 'QT003+交易决策支持' : 'QT003+Trading Decision Support', 
      label: language === 'zh' ? 'QT003+交易决策支持' : 'QT003+Trading Decision Support' 
    }
  ];
  
  // 级联选择处理函数 - 重构为新的顺序
  const handleSecondLevelChange = (value: string) => {
    setSelectedSecondLevel(value);
    setSelectedThirdLevel('');
    setSelectedQueryNumber('');
    // 清空类型选择
    setSelectedType('');
  };

  const handleThirdLevelChange = (value: string) => {
    setSelectedThirdLevel(value);
    setSelectedQueryNumber('');
    // 清空类型选择
    setSelectedType('');
  };

  const handleQueryNumberChange = (value: string) => {
    setSelectedQueryNumber(value);
    // 组合成完整的类型值
    if (selectedSecondLevel && selectedThirdLevel && value) {
      const fullType = `${value}+${selectedSecondLevel}`;
      setSelectedType(fullType);
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || query.status === filterStatus;
    const matchesType = !selectedType || query.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleGenerateQueries = async () => {
    if (!selectedSecondLevel || !selectedThirdLevel || !selectedQueryNumber) {
      toast.error(language === 'zh' ? '请完成三级选择：二级场景、三级场景和Query编号' : 'Please complete all three levels: Second Level, Third Level, and Query Number');
      return;
    }

    setIsGenerating(true);
    
    // 模拟生成过程
    setTimeout(() => {
      const newQueries = Array.from({ length: generateCount }, (_, index) => ({
        id: queries.length + index + 1,
        type: selectedType,
        content: language === 'zh' 
          ? `自动生成的${selectedType}内容 ${index + 1}`
          : `Auto-generated ${selectedType} content ${index + 1}`,
        score: Math.random() * 4 + 6, // 6-10分
        status: Math.random() > 0.3 ? 'pending' : 'rejected',
        autoEvaluated: false,
        createdAt: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US'),
        confirmedBy: null
      }));

      setQueries([...queries, ...newQueries]);
      setIsGenerating(false);
      toast.success(t('generateSuccess', language, { count: generateCount.toString() }));
    }, 3000);
  };

  const handleAddQuery = () => {
    if (!selectedType || !newQuery) {
      toast.error(language === 'zh' ? '请选择Query类型并输入内容' : 'Please select Query type and enter content');
      return;
    }

    const query = {
      id: queries.length + 1,
      type: selectedType,
      content: newQuery,
      score: null,
      status: 'draft',
      autoEvaluated: false,
      createdAt: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US'),
      confirmedBy: null
    };

    setQueries([...queries, query]);
    setNewQuery('');
    setIsAddDialogOpen(false);
    toast.success(t('queryAddSuccess', language));
  };

  const handleConfirmQuery = (queryId) => {
    setQueries(queries.map(query =>
      query.id === queryId
        ? { ...query, status: 'confirmed', confirmedBy: language === 'zh' ? '当前用户' : 'Current User' }
        : query
    ));
    toast.success(t('queryConfirmed', language));
  };

  const handleRejectQuery = (queryId) => {
    setQueries(queries.map(query =>
      query.id === queryId
        ? { ...query, status: 'rejected' }
        : query
    ));
    toast.success(t('queryRejected', language));
  };

  const getStatusBadge = (status, score) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800">{t('confirmed', language)}</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">{t('pending', language)}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('rejected', language)}</Badge>;
      case 'draft':
        return <Badge variant="outline">{language === 'zh' ? '草稿' : 'Draft'}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getScoreBadge = (score) => {
    if (!score) return null;
    const color = score >= 8 ? 'text-green-600' : score >= 7 ? 'text-yellow-600' : 'text-red-600';
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Star className="w-3 h-3" />
        <span className="text-xs font-medium">{score.toFixed(1)}</span>
      </div>
    );
  };

  // 编辑处理函数
  const handleEditGuidance = () => {
    setEditGuidanceText(currentGuidance);
    setIsEditingGuidance(true);
  };

  const handleEditPrompt = () => {
    setEditPromptText(currentPrompt);
    setIsEditingPrompt(true);
  };

  const handleEditQuality = () => {
    setEditQualityText(currentQuality);
    setIsEditingQuality(true);
  };

  const handleSaveGuidance = () => {
    setCurrentGuidance(editGuidanceText);
    setIsEditingGuidance(false);
    toast.success(language === 'zh' ? '生产指引已更新' : 'Guidance updated successfully');
  };

  const handleSavePrompt = () => {
    setCurrentPrompt(editPromptText);
    setIsEditingPrompt(false);
    toast.success(language === 'zh' ? '提示语模板已更新' : 'Prompt template updated successfully');
  };

  const handleSaveQuality = () => {
    setCurrentQuality(editQualityText);
    setIsEditingQuality(false);
    toast.success(language === 'zh' ? '质量标准已更新' : 'Quality standard updated successfully');
  };

  // 一键评判功能
  const handleBatchEvaluate = () => {
    const unevaluatedQueries = queries.filter(query => !query.autoEvaluated);
    
    if (unevaluatedQueries.length === 0) {
      toast.info(language === 'zh' ? '所有Query已完成自动评判' : 'All queries have been auto-evaluated');
      return;
    }

    toast.info(language === 'zh' ? `开始评判${unevaluatedQueries.length}条Query...` : `Starting evaluation of ${unevaluatedQueries.length} queries...`);
    
    // 模拟批量评判过程
    setTimeout(() => {
      setQueries(prevQueries => 
        prevQueries.map(query => 
          !query.autoEvaluated 
            ? { 
                ...query, 
                autoEvaluated: true,
                score: query.score || Math.random() * 4 + 6 // 6-10分
              }
            : query
        )
      );
      
      toast.success(language === 'zh' ? `成功完成${unevaluatedQueries.length}条Query的自动评判` : `Successfully completed auto-evaluation of ${unevaluatedQueries.length} queries`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* 类型选择和信息展示 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t('queryProduction', language)}
          </CardTitle>
          <CardDescription>
            {language === 'zh' 
              ? '选择Query类型，通过批量生成、上传或手动录入的方式生产高质量Query'
              : 'Select Query type, produce high-quality Queries through batch generation, upload or manual entry'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label className="mb-4">{t('selectQueryType', language)}</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 第一级：二级场景 */}
              <div>
                <Label className="text-sm mb-2">{language === 'zh' ? '二级场景 (提问动机-H)' : 'Second Level (Motivation-H)'}</Label>
                <Select value={selectedSecondLevel} onValueChange={handleSecondLevelChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'zh' ? '选择场景' : 'Select Scenario'} />
                  </SelectTrigger>
                  <SelectContent>
                    {secondLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 第二级：三级场景 */}
              <div>
                <Label className="text-sm mb-2">{language === 'zh' ? '三级场景（赛道-T）' : 'Third Level (Track-T)'}</Label>
                <Select value={selectedThirdLevel} onValueChange={handleThirdLevelChange} disabled={!selectedSecondLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'zh' ? '选择赛道' : 'Select Track'} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSecondLevel && cascadeData[selectedSecondLevel]?.thirdLevel.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 第三级：Query编号 */}
              <div>
                <Label className="text-sm mb-2">{language === 'zh' ? 'Query编号' : 'Query Number'}</Label>
                <Select value={selectedQueryNumber} onValueChange={handleQueryNumberChange} disabled={!selectedThirdLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'zh' ? '选择编号' : 'Select Number'} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSecondLevel && cascadeData[selectedSecondLevel]?.queryNumbers.map((number) => (
                      <SelectItem key={number.value} value={number.value}>
                        {number.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {selectedType && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6 p-[0px]">
              <Card className="bg-blue-50 dark:bg-blue-950">
                <CardHeader className="pb-0 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{t('guidance', language)}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditGuidance}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-sm text-muted-foreground">
                    {currentGuidance}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950">
                <CardHeader className="pb-0 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{language === 'zh' ? '提示语模板' : 'Prompt Template'}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditPrompt}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-sm text-muted-foreground font-mono">
                    {currentPrompt}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 dark:bg-purple-950">
                <CardHeader className="pb-0 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{t('qualityStandard', language)}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditQuality}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="text-sm text-muted-foreground space-y-1">
                    {currentQuality.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 生产操作 */}
      {selectedType && (
        <Card>
          <CardHeader>
            <CardTitle>{t('productionOperations', language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generate">{t('batchGeneration', language)}</TabsTrigger>
                <TabsTrigger value="upload">{t('batchUpload', language)}</TabsTrigger>
                <TabsTrigger value="manual">{t('singleEntry', language)}</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="count" className="mb-0.5">{t('generateCount', language)}</Label>
                    <Input
                      id="count"
                      type="number"
                      value={generateCount}
                      onChange={(e) => setGenerateCount(Number(e.target.value))}
                      min="1"
                      max="500"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleGenerateQueries} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isGenerating ? t('generating', language) : t('startGeneration', language)}
                    </Button>
                  </div>
                </div>
                
                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{language === 'zh' ? '正在生成Query...' : 'Generating Queries...'}</span>
                      <span>{t('estimatedCompletion', language)}</span>
                    </div>
                    <Progress value={33} className="w-full" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('uploadExcel', language)}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('supportedFormats', language)}
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    {t('chooseFile', language)}
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>{t('ensureExcelFormat', language)}</span>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div>
                  <Label htmlFor="manualQuery">{t('queryContent', language)}</Label>
                  <Textarea
                    id="manualQuery"
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    placeholder={t('enterQueryContent', language)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleAddQuery}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addQuery', language)}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* 编辑弹窗 - 生产指引 */}
      <Dialog open={isEditingGuidance} onOpenChange={setIsEditingGuidance}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{language === 'zh' ? '编辑生产指引' : 'Edit Guidance'}</DialogTitle>
            <DialogDescription>
              {language === 'zh' ? '修改Query生产的指导内容' : 'Modify the guidance content for Query production'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editGuidance">{language === 'zh' ? '生产指引' : 'Production Guidance'}</Label>
              <Textarea
                id="editGuidance"
                value={editGuidanceText}
                onChange={(e) => setEditGuidanceText(e.target.value)}
                placeholder={language === 'zh' ? '输入生产指引内容...' : 'Enter guidance content...'}
                className="h-[400px]"
                rows={15}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingGuidance(false)}>
              {language === 'zh' ? '取消' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveGuidance}>
              {language === 'zh' ? '保存' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 - 提示语模板 */}
      <Dialog open={isEditingPrompt} onOpenChange={setIsEditingPrompt}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{language === 'zh' ? '编辑提示语模��' : 'Edit Prompt Template'}</DialogTitle>
            <DialogDescription>
              {language === 'zh' ? '修改用于生成Query的提示语模板' : 'Modify the prompt template for Query generation'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editPrompt">{language === 'zh' ? '提示语模板' : 'Prompt Template'}</Label>
              <Textarea
                id="editPrompt"
                value={editPromptText}
                onChange={(e) => setEditPromptText(e.target.value)}
                placeholder={language === 'zh' ? '输入提示语模板...' : 'Enter prompt template...'}
                className="h-[400px] font-mono"
                rows={15}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingPrompt(false)}>
              {language === 'zh' ? '取消' : 'Cancel'}
            </Button>
            <Button onClick={handleSavePrompt}>
              {language === 'zh' ? '保存' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 - 质量标准 */}
      <Dialog open={isEditingQuality} onOpenChange={setIsEditingQuality}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{language === 'zh' ? '编辑质量标准' : 'Edit Quality Standard'}</DialogTitle>
            <DialogDescription>
              {language === 'zh' ? '修改Query质量评判标准' : 'Modify the quality criteria for Query evaluation'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editQuality">{language === 'zh' ? '质量标准' : 'Quality Standard'}</Label>
              <Textarea
                id="editQuality"
                value={editQualityText}
                onChange={(e) => setEditQualityText(e.target.value)}
                placeholder={language === 'zh' ? '输入质量标准...' : 'Enter quality standard...'}
                className="h-[400px]"
                rows={15}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingQuality(false)}>
              {language === 'zh' ? '���消' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveQuality}>
              {language === 'zh' ? '保存' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Query列表 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('queryList', language)}</CardTitle>
          <CardDescription>
            {t('manageQueries', language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('searchQuery', language)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allStatus', language)}</SelectItem>
                  <SelectItem value="pending">{t('pending', language)}</SelectItem>
                  <SelectItem value="confirmed">{t('confirmed', language)}</SelectItem>
                  <SelectItem value="rejected">{t('rejected', language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBatchEvaluate}
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Zap className="w-4 h-4 mr-2" />
                {language === 'zh' ? '一键评判' : 'Batch Evaluate'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {t('export', language)}
              </Button>
              <Badge variant="outline">
                {t('total', language)} {filteredQueries.length} {t('records', language)}
              </Badge>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'zh' ? 'Query内容' : 'Query Content'}</TableHead>
                  <TableHead>{t('type', language)}</TableHead>
                  <TableHead>{t('score', language)}</TableHead>
                  <TableHead>{language === 'zh' ? '自动评判' : 'Auto Evaluated'}</TableHead>
                  <TableHead>{t('status', language)}</TableHead>
                  <TableHead>{language === 'zh' ? '创建时间' : 'Created Time'}</TableHead>
                  <TableHead className="text-right">{t('actions', language)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={query.content}>
                        {query.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{query.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {getScoreBadge(query.score)}
                    </TableCell>
                    <TableCell>
                      {query.autoEvaluated ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {language === 'zh' ? '已评判' : 'Evaluated'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          {language === 'zh' ? '待评判' : 'Pending'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(query.status, query.score)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {query.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {query.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleConfirmQuery(query.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectQuery(query.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredQueries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {selectedType ? t('noQueryData', language) : t('selectTypeFirst', language)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};