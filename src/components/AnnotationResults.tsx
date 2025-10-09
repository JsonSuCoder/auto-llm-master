import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language, t } from '../utils/translations';

interface AnnotationResultsProps {
  language: Language;
  taskId: number;
  taskName: string;
  onBack: () => void;
}

export const AnnotationResults: React.FC<AnnotationResultsProps> = ({ 
  language, 
  taskId, 
  taskName, 
  onBack 
}) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<{query: string, annotations: any} | null>(null);
  const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);

  const handleShowDetails = (result: {query: string, annotations: any}) => {
    setSelectedDetail(result);
    setIsDetailDialogOpen(true);
  };

  const handleAnnotationClick = (query: any) => {
    setSelectedQuery(query);
    setIsAnnotationDialogOpen(true);
  };

  const handleAnnotationSubmit = (annotation: string) => {
    // 这里处理标注提交逻辑
    toast(language === 'zh' ? '标注已提交' : 'Annotation submitted');
    setIsAnnotationDialogOpen(false);
    setSelectedQuery(null);
  };

  // Mock annotation results data
  const annotationResults = {
    1: [
      {
        id: 1,
        query: 'Which narrative track does this token align with, and how does it compare against peers in the sector?',
        analysisResult: language === 'zh' 
          ? '该代币主要与AI基础设施赛道相关，在估值方面相对同行处于合理区间，具有一定投资价值。技术面显示突破关键阻力位，建议关注后续走势。' 
          : 'This token is primarily related to AI infrastructure track, with valuation reasonably positioned compared to peers, showing investment value. Technical analysis indicates breakthrough of key resistance level, recommend monitoring subsequent trends.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '张三' : 'Zhang San',
        annotatedAt: '2024-03-15 14:30'
      },
      {
        id: 2,
        query: 'Why did BTC rise first and then fall after the September 5 NFP release?',
        analysisResult: language === 'zh'
          ? 'NFP数据发布前市场预期乐观推动BTC上涨，但实际数据超预期强劲，加剧了美联储鹰派预期，导致风险资产回调。建议关注后续货币政策信号。'
          : 'Market optimism before NFP release drove BTC up, but stronger-than-expected data intensified Fed hawkish expectations, leading to risk asset correction. Recommend monitoring subsequent monetary policy signals.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '李四' : 'Li Si',
        annotatedAt: '2024-03-15 15:45'
      },
      {
        id: 3,
        query: 'CPI will be released on July 15. What is the current market expectation, and how might BTC rise or fall under different CPI outcomes?',
        analysisResult: language === 'zh'
          ? '市场预期CPI同比3.1%，环比0.2%。若数据低于预期，BTC可能上涨至$32000；若高于预期，可能回调至$28000。建议设置止损位$29500。'
          : 'Market expects CPI at 3.1% YoY, 0.2% MoM. If below expectations, BTC may rise to $32,000; if above, may correct to $28,000. Recommend stop-loss at $29,500.',
        distillationStatus: 'processing',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 4,
        query: 'What impact will the upcoming Ethereum upgrade have on gas fees and network performance?',
        analysisResult: language === 'zh'
          ? '以太坊升级预计将显著降低gas费用30-50%，并提升网络TPS至10000+。建议关注Layer2解决方案代币的价格反应。'
          : 'Ethereum upgrade expected to significantly reduce gas fees by 30-50% and improve network TPS to 10,000+. Recommend monitoring Layer2 solution token price reactions.',
        distillationStatus: 'completed',
        annotationStatus: 'in_review',
        annotatedBy: language === 'zh' ? '王五' : 'Wang Wu',
        annotatedAt: '2024-03-15 16:20'
      },
      {
        id: 5,
        query: 'How do institutional investors view the current RWA tokenization trend?',
        analysisResult: language === 'zh'
          ? '机构投资者对RWA代币化持谨慎乐观态度，主要关注监管合规性和底层资产质量。预计未来2-3年内市场规模将达到1万亿美元。'
          : 'Institutional investors are cautiously optimistic about RWA tokenization, focusing on regulatory compliance and underlying asset quality. Market size expected to reach $1 trillion in 2-3 years.',
        distillationStatus: 'completed',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 6,
        query: 'What are the main risks associated with investing in meme coins during market volatility?',
        analysisResult: language === 'zh'
          ? '主要风险包括：1)极高波动性；2)流动性不足；3)项目可持续性差；4)监管不确定性。建议控制仓位在总资产的1-3%以内。'
          : 'Main risks include: 1) Extreme volatility; 2) Insufficient liquidity; 3) Poor project sustainability; 4) Regulatory uncertainty. Recommend limiting exposure to 1-3% of total assets.',
        distillationStatus: 'pending',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 7,
        query: 'How should investors approach altcoin season strategy in the current market cycle?',
        analysisResult: language === 'zh'
          ? '当前周期建议分批布局优质L1和DeFi项目，重点关注技术创新和生态发展。设置合理止盈点，避免贪婪情绪。'
          : 'Current cycle strategy: gradually position in quality L1 and DeFi projects, focus on technical innovation and ecosystem development. Set reasonable profit targets, avoid greed.',
        distillationStatus: 'processing',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 8,
        query: 'What is the outlook for cross-chain bridge protocols after recent security incidents?',
        analysisResult: language === 'zh'
          ? '跨链桥协议面临安全挑战，但技术不断改进。建议选择经过多次审计的成熟协议，单次跨链金额不宜过大。'
          : 'Cross-chain bridge protocols face security challenges but technology continues improving. Recommend choosing mature protocols with multiple audits, limit single transaction amounts.',
        distillationStatus: 'completed',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 9,
        query: 'How will central bank digital currencies (CBDCs) impact the cryptocurrency market?',
        analysisResult: language === 'zh'
          ? 'CBDC的推出可能对稳定币市场造成冲击，但对比特币等去中心化资产影响有限。建议关注隐私币的发展机会。'
          : 'CBDC launch may impact stablecoin market but has limited effect on decentralized assets like Bitcoin. Recommend monitoring privacy coin development opportunities.',
        distillationStatus: 'failed',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 10,
        query: 'What factors should be considered when evaluating GameFi token investments?',
        analysisResult: language === 'zh'
          ? '评估GameFi代币需关注：1)游戏可玩性；2)代币经济模型；3)团队背景；4)用户留存率；5)P2E机制可持续性。建议深度研究后再投资。'
          : 'Evaluating GameFi tokens consider: 1) Game playability; 2) Token economics; 3) Team background; 4) User retention; 5) P2E mechanism sustainability. Recommend thorough research before investing.',
        distillationStatus: 'completed',
        annotationStatus: 'rejected',
        annotatedBy: language === 'zh' ? '李四' : 'Li Si',
        annotatedAt: '2024-03-15 18:30'
      }
    ],
    2: [
      {
        id: 11,
        query: 'What are the key factors driving the recent surge in DeFi token prices?',
        analysisResult: language === 'zh'
          ? '主要驱动因素包括：1)机构资金流入增加；2)新协议上线带来的创新预期；3)整体流动性改善。建议重点关注TVL增长较快的项目。'
          : 'Key drivers include: 1) Increased institutional capital inflows; 2) Innovation expectations from new protocol launches; 3) Overall liquidity improvement. Recommend focusing on projects with rapid TVL growth.',
        distillationStatus: 'completed',
        annotationStatus: 'in_review',
        annotatedBy: language === 'zh' ? '赵六' : 'Zhao Liu',
        annotatedAt: '2024-03-15 17:10'
      },
      {
        id: 12,
        query: 'How do market makers influence cryptocurrency price movements during trending periods?',
        analysisResult: language === 'zh'
          ? '做市商通过提供流动性和价格发现功能影响市场，在趋势期间其策略调整会放大价格波动。建议关注大额订单和交易量异常。'
          : 'Market makers influence markets through liquidity provision and price discovery. Their strategy adjustments during trending periods amplify price volatility. Monitor large orders and volume anomalies.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '张三' : 'Zhang San',
        annotatedAt: '2024-03-15 16:45'
      },
      {
        id: 13,
        query: 'What is the correlation between traditional stock market trends and crypto market movements?',
        analysisResult: language === 'zh'
          ? '加密市场与传统股市相关性在不断增强，特别是在宏观事件影响下。相关系数从0.3上升至0.7，建议同时关注美股走势。'
          : 'Correlation between crypto and traditional stock markets is strengthening, especially during macro events. Correlation coefficient rose from 0.3 to 0.7, recommend monitoring US stock trends.',
        distillationStatus: 'processing',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 14,
        query: 'How should investors position themselves for the upcoming Bitcoin halving event?',
        analysisResult: language === 'zh'
          ? '比特币减半前6个月开始布局，历史数据显示减半后12-18个月达到峰值。建议分批买入，同时配置相关生态代币。'
          : 'Start positioning 6 months before Bitcoin halving. Historical data shows peak 12-18 months after halving. Recommend dollar-cost averaging and allocating related ecosystem tokens.',
        distillationStatus: 'completed',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 15,
        query: 'What impact do regulatory announcements have on cryptocurrency market sentiment?',
        analysisResult: language === 'zh'
          ? '监管公告对市场情绪影响巨大，正面消息平均推动市场上涨15-25%，负面消息导致下跌10-20%。建议建立监管事件预警机制。'
          : 'Regulatory announcements significantly impact market sentiment. Positive news typically drives 15-25% gains, negative news causes 10-20% declines. Recommend establishing regulatory event alert system.',
        distillationStatus: 'completed',
        annotationStatus: 'in_review',
        annotatedBy: language === 'zh' ? '王五' : 'Wang Wu',
        annotatedAt: '2024-03-15 19:15'
      },
      {
        id: 16,
        query: 'How do whale movements affect smaller altcoin price stability?',
        analysisResult: language === 'zh'
          ? '巨鲸行为对小市值山寨币影响极大，单笔大额交易可造成20-50%价格波动。建议监控链上数据和大户地址动向。'
          : 'Whale activities significantly impact smaller altcoins. Single large transactions can cause 20-50% price volatility. Recommend monitoring on-chain data and whale address movements.',
        distillationStatus: 'pending',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 17,
        query: 'What are the emerging trends in cryptocurrency derivatives trading?',
        analysisResult: language === 'zh'
          ? '衍生品交易新趋势包括：1)期权交易量激增；2)结构化产品创新；3)去中心化衍生品平台崛起。建议学习相关交易策略。'
          : 'Emerging derivatives trends include: 1) Surging options volume; 2) Structured product innovation; 3) Rise of decentralized derivatives platforms. Recommend learning related trading strategies.',
        distillationStatus: 'processing',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 18,
        query: 'How do macroeconomic indicators influence institutional crypto investment decisions?',
        analysisResult: language === 'zh'
          ? '宏观指标如通胀率、利率、美元指数等显著影响机构配置决策。通胀上升时机构增配比特币作为对冲工具。'
          : 'Macro indicators like inflation, interest rates, and USD index significantly influence institutional allocation decisions. Rising inflation increases Bitcoin allocation as hedge.',
        distillationStatus: 'failed',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 19,
        query: 'What role do social media trends play in meme coin price movements?',
        analysisResult: language === 'zh'
          ? '社交媒体趋势是meme币价格主要驱动力，Twitter提及量与价格相关性达0.8。建议使用社交情绪分析工具辅助投资决策。'
          : 'Social media trends are primary drivers of meme coin prices. Twitter mention volume shows 0.8 correlation with price. Recommend using social sentiment analysis tools.',
        distillationStatus: 'completed',
        annotationStatus: 'rejected',
        annotatedBy: language === 'zh' ? '李四' : 'Li Si',
        annotatedAt: '2024-03-15 20:00'
      },
      {
        id: 20,
        query: 'How should investors approach risk management in a volatile crypto market?',
        analysisResult: language === 'zh'
          ? '风险管理策略：1)分散投资组合；2)设置止损位；3)控制仓位大小；4)定期再平衡。建议单个项目仓位不超过总资产5%。'
          : 'Risk management strategies: 1) Diversify portfolio; 2) Set stop-losses; 3) Control position sizes; 4) Regular rebalancing. Recommend single project exposure under 5% of total assets.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '赵六' : 'Zhao Liu',
        annotatedAt: '2024-03-15 21:30'
      }
    ],
    3: [
      {
        id: 21,
        query: 'What are the best strategies for timing entries and exits in volatile crypto markets?',
        analysisResult: language === 'zh'
          ? '最佳进出场策略包括技术分析、资金流分析和情绪指标。建议使用分批买卖法，避免一次性大额交易。'
          : 'Best entry/exit strategies include technical analysis, fund flow analysis, and sentiment indicators. Recommend using dollar-cost averaging, avoid large single transactions.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '张三' : 'Zhang San',
        annotatedAt: '2024-03-15 14:15'
      },
      {
        id: 22,
        query: 'How do yield farming strategies compare to traditional DeFi lending?',
        analysisResult: language === 'zh'
          ? '流动性挖矿相比传统DeFi借贷风���更高但收益潜力更大。挖矿年化可达50-200%，但面临无常损失风险。'
          : 'Yield farming has higher risk but greater return potential than traditional DeFi lending. Mining APY can reach 50-200% but faces impermanent loss risk.',
        distillationStatus: 'processing',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 23,
        query: 'What signals indicate a potential market reversal in cryptocurrency trends?',
        analysisResult: language === 'zh'
          ? '市���反转信号包括：1)交易量背离；2)RSI超买超卖；3)恐慌指数极值；4)大户行为变化。建议综合多个指标判断。'
          : 'Market reversal signals include: 1) Volume divergence; 2) RSI overbought/oversold; 3) Extreme fear/greed index; 4) Whale behavior changes. Recommend combining multiple indicators.',
        distillationStatus: 'completed',
        annotationStatus: 'in_review',
        annotatedBy: language === 'zh' ? '王五' : 'Wang Wu',
        annotatedAt: '2024-03-15 15:30'
      },
      {
        id: 24,
        query: 'How should traders position for maximum profit during altcoin pumps?',
        analysisResult: language === 'zh'
          ? '山寨币拉升期间策略：1)提前识别潜力币种；2)分层止盈；3)控制FOMO情绪；4)快速获利了结。建议��设退出��划。'
          : 'Altcoin pump strategies: 1) Early identification of potential coins; 2) Layered profit-taking; 3) Control FOMO emotions; 4) Quick profit realization. Recommend preset exit plans.',
        distillationStatus: 'completed',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 25,
        query: 'What are the most effective indicators for predicting short-term price movements?',
        analysisResult: language === 'zh'
          ? '短期预测有效指标：1)成交量分析；2)资金流向；3)期货持仓量；4)社交情绪。综合使用准确率可达70%以上。'
          : 'Effective short-term prediction indicators: 1) Volume analysis; 2) Fund flow direction; 3) Futures open interest; 4) Social sentiment. Combined use achieves 70%+ accuracy.',
        distillationStatus: 'pending',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 26,
        query: 'How do trading bots impact cryptocurrency market liquidity and price discovery?',
        analysisResult: language === 'zh'
          ? '交易机器人提升市场流动性但可能加剧波动。高频交易占总交易量60%以上，影响价格发现效率。'
          : 'Trading bots improve market liquidity but may increase volatility. High-frequency trading accounts for 60%+ of total volume, affecting price discovery efficiency.',
        distillationStatus: 'failed',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 27,
        query: 'What risk management techniques work best for leveraged cryptocurrency trading?',
        analysisResult: language === 'zh'
          ? '杠杆交易风险管理：1)严格设置止损；2)控制杠杆倍数；3)分散交易对；4)监控强平价格。建议杠杆不超过3倍。'
          : 'Leveraged trading risk management: 1) Strict stop-loss settings; 2) Control leverage ratio; 3) Diversify trading pairs; 4) Monitor liquidation prices. Recommend max 3x leverage.',
        distillationStatus: 'completed',
        annotationStatus: 'rejected',
        annotatedBy: language === 'zh' ? '李四' : 'Li Si',
        annotatedAt: '2024-03-15 16:45'
      },
      {
        id: 28,
        query: 'How do options strategies help hedge against cryptocurrency portfolio volatility?',
        analysisResult: language === 'zh'
          ? '期权对冲策略包括保护性看跌期权、备兑看涨期权等。可有效降低组合波动率20-30%，但会牺牲部分收益。'
          : 'Options hedging strategies include protective puts, covered calls, etc. Can effectively reduce portfolio volatility by 20-30% but sacrifices some returns.',
        distillationStatus: 'processing',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 29,
        query: 'What market patterns typically precede major cryptocurrency bull runs?',
        analysisResult: language === 'zh'
          ? '牛市前兆模式：1)比特币横盘整理；2)山寨币资金轮动；3)机构入场信号；4)监管环境改善。历史周期约4年重复。'
          : 'Bull run precursor patterns: 1) Bitcoin sideways consolidation; 2) Altcoin fund rotation; 3) Institutional entry signals; 4) Regulatory environment improvement. Historical cycle repeats ~4 years.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '赵六' : 'Zhao Liu',
        annotatedAt: '2024-03-15 17:20'
      },
      {
        id: 30,
        query: 'How should traders adapt their strategies during periods of extreme market volatility?',
        analysisResult: language === 'zh'
          ? '极端波动期策略调整：1)降低仓位规模；2)缩短持仓时间；3)增加对冲比例；4)提高止损灵敏度。建议暂停新开仓。'
          : 'Extreme volatility strategy adjustments: 1) Reduce position sizes; 2) Shorten holding periods; 3) Increase hedging ratio; 4) Heighten stop-loss sensitivity. Recommend pausing new positions.',
        distillationStatus: 'completed',
        annotationStatus: 'in_review',
        annotatedBy: language === 'zh' ? '王五' : 'Wang Wu',
        annotatedAt: '2024-03-15 18:45'
      }
    ],
    4: [
      {
        id: 31,
        query: 'What opportunities exist in the emerging RWA tokenization sector?',
        analysisResult: language === 'zh'
          ? 'RWA代币化机会包括房地产、商品、债券等传统资产上链。市场规模预计达万亿级别，但需关注监管合规风险。'
          : 'RWA tokenization opportunities include real estate, commodities, bonds, and other traditional assets on-chain. Market size expected to reach trillion-dollar level, but regulatory compliance risks need attention.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '张三' : 'Zhang San',
        annotatedAt: '2024-03-15 14:00'
      },
      {
        id: 32,
        query: 'How do tokenized real estate investments compare to traditional real estate?',
        analysisResult: language === 'zh'
          ? '代币化房地产投资具有流动性强、门槛低、可分割等优势，但面临监管不明确和技术风险。收益率与传统房地产相当。'
          : 'Tokenized real estate offers advantages like high liquidity, low barriers, divisibility, but faces unclear regulation and technical risks. Returns comparable to traditional real estate.',
        distillationStatus: 'processing',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 33,
        query: 'What are the key success factors for RWA tokenization projects?',
        analysisResult: language === 'zh'
          ? 'RWA项目成功要素：1)优质底层资产；2)合规法律框架；3)透明治理机制；4)良好流动性设计；5)专业运营团队。'
          : 'RWA project success factors: 1) Quality underlying assets; 2) Compliant legal framework; 3) Transparent governance; 4) Good liquidity design; 5) Professional operation team.',
        distillationStatus: 'completed',
        annotationStatus: 'in_review',
        annotatedBy: language === 'zh' ? '王五' : 'Wang Wu',
        annotatedAt: '2024-03-15 15:15'
      },
      {
        id: 34,
        query: 'How should investors evaluate risk in commodity tokenization platforms?',
        analysisResult: language === 'zh'
          ? '商品代币化风险评估重点：1)托管安全性；2)价格锚定机制；3)赎回保障；4)监管合规性。建议选择有实物支撑的项目。'
          : 'Commodity tokenization risk evaluation focus: 1) Custody security; 2) Price pegging mechanism; 3) Redemption guarantees; 4) Regulatory compliance. Recommend projects with physical backing.',
        distillationStatus: 'completed',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 35,
        query: 'What regulatory challenges face RWA tokenization adoption?',
        analysisResult: language === 'zh'
          ? '监管挑战包括证券法合规、跨境法律差异、税务处理复杂性等。各国监管态度分化，需要统一标准框架。'
          : 'Regulatory challenges include securities law compliance, cross-border legal differences, tax treatment complexity. Countries have divergent regulatory attitudes, need unified framework.',
        distillationStatus: 'pending',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 36,
        query: 'How do RWA tokens maintain stability during market volatility?',
        analysisResult: language === 'zh'
          ? 'RWA代币稳定性机制：1)底层资产支撑；2)价格稳定算法；3)储备金缓冲；4)治理投票调节。波动性明显低于纯加密资产。'
          : 'RWA token stability mechanisms: 1) Underlying asset backing; 2) Price stability algorithms; 3) Reserve buffer; 4) Governance voting adjustment. Volatility significantly lower than pure crypto assets.',
        distillationStatus: 'failed',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 37,
        query: 'What are the liquidity characteristics of different RWA token categories?',
        analysisResult: language === 'zh'
          ? '不同RWA类别流动性特征：房地产代币流动性较低，商品代币中等，债券代币较高。建议根据投资周期选择合适类别。'
          : 'Different RWA category liquidity characteristics: Real estate tokens have lower liquidity, commodity tokens medium, bond tokens higher. Recommend choosing appropriate categories based on investment horizon.',
        distillationStatus: 'processing',
        annotationStatus: 'pending',
        annotatedBy: null,
        annotatedAt: null
      },
      {
        id: 38,
        query: 'How do insurance mechanisms protect RWA token holders?',
        analysisResult: language === 'zh'
          ? '保险保护机制包括智能合约保险、资产托管保险、操作风险保险等。覆盖率通常为总价值的80-100%，费率约0.5-2%。'
          : 'Insurance protection mechanisms include smart contract insurance, asset custody insurance, operational risk insurance. Coverage typically 80-100% of total value, rates around 0.5-2%.',
        distillationStatus: 'completed',
        annotationStatus: 'rejected',
        annotatedBy: language === 'zh' ? '李四' : 'Li Si',
        annotatedAt: '2024-03-15 16:30'
      },
      {
        id: 39,
        query: 'What yield opportunities exist in the RWA tokenization ecosystem?',
        analysisResult: language === 'zh'
          ? 'RWA���态收益机会：1)资产收益分配；2)治理代币奖励；3)流动性挖矿；4)质押收益。年化收益率通常5-15%，相对稳定。'
          : 'RWA ecosystem yield opportunities: 1) Asset yield distribution; 2) Governance token rewards; 3) Liquidity mining; 4) Staking returns. Annual yields typically 5-15%, relatively stable.',
        distillationStatus: 'completed',
        annotationStatus: 'completed',
        annotatedBy: language === 'zh' ? '赵六' : 'Zhao Liu',
        annotatedAt: '2024-03-15 17:45'
      },
      {
        id: 40,
        query: 'How do institutional investors approach RWA token portfolio allocation?',
        analysisResult: language === 'zh'
          ? '机构RWA配置策略：1)多样化资产类别；2)风险分层管理；3)流动性需求匹配；4)合规审查严格。通常占总投资组合5-20%。'
          : 'Institutional RWA allocation strategies: 1) Diversified asset categories; 2) Risk-layered management; 3) Liquidity need matching; 4) Strict compliance review. Typically 5-20% of total portfolio.',
        distillationStatus: 'completed',
        annotationStatus: 'in_review',
        annotatedBy: language === 'zh' ? '王五' : 'Wang Wu',
        annotatedAt: '2024-03-15 18:20'
      }
    ]
  };

  const results = annotationResults[taskId] || [];

  const handleDownload = () => {
    const csvContent = [
      ['Query', 'Analysis Result', 'Distillation Status', 'Annotation Status', 'Annotated By', 'Annotated At'],
      ...results.map(result => [
        result.query,
        result.analysisResult,
        result.distillationStatus,
        result.annotationStatus,
        result.annotatedBy,
        result.annotatedAt
      ])
    ].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `annotation-results-${taskName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    link.click();
    
    toast(language === 'zh' ? '导出成功' : 'Export successful');
  };

  const getStatusBadge = (status: string, query?: any) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">{language === 'zh' ? '已完成' : 'Completed'}</Badge>;
      case 'pending':
        return (
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => query && handleAnnotationClick(query)}
          >
            {language === 'zh' ? '待标注' : 'Pending'}
          </Badge>
        );
      case 'in_review':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">{language === 'zh' ? '审核中' : 'In Review'}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{language === 'zh' ? '已驳回' : 'Rejected'}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDistillationStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">{language === 'zh' ? '已完成' : 'Completed'}</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">{language === 'zh' ? '处理中' : 'Processing'}</Badge>;
      case 'failed':
        return <Badge variant="destructive">{language === 'zh' ? '失败' : 'Failed'}</Badge>;
      case 'pending':
        return <Badge variant="outline">{language === 'zh' ? '待处理' : 'Pending'}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1>{language === 'zh' ? '标注结果' : 'Annotation Results'}</h1>
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
          <CardTitle>{language === 'zh' ? '标注结果' : 'Annotation Results'}</CardTitle>
          <CardDescription>
            {language === 'zh' 
              ? `共找到 ${results.length} 条标注结果`
              : `Found ${results.length} annotation results`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-[1200px] mx-auto overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/5">
                    {language === 'zh' ? 'Query' : 'Query'}
                  </TableHead>
                  <TableHead className="w-2/5">
                    {language === 'zh' ? '分析结果' : 'Analysis Result'}
                  </TableHead>
                  <TableHead className="w-1/8">
                    {language === 'zh' ? '蒸馏状态' : 'Distillation Status'}
                  </TableHead>
                  <TableHead className="w-1/8">
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
                      <div className="text-sm max-w-[400px] overflow-hidden text-ellipsis line-clamp-3">
                        {result.analysisResult}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      {getDistillationStatusBadge(result.distillationStatus)}
                    </TableCell>
                    <TableCell className="align-top">
                      {getStatusBadge(result.annotationStatus, result)}
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
              {language === 'zh' ? '暂无标注结果' : 'No annotation results available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none overflow-y-auto flex flex-col">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {language === 'zh' ? '标注详情' : 'Annotation Details'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh' ? '查看完整的Query和标注信息' : 'View complete Query and annotation information'}
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
                    {language === 'zh' ? '分析结果:' : 'Analysis Result:'}
                  </h4>
                  <div className="p-4 bg-muted rounded-lg h-[400px] overflow-y-auto">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedDetail.analysisResult}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="mb-2 font-medium">
                    {language === 'zh' ? '标注信息:' : 'Annotation Information:'}
                  </h4>
                  <div className="p-4 bg-muted rounded-lg space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">{language === 'zh' ? '标注状态:' : 'Annotation Status:'}</h5>
                      {getStatusBadge(selectedDetail.annotationStatus, selectedDetail)}
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">{language === 'zh' ? '标注信息:' : 'Annotation Info:'}</h5>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>{language === 'zh' ? '标注者：' : 'Annotated by: '}{selectedDetail.annotatedBy}</div>
                        <div>{language === 'zh' ? '标注时间：' : 'Annotated at: '}{selectedDetail.annotatedAt}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Annotation Dialog */}
      <Dialog open={isAnnotationDialogOpen} onOpenChange={setIsAnnotationDialogOpen}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none overflow-y-auto flex flex-col">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {language === 'zh' ? '标注详情' : 'Annotation Details'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh' ? '请为以下Query提供标注' : 'Please provide annotation for the following Query'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 p-6">
            {selectedQuery && (
              <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h4 className="mb-2 font-medium">
                  {language === 'zh' ? 'Query:' : 'Query:'}
                </h4>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {selectedQuery.query}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium">
                  {language === 'zh' ? '分析结果:' : 'Analysis Result:'}
                </h4>
                <Textarea
                  className="h-[400px] resize-none"
                  defaultValue={selectedQuery.analysisResult}
                  placeholder={language === 'zh' ? '请输入分析结果...' : 'Please enter analysis result...'}
                  id="analysis-textarea"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAnnotationDialogOpen(false)}
                >
                  {language === 'zh' ? '取消' : 'Cancel'}
                </Button>
                <Button
                  onClick={() => {
                    const textarea = document.getElementById('analysis-textarea') as HTMLTextAreaElement;
                    if (textarea?.value) {
                      handleAnnotationSubmit(textarea.value);
                    } else {
                      toast(language === 'zh' ? '请输入分析结果' : 'Please enter analysis result');
                    }
                  }}
                >
                  {language === 'zh' ? '提交标注' : 'Submit Annotation'}
                </Button>
              </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};