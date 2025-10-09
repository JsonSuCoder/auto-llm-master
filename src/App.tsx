import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { MainDashboard } from './components/MainDashboard';
import { Language } from './utils/translations';
import { User } from './api/user';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 从localStorage读取主题设置，默认为false（明亮模式）
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [language, setLanguage] = useState<Language>(() => {
    // 从localStorage读取语言设置，默认为英文
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  // 检查用户登录状态和有效期
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const now = new Date().getTime();
      
      // 检查登录是否过期
      if (userData.expiresAt && userData.expiresAt > now) {
        setUser(userData);
      } else {
        // 登录已过期，清除存储的用户信息
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData:User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev:any) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang: Language = prev === 'en' ? 'zh' : 'en';
      localStorage.setItem('language', newLang);
      return newLang;
    });
  };

  // 应用深色模式到document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (!user) {
    return (
      <LoginPage 
        onLoginSuccess={handleLogin} 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={toggleDarkMode}
        language={language}
        onToggleLanguage={toggleLanguage}
      />
    );
  }

  return (
    <MainDashboard 
      user={user} 
      onLogout={handleLogout} 
      isDarkMode={isDarkMode} 
      onToggleDarkMode={toggleDarkMode}
      language={language}
      onToggleLanguage={toggleLanguage}
    />
  );
}