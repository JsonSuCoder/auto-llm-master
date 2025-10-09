import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { MainDashboard } from './components/MainDashboard';
import { Language } from './utils/translations';

export default function App() {
  const [user, setUser] = useState(null);
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

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
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
        onLogin={handleLogin} 
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