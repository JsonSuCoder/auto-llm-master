import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, Mail, Bot } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Language, t } from '../utils/translations';

interface LoginPageProps {
  onLogin: (userData: any) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isDarkMode, onToggleDarkMode, language, onToggleLanguage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 模拟登录验证
    setTimeout(() => {
      if (email && password) {
        const userData = {
          id: email === 'admin@gmail.com' ? 1 : 2,
          username: email,
          name: email === 'admin@gmail.com' ? t('admin', language) : t('producer', language),
          role: email === 'admin@gmail.com' ? 'admin' : 'producer',
          permissions: email === 'admin@gmail.com' 
            ? ['user_management', 'query_type_management', 'query_production', 'data_distillation', 'data_annotation', 'blind_evaluation']
            : ['query_production', 'data_distillation', 'data_annotation', 'blind_evaluation']
        };
        onLogin(userData);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-violet-100 dark:from-sky-900 dark:to-violet-900 flex items-center justify-center p-4 relative">
      {/* 主题和语言切换按钮 - 左下角 */}
      <div className="absolute bottom-6 left-6 space-y-2">
        <ThemeToggle isDark={isDarkMode} onToggle={onToggleDarkMode} language={language} />
        <LanguageToggle language={language} onToggle={onToggleLanguage} />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4">
            <Bot className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('loginTitle', language)}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('loginSubtitle', language)}</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('login', language)}</CardTitle>
            <CardDescription>
              {t('loginDescription', language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('username', language)}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('password', language)}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('enterPassword', language)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('loggingIn', language) : t('loginButton', language)}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('testAccounts', language)}</p>
              <div className="text-xs space-y-1">
                <p><strong>{t('admin', language)}：</strong> admin@gmail.com / {t('anyPassword', language)}</p>
                <p><strong>{t('producer', language)}：</strong> producer@gmail.com / {t('anyPassword', language)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};