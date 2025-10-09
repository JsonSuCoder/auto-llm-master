import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { Plus, Edit, Trash2, Search, Settings, FileText, Star, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language, t } from '../utils/translations';

interface QueryTypeManagementProps {
  language: Language;
}

export const QueryTypeManagement: React.FC<QueryTypeManagementProps> = ({ language }) => {
  const [queryTypes, setQueryTypes] = useState([
    {
      id: 1,
      code: 'QA001',
      L1_SCENE_ID: 'A',
      L2_SCENE_ID: 'T1',
      L3_SCENE_ID: 'H1',
      name: language === 'zh' ? '机会发现' : 'Opportunity Discovery',
      secondaryScene: language === 'zh' ? '机会发现' : 'Opportunity Discovery',
      tertiaryScene: 'RWA',
      sceneSummary: language === 'zh' ? '识别和发现市场投资机会' : 'Identify and discover market investment opportunities',
      description: language === 'zh' ? '新兴RWA代币机会' : 'Emerging RWA token opportunities',
      guidance: language === 'zh' 
        ? '生成针对市场机会识别的问题，包含对投资机会的分析和判断，确保问题具有前瞻性和实用性。'
        : 'Generate questions for market opportunity identification, including analysis and judgment of investment opportunities.',
      prompt: language === 'zh'
        ? '请生成一个关于{topic}的机会发现问题，要求具有前瞻性和可操作性。'
        : 'Please generate an opportunity discovery question about {topic} that is forward-looking and actionable.',
      distilledPrompt: language === 'zh'
        ? '分析{topic}的投资机会：评估市场潜力、竞争优势和风险因素。'
        : 'Analyze {topic} investment opportunities: assess market potential, competitive advantages, and risk factors.',
      qualityStandard: language === 'zh'
        ? '1. 问题具有前瞻性\\n2. 分析维度全面\\n3. 结论具有可操作性\\n4. 符合投资逻辑'
        : '1. Forward-looking questions\\n2. Comprehensive analysis\\n3. Actionable conclusions\\n4. Sound investment logic',
      createdAt: '2024-01-15',
      status: 'active',
      queryCount: 1250
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [newType, setNewType] = useState({
    code: '',
    name: '',
    tertiaryScene: '',
    description: '',
    guidance: '',
    prompt: '',
    distilledPrompt: '',
    qualityStandard: ''
  });

  const filteredTypes = queryTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.tertiaryScene.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddType = () => {
    if (!newType.code || !newType.name || !newType.tertiaryScene || !newType.description || !newType.guidance || !newType.prompt || !newType.distilledPrompt || !newType.qualityStandard) {
      toast.error(t('fillCompleteInfo', language));
      return;
    }

    const type = {
      id: queryTypes.length + 1,
      ...newType,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      queryCount: 0
    };

    setQueryTypes([...queryTypes, type]);
    setNewType({
      code: '',
      name: '',
      tertiaryScene: '',
      description: '',
      guidance: '',
      prompt: '',
      distilledPrompt: '',
      qualityStandard: ''
    });
    setIsDialogOpen(false);
    toast.success(t('queryTypeAddSuccess', language));
  };

  const handleUpdateType = () => {
    if (!newType.code || !newType.name || !newType.tertiaryScene || !newType.description || !newType.guidance || !newType.prompt || !newType.distilledPrompt || !newType.qualityStandard) {
      toast.error(t('fillCompleteInfo', language));
      return;
    }

    setQueryTypes(queryTypes.map(type =>
      type.id === editingType.id
        ? { ...type, ...newType }
        : type
    ));
    
    setEditingType(null);
    setNewType({
      code: '',
      name: '',
      tertiaryScene: '',
      description: '',
      guidance: '',
      prompt: '',
      distilledPrompt: '',
      qualityStandard: ''
    });
    setIsDialogOpen(false);
    toast.success(t('queryTypeUpdateSuccess', language));
  };

  const handleEditType = (type) => {
    setEditingType(type);
    setNewType({
      code: type.code || '',
      name: type.name,
      tertiaryScene: type.tertiaryScene || '',
      description: type.description,
      guidance: type.guidance,
      prompt: type.prompt,
      distilledPrompt: type.distilledPrompt || '',
      qualityStandard: type.qualityStandard
    });
    setIsDialogOpen(true);
  };

  const handleDeleteType = (typeId) => {
    setQueryTypes(queryTypes.filter(type => type.id !== typeId));
    toast.success(t('queryTypeDeleted', language));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">{t('active', language)}</Badge>;
      case 'inactive':
        return <Badge variant="outline">{t('inactive', language)}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('queryTypeManagement', language)}
          </CardTitle>
          <CardDescription>
            {t('configureQueryType', language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={language === 'zh' ? '搜索Query类型...' : 'Search Query types...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingType(null);
                  setNewType({
                    code: '',
                    name: '',
                    tertiaryScene: '',
                    description: '',
                    guidance: '',
                    prompt: '',
                    distilledPrompt: '',
                    qualityStandard: ''
                  });
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addType', language)}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none overflow-y-auto p-0">
                <div className="h-full flex flex-col">
                <DialogHeader className="p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <DialogTitle className="text-xl">
                    {editingType ? t('editQueryType', language) : t('addQueryType', language)}
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    {t('configureQueryType', language)}
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full flex-1 flex flex-col px-6 py-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">{t('basicInfo', language)}</TabsTrigger>
                    <TabsTrigger value="guidance">{t('guidance', language)}</TabsTrigger>
                    <TabsTrigger value="prompt">{language === 'zh' ? '生成问题prompt' : 'Generate Question Prompt'}</TabsTrigger>
                    <TabsTrigger value="distilled">{language === 'zh' ? '蒸馏的Prompt' : 'Distilled Prompt'}</TabsTrigger>
                    <TabsTrigger value="quality">{t('qualityStandard', language)}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="code">{t('code', language)}</Label>
                        <Input
                          id="code"
                          value={newType.code || ''}
                          onChange={(e) => setNewType({ ...newType, code: e.target.value })}
                          placeholder={t('enterCode', language)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">{language === 'zh' ? '二级场景 (提问动机-H)' : 'Secondary Scene (Motivation-H)'}</Label>
                        <Input
                          id="name"
                          value={newType.name}
                          onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                          placeholder={t('enterTypeName', language)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="tertiaryScene">{t('tertiaryScene', language)}</Label>
                      <Input
                        id="tertiaryScene"
                        value={newType.tertiaryScene || ''}
                        onChange={(e) => setNewType({ ...newType, tertiaryScene: e.target.value })}
                        placeholder={t('enterTertiaryScene', language)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">{t('description', language)}</Label>
                      <Textarea
                        id="description"
                        value={newType.description}
                        onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                        placeholder={t('describeType', language)}
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="guidance" className="space-y-4">
                    <div>
                      <Label htmlFor="guidance">{t('productionGuidance', language)}</Label>
                      <Textarea
                        id="guidance"
                        value={newType.guidance}
                        onChange={(e) => setNewType({ ...newType, guidance: e.target.value })}
                        placeholder={t('detailedGuidance', language)}
                        className="h-[400px]"
                        rows={6}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('guidanceHelp', language)}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="prompt" className="space-y-4">
                    <div>
                      <Label htmlFor="prompt">{t('modelPrompt', language)}</Label>
                      <Textarea
                        id="prompt"
                        value={newType.prompt}
                        onChange={(e) => setNewType({ ...newType, prompt: e.target.value })}
                        placeholder={language === 'zh' ? '输入用于生成Query的大模型提示语' : 'Enter large model prompt for Query generation'}
                        className="h-[400px]"
                        rows={6}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('promptHelp', language)}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="distilled" className="space-y-4">
                    <div>
                      <Label htmlFor="distilledPrompt">{language === 'zh' ? '蒸馏的prompt' : 'Distilled Prompt'}</Label>
                      <Textarea
                        id="distilledPrompt"
                        value={newType.distilledPrompt || ''}
                        onChange={(e) => setNewType({ ...newType, distilledPrompt: e.target.value })}
                        placeholder={language === 'zh' ? '输入经过蒸馏优化的提示语模板' : 'Enter distilled and optimized prompt template'}
                        className="h-[400px]"
                        rows={6}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'zh' ? '蒸馏的Prompt是经过优化和精简后的高效提示语版本' : 'Distilled prompt is an optimized and streamlined version of the original prompt'}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="quality" className="space-y-4">
                    <div>
                      <Label htmlFor="qualityStandard">{language === 'zh' ? '质量打分标准' : 'Quality Scoring Standard'}</Label>
                      <Textarea
                        id="qualityStandard"
                        value={newType.qualityStandard}
                        onChange={(e) => setNewType({ ...newType, qualityStandard: e.target.value })}
                        placeholder={t('qualityStandardDesc', language)}
                        className="h-[400px]"
                        rows={6}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('qualityStandardHelp', language)}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="px-6 py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('cancel', language)}
                  </Button>
                  <Button onClick={editingType ? handleUpdateType : handleAddType}>
                    {editingType ? t('update', language) : t('create', language)}
                  </Button>
                </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('code', language)}</TableHead>
                  <TableHead>{language === 'zh' ? '二级场景 (提问动机-H)' : 'Secondary Scene (Motivation-H)'}</TableHead>
                  <TableHead>{language === 'zh' ? '三级场景（赛道-T）' : 'Tertiary Scene (Track-T)'}</TableHead>
                  <TableHead>{t('status', language)}</TableHead>
                  <TableHead>{t('queryCount', language)}</TableHead>
                  <TableHead>{t('createdTime', language)}</TableHead>
                  <TableHead className="text-right">{t('actions', language)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{type.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {type.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {type.tertiaryScene}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(type.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{type.queryCount}</span>
                        {type.queryCount > 1000 && <Star className="w-3 h-3 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {type.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditType(type)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteType(type.id)}
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

          {/* 分页组件 */}
          {filteredTypes.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {/* 页码显示逻辑 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // 显示逻辑：总是显示第1页、最后1页、当前页及其前后各1页
                    const showPage = page === 1 || 
                                   page === totalPages || 
                                   (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      // 显示省略号
                      if (page === 2 && currentPage > 4) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      } else if (page === totalPages - 1 && currentPage < totalPages - 3) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* 分页信息显示 */}
          {filteredTypes.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
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
            <div className="text-center py-8 text-muted-foreground">
              {t('noMatchingTypes', language)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};