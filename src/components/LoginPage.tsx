import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, Mail, Bot, AlertCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Language, t } from '../utils/translations';
import { onLogin } from '../api/user';

interface LoginPageProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, isDarkMode, onToggleDarkMode, language, onToggleLanguage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email && password) {
        onLogin(email, password).then((res: any) => {
          setLoading(false);
          if (res.code === 200) {
            // 保存用户信息到localStorage，设置12小时有效期
            const expiresAt = new Date().getTime() + 12 * 60 * 60 * 1000; // 12小时后的时间戳
            const userData = {
              ...res.user,
              expiresAt
            };
            localStorage.setItem('user', JSON.stringify(userData));
            onLoginSuccess(res.user);
          } else {
            setError(res.message || '登录失败，请检查账号和密码');
          }
        }).catch(err => {
          console.log(err);
          setError('登录失败，请稍后再试');
          setLoading(false);
        });
      }
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
                    className={`pl-10 ${error ? 'border-red-500' : ''}`}
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
                    className={`pl-10 ${error ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {error && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{error}</span>
                  </div>
                )}
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