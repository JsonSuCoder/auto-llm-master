import React from 'react';
import { Button } from './ui/button';
import { Languages } from 'lucide-react';
import { Language, t } from '../utils/translations';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onToggle }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="w-full justify-start"
      title={t('language', language)}
    >
      <Languages className="w-4 h-4 mr-2" />
      {language === 'zh' ? t('english', language) : t('chinese', language)}
    </Button>
  );
};