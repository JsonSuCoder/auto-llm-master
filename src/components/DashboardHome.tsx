import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Users, Settings, FileText, Database, Tag, 
  TrendingUp, Activity, Clock, CheckCircle 
} from 'lucide-react';
import { Language, t } from '../utils/translations';

interface DashboardHomeProps {
  user: any;
  language: Language;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ user, language }) => {
  const stats = [
    { title: language === 'zh' ? '总任务进度' : 'Total Tasks', completed: 283, total: 390, change: '+15', icon: FileText, color: 'text-green-600' },
    { title: language === 'zh' ? '蒸馏任务' : 'Distillation Tasks', completed: 142, total: 195, change: '+8', icon: Database, color: 'text-orange-600' },
    { title: language === 'zh' ? '标注任务' : 'Annotation Tasks', completed: 89, total: 124, change: '+5', icon: Tag, color: 'text-purple-600' },
    { title: language === 'zh' ? '盲评任务' : 'Blind Evaluation Tasks', completed: 67, total: 85, change: '+3', icon: TrendingUp, color: 'text-blue-600' }
  ];

  const recentTasks = [
    { id: 1, name: language === 'zh' ? '问答类Query蒸馏' : 'Q&A Query Distillation', type: t('dataDistillation', language), status: 'running', progress: 65 },
    { id: 2, name: language === 'zh' ? '对话类Query生产' : 'Dialog Query Production', type: t('queryProduction', language), status: 'completed', progress: 100 },
    { id: 3, name: language === 'zh' ? '分类标注任务' : 'Classification Annotation Task', type: t('dataAnnotation', language), status: 'pending', progress: 0 },
    { id: 4, name: language === 'zh' ? '情感分析Query' : 'Sentiment Analysis Query', type: t('dataDistillation', language), status: 'running', progress: 30 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">{t('running', language)}</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">{t('completed', language)}</Badge>;
      case 'pending':
        return <Badge variant="outline">{t('pending', language)}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          {t('welcomeBack', language)}，{user.name}！
        </h1>
        <p className="text-blue-100">
          {user.role === 'admin' ? t('adminWelcome', language) : t('producerWelcome', language)}
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {stat.completed !== undefined && stat.total !== undefined ? (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    {language === 'zh' ? '完成率：' : 'Completion: '}
                    <span className="font-medium">{Math.round((stat.completed / stat.total) * 100)}%</span>
                  </div>
                  <div className="text-2xl font-bold">
                    <span className="text-green-600">{stat.completed}</span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span>{stat.total}</span>
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> {t('comparedToYesterday', language)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 数据生产员任务进度详情 - 全宽显示 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {language === 'zh' ? '数据生产员任务进度详情' : 'Data Producer Task Progress Details'}
          </CardTitle>
          <CardDescription>
            {language === 'zh' ? '各生产员在不同任务类型中的详细进度情况' : 'Detailed progress of producers across different task types'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { 
                name: language === 'zh' ? '张三' : 'Alice Wang', 
                avatar: 'ZS',
                tasks: {
                  total: { completed: 85, total: 100, color: 'bg-gray-500', yesterdayChange: 5 },
                  query: { completed: 25, total: 30, color: 'bg-blue-500', yesterdayChange: 3 },
                  distillation: { completed: 22, total: 28, color: 'bg-orange-500', yesterdayChange: 2 },
                  annotation: { completed: 20, total: 24, color: 'bg-purple-500', yesterdayChange: 4 },
                  evaluation: { completed: 18, total: 18, color: 'bg-green-500', yesterdayChange: 1 }
                }
              },
              { 
                name: language === 'zh' ? '李四' : 'Bob Chen', 
                avatar: 'LS',
                tasks: {
                  total: { completed: 78, total: 95, color: 'bg-gray-500', yesterdayChange: 4 },
                  query: { completed: 20, total: 25, color: 'bg-blue-500', yesterdayChange: 2 },
                  distillation: { completed: 18, total: 23, color: 'bg-orange-500', yesterdayChange: 3 },
                  annotation: { completed: 22, total: 26, color: 'bg-purple-500', yesterdayChange: 2 },
                  evaluation: { completed: 18, total: 21, color: 'bg-green-500', yesterdayChange: 3 }
                }
              },
              { 
                name: language === 'zh' ? '王五' : 'Carol Li', 
                avatar: 'WW',
                tasks: {
                  total: { completed: 65, total: 80, color: 'bg-gray-500', yesterdayChange: 3 },
                  query: { completed: 15, total: 20, color: 'bg-blue-500', yesterdayChange: 1 },
                  distillation: { completed: 16, total: 20, color: 'bg-orange-500', yesterdayChange: 2 },
                  annotation: { completed: 18, total: 22, color: 'bg-purple-500', yesterdayChange: 3 },
                  evaluation: { completed: 16, total: 18, color: 'bg-green-500', yesterdayChange: 1 }
                }
              }
            ].map((producer, index) => {
              const isTopPerformer = index < 2;
              const taskTypes = [
                { key: 'total', label: language === 'zh' ? '总任务' : 'Total Tasks', icon: FileText },
                { key: 'query', label: language === 'zh' ? 'Query生产' : 'Query Production', icon: Database },
                { key: 'distillation', label: language === 'zh' ? '蒸馏任务' : 'Distillation', icon: Activity },
                { key: 'annotation', label: language === 'zh' ? '标注任务' : 'Annotation', icon: Tag },
                { key: 'evaluation', label: language === 'zh' ? '盲评任务' : 'Blind Evaluation', icon: CheckCircle }
              ];
              
              return (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-medium">
                        {producer.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{producer.name}</span>
                          {isTopPerformer && (
                            <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-xs">
                              {index === 0 ? '🥇' : '🥈'}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {language === 'zh' ? '总体完成率：' : 'Overall completion: '}
                          {Math.round((producer.tasks.total.completed / producer.tasks.total.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {taskTypes.map((taskType) => {
                      const task = producer.tasks[taskType.key];
                      return (
                        <div key={taskType.key} className="space-y-2">
                          <div className="flex items-center gap-1">
                            <taskType.icon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">{taskType.label}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-medium">{task.completed}{language === 'zh' ? '个' : ''}</span>
                            <div className="text-xs text-muted-foreground">
                              {language === 'zh' ? '相比昨天 +' : 'vs yesterday +'}{task.yesterdayChange}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>


    </div>
  );
};