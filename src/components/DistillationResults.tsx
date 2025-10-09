import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language, t } from '../utils/translations';

interface DistillationResultsProps {
  language: Language;
  taskId: number;
  taskName: string;
  onBack: () => void;
}

export const DistillationResults: React.FC<DistillationResultsProps> = ({ 
  language, 
  taskId, 
  taskName, 
  onBack 
}) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<{query: string, analysis: string, distillationStatus: string, annotationStatus: string} | null>(null);

  const handleShowDetails = (result: {query: string, analysis: string, distillationStatus: string, annotationStatus: string}) => {
    setSelectedDetail(result);
    setIsDetailDialogOpen(true);
  };

  const getDistillationStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">{language === 'zh' ? '已完成' : 'Completed'}</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">{language === 'zh' ? '处理中' : 'Processing'}</Badge>;
      case 'pending':
        return <Badge variant="outline">{language === 'zh' ? '待处理' : 'Pending'}</Badge>;
      case 'failed':
        return <Badge variant="destructive">{language === 'zh' ? '失败' : 'Failed'}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAnnotationStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">{language === 'zh' ? '已标注' : 'Annotated'}</Badge>;
      case 'pending':
        return <Badge variant="outline">{language === 'zh' ? '待标注' : 'Pending'}</Badge>;
      case 'in_review':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">{language === 'zh' ? '审核中' : 'In Review'}</Badge>;
      case 'not_required':
        return <Badge variant="secondary">{language === 'zh' ? '无需标注' : 'Not Required'}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const newAnalysisText = `Step 1: Establish Narrative Alignment and Sector Positioning
Begin by rigorously determining the token's core narrative alignment, as this forms the foundation for all subsequent comparative analysis. This involves a dual-track approach: first, conduct a deep-dive into the project's official documentation, whitepaper, and technical resources to extract its primary purpose, technology stack, and intended sector narrative (e.g., L1, DePIN, AI, RWA). Simultaneously, assess market perception by aggregating narrative tags from leading data aggregators (such as CoinGecko, Messari) and quantifying keyword associations in both official communications and organic social discourse. This triangulation ensures that both the project's self-identified narrative and the prevailing market-assigned narrative are captured, with discrepancies flagged for further scrutiny. Dominant narrative alignment should be weighted by resource allocation and marketing focus, while secondary alignments are noted for context. This step is critical because accurate narrative placement determines the relevant competitive landscape and frames all peer comparisons.

Step 2: Define and Segment the Peer Group for Benchmarking
With the narrative established, construct a robust peer set for benchmarking. Identify direct competitors by extracting all tokens categorized under the same primary narrative from aggregator APIs, then refine this set by segmenting according to market capitalization tiers (e.g., Large-Cap, Mid-Cap, Small-Cap) to ensure comparability. Further sub-segment by functional niche within the narrative (e.g., within DePIN, distinguish between Storage, Compute, Connectivity) to isolate the most relevant comparators. Manual verification of the top 5–10 closest peers based on business model and product delivery is essential to mitigate inconsistent aggregator tagging and to exclude outliers or projects lacking sufficient operational history. This segmentation is foundational for "apples-to-apples" analysis and ensures that all subsequent metrics are interpreted within an appropriate competitive context.

Step 3: Quantify Hype, Community Quality, and Market Depth
Assess the scale and authenticity of attention surrounding the token by analyzing discussion volume, engagement quality, and diffusion structure across primary community platforms (X/Twitter, Discord, Telegram). Calculate Share of Voice (SOV) relative to the peer set over both short (7d) and long (30d) windows, and measure Quality Engagement Rate (QER) to distinguish genuine technical or product-focused interactions from low-value or incentivized activity. Passive mention ratios and cross-circle penetration (across regions, KOL types, and languages) are used to filter out manufactured hype and identify organic momentum. Durability is evaluated via half-life and 7-day extension rates post-peak. This step is crucial because it distinguishes between transient, campaign-driven spikes and sustained, authentic community traction, which are leading indicators of narrative stickiness and conversion potential.

Step 4: Evaluate User Growth, Retention, and Community Health
Analyze user acquisition and retention metrics to determine whether observed growth translates into a resilient, self-sustaining community. Track net follower growth and retention rates (e.g., R30 for X/Twitter, R7 for Telegram), and cross-verify with Discord activity rates, support responsiveness, and knowledge deposit frequency. Assess message distribution (Gini coefficient) and multi-turn conversation rates to gauge depth of engagement. This multi-platform, retention-focused approach ensures that growth is not merely superficial "traffic" but reflects genuine community formation, which is a prerequisite for long-term ecosystem vitality and product adoption.

Step 5: Analyze Sector-Specific Demand and On-Chain Fundamentals
Select and benchmark 2–3 sector-relevant, demand-side metrics that best capture the project's real-world traction and economic health. For infrastructure tokens, this may include paid gas usage, contract deployments, and cross-chain net inflows; for DeFi, volume/TVL utilization, fee generation, and order book depth; for social/gaming/AI, user retention curves and ARPU/ARPPU. Compare these metrics against the peer set, aligning time windows with key narrative events (e.g., listings, airdrops) to assess whether hype translates into measurable demand. This step is vital for validating that narrative momentum is underpinned by substantive, on-chain user and economic activity, rather than speculative or promotional cycles.

Step 6: Assess Ecosystem Vitality, Development, and Governance
Evaluate the project's long-term viability by examining development activity (active developers, external PRs, release cadence), integration velocity (announcement-to-production deployment time, hackathon-to-mainnet conversion), and ecosystem self-drive (external proposals, grant conversion rates, redundancy in key positions). Analyze TVL quality (native vs. mercenary capital), cross-chain inflows, and governance decentralization (multisig, timelock, audit status). Identify green flags (e.g., passive integration growth, stable release rhythm) and red flags (e.g., logo wall without production integrations, single-point control). This comprehensive ecosystem assessment provides insight into the project's capacity for sustained innovation, resilience, and organic expansion beyond initial hype cycles.`;

  // Mock distillation results data
  const distillationResults = {
    1: [
      {
        id: 1,
        query: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
        analysis: newAnalysisText,
        distillationStatus: 'completed',
        annotationStatus: 'pending'
      },
      {
        id: 2,
        query: 'Why did BTC rise first and then fall after the September 5 NFP release?',
        analysis: newAnalysisText,
        distillationStatus: 'completed',
        annotationStatus: 'pending'
      },
      {
        id: 3,
        query: 'CPI will be released on July 15. What is the current market expectation, and how might BTC rise or fall under different CPI outcomes?',
        analysis: newAnalysisText,
        distillationStatus: 'processing',
        annotationStatus: 'pending'
      }
    ],
    2: [
      {
        id: 4,
        query: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
        analysis: newAnalysisText,
        distillationStatus: 'completed',
        annotationStatus: 'pending'
      },
      {
        id: 5,
        query: 'Why did BTC rise first and then fall after the September 5 NFP release?',
        analysis: newAnalysisText,
        distillationStatus: 'failed',
        annotationStatus: 'pending'
      }
    ]
  };

  const results = distillationResults[taskId] || [];

  const handleDownload = () => {
    const csvContent = [
      ['Query', 'Analysis', 'Distillation Status', 'Annotation Status'],
      ...results.map(result => [result.query, result.analysis, result.distillationStatus, result.annotationStatus])
    ].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `distillation-results-${taskName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    link.click();
    
    toast(language === 'zh' ? '导出成功' : 'Export successful');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1>{language === 'zh' ? '蒸馏结果' : 'Distillation Results'}</h1>
            <p className="text-muted-foreground">
              {language === 'zh' ? `任务：${taskName}` : `Task: ${taskName}`}
            </p>
          </div>
        </div>
        <Button onClick={handleDownload} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>{language === 'zh' ? '导出结果' : 'Export Results'}</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'zh' ? '蒸馏结果' : 'Distillation Results'}</CardTitle>
          <CardDescription>
            {language === 'zh' 
              ? `共找到 ${results.length} 条蒸馏结果`
              : `Found ${results.length} distillation results`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-[1024px] mx-auto overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">
                    {language === 'zh' ? 'Query' : 'Query'}
                  </TableHead>
                  <TableHead className="w-1/3">
                    {language === 'zh' ? '分析结果' : 'Analysis'}
                  </TableHead>
                  <TableHead className="w-1/6">
                    {language === 'zh' ? '蒸馏状态' : 'Distillation Status'}
                  </TableHead>
                  <TableHead className="w-1/6">
                    {language === 'zh' ? '标注状态' : 'Annotation Status'}
                  </TableHead>
                  <TableHead className="w-1/12">
                    {language === 'zh' ? '操作' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="align-top">
                      <div 
                        className="text-sm max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 transition-colors"
                        onClick={() => handleShowDetails(result)}
                        title={language === 'zh' ? '点击查看详情' : 'Click to view details'}
                      >
                        {result.query}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div 
                        className="text-sm max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 transition-colors"
                        onClick={() => handleShowDetails(result)}
                        title={language === 'zh' ? '点击查看详情' : 'Click to view details'}
                      >
                        {result.analysis}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant="default" className="bg-green-100 text-green-800">{language === 'zh' ? '已完成' : 'Completed'}</Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      {getAnnotationStatusBadge(result.annotationStatus)}
                    </TableCell>
                    <TableCell className="align-top">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShowDetails(result)}
                        className="h-8 w-8 p-0"
                      >
                        <span className="text-xs">{language === 'zh' ? '详情' : 'Details'}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {language === 'zh' ? '暂无蒸馏结果' : 'No distillation results available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none overflow-y-auto flex flex-col">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {language === 'zh' ? '详细内容' : 'Detail Content'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh' ? '查看完整的Query和分析结果' : 'View complete Query and Analysis result'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6">
            {selectedDetail && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                  <h4 className="mb-2 font-medium">
                    {language === 'zh' ? 'Query:' : 'Query:'}
                  </h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedDetail.query}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="mb-2 font-medium">
                    {language === 'zh' ? '分析结果:' : 'Analysis:'}
                  </h4>
                  <div className="p-4 bg-muted rounded-lg h-[400px] overflow-y-auto">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedDetail.analysis}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="mb-2 font-medium">
                    {language === 'zh' ? '状态信息:' : 'Status Information:'}
                  </h4>
                  <div className="p-4 bg-muted rounded-lg space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">{language === 'zh' ? '蒸馏状态:' : 'Distillation Status:'}</h5>
                      {getDistillationStatusBadge(selectedDetail.distillationStatus)}
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">{language === 'zh' ? '标注状态:' : 'Annotation Status:'}</h5>
                      {getAnnotationStatusBadge(selectedDetail.annotationStatus)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};