import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Users, Settings, FileText, Database, Tag, Eye,
  LogOut, Bot, Home, ChevronRight
} from 'lucide-react';
import { UserManagement } from './UserManagement';
import { QueryTypeManagement } from './QueryTypeManagement';
import { QueryProduction } from './QueryProduction';
import { DataDistillation } from './DataDistillation';
import { DataAnnotation } from './DataAnnotation';
import { BlindEvaluation } from './BlindEvaluation';
import { DashboardHome } from './DashboardHome';
import { DistillationResults } from './DistillationResults';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Language, t } from '../utils/translations';

interface MainDashboardProps {
  user: any;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ user, onLogout, isDarkMode, onToggleDarkMode, language, onToggleLanguage }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [distillationResultsData, setDistillationResultsData] = useState<{
    taskId: number;
    taskName: string;
  } | null>(null);

  const menuItems = [
    { id: 'home', label: t('home', language), icon: Home, permission: null },
    { id: 'users', label: t('userManagement', language), icon: Users, permission: 'admin' },
    { id: 'query-types', label: t('queryTypeManagement', language), icon: Settings, permission: null },
    { id: 'query-production', label: t('queryProduction', language), icon: FileText, permission: null },
    { id: 'data-distillation', label: t('dataDistillation', language), icon: Database, permission: null },
    { id: 'data-annotation', label: t('dataAnnotation', language), icon: Tag, permission: null },
    { id: 'blind-evaluation', label: t('blindEvaluation', language), icon: Eye, permission: null }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || user.role === item.permission
  );

  const handleViewDistillationResults = (taskId: number, taskName: string) => {
    setDistillationResultsData({ taskId, taskName });
    setActiveTab('distillation-results');
  };

  const handleBackFromResults = () => {
    setDistillationResultsData(null);
    setActiveTab('data-distillation');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome user={user} language={language} />;
      case 'users':
        return <UserManagement language={language} />;
      case 'query-types':
        return <QueryTypeManagement language={language} />;
      case 'query-production':
        return <QueryProduction language={language} />;
      case 'data-distillation':
        return <DataDistillation language={language} onViewResults={handleViewDistillationResults} />;
      case 'data-annotation':
        return <DataAnnotation language={language} />;
      case 'blind-evaluation':
        return <BlindEvaluation language={language} />;
      case 'distillation-results':
        return distillationResultsData ? (
          <DistillationResults 
            language={language}
            taskId={distillationResultsData.taskId}
            taskName={distillationResultsData.taskName}
            onBack={handleBackFromResults}
          />
        ) : (
          <DashboardHome user={user} language={language} />
        );
      default:
        return <DashboardHome user={user} language={language} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-lg">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-semibold">{language === 'zh' ? '微调系统' : 'Fine-tuning System'}</h2>
                <p className="text-xs text-muted-foreground">V1.0</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                    {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'admin' ? t('admin', language) : t('producer', language)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <ThemeToggle isDark={isDarkMode} onToggle={onToggleDarkMode} language={language} />
              <LanguageToggle language={language} onToggle={onToggleLanguage} />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout', language)}
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-14 items-center px-4 gap-4">
              <SidebarTrigger />
              <h1 className="font-semibold">
                {filteredMenuItems.find(item => item.id === activeTab)?.label || t('home', language)}
              </h1>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50/50 dark:bg-gray-900/50">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};