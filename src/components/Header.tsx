import React from 'react';
import { Plus } from 'lucide-react';
import type { Language } from '../locale';
import { translations } from '../locale';

interface HeaderProps {
  title: string;
  onOpenAddModal: () => void;
  language: Language;
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenAddModal, language }) => {
  const t = translations[language];

  const getFormattedDate = () => {
    const today = new Date();
    
    if (language === 'uz') {
      const kunlar = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
      const oylar = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
      return `${kunlar[today.getDay()]}, ${today.getDate()}-${oylar[today.getMonth()]}, ${today.getFullYear()}-yil`;
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const locales = {
      en: 'en-US',
      ru: 'ru-RU'
    };
    
    return today.toLocaleDateString(locales[language] || 'en-US', options);
  };

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{getFormattedDate()}</p>
      </div>
      <button onClick={onOpenAddModal} style={styles.addButton}>
        <Plus size={16} style={{ marginRight: 6 }} />
        <span>{t.newVideo}</span>
      </button>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: 500,
    textTransform: 'capitalize' as const,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.15s ease',
  },
};
