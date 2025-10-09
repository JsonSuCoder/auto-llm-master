import React from 'react';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
import { Language, t } from '../utils/translations';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  language?: Language;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle, language = 'en' }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="w-full justify-start"
      title={isDark ? t('switchToLight', language) : t('switchToDark', language)}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 mr-2" />
          {t('lightMode', language)}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 mr-2" />
          {t('darkMode', language)}
        </>
      )}
    </Button>
  );
};