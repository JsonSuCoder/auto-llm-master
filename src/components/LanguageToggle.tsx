import React from 'react';
import { Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { Language, t } from '../utils/translations';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onToggle }) => {
  return (
    <Button
      type="text"
      className='!text-white'
      size="middle"
      onClick={onToggle}
      style={{ width: '100%', justifyContent: 'flex-start' }}
      title={t('language', language)}
      icon={<GlobalOutlined />}
    >
      {language === 'zh' ? t('english', language) : t('chinese', language)}
    </Button>
  );
};
