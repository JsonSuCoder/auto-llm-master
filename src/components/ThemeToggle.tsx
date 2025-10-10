import React from 'react';
import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { Language, t } from '../utils/translations';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  language?: Language;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle, language = 'en' }) => {
  return (
    <Button
      type="text"
      size="middle"
      onClick={onToggle}
      style={{ width: '100%', justifyContent: 'flex-start' }}
      title={isDark ? t('switchToLight', language) : t('switchToDark', language)}
      icon={isDark ? <BulbFilled /> : <BulbOutlined />}
    >
      {isDark ? t('lightMode', language) : t('darkMode', language)}
    </Button>
  );
};
