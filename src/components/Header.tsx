import React from 'react';
import { Plus, Shield, LogOut } from 'lucide-react';
import type { Language } from '../locale';
import { translations } from '../locale';

interface HeaderProps {
  title: string;
  onOpenAddModal: () => void;
  language: Language;
  userRole: 'editor' | 'viewer';
  onChangeRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onOpenAddModal, 
  language, 
  userRole, 
  onChangeRole 
}) => {
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
      
      <div style={styles.actions}>
        <button onClick={onChangeRole} style={{
          ...styles.roleIndicator,
          backgroundColor: userRole === 'editor' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
          color: userRole === 'editor' ? '#10b981' : 'var(--text-secondary)',
          border: `1px solid ${userRole === 'editor' ? '#10b98133' : 'var(--border-color)'}`,
        }}>
          <Shield size={14} style={{ marginRight: 6 }} />
          <span style={{ textTransform: 'capitalize' }}>
            {userRole === 'editor' 
              ? (language === 'uz' ? 'Tahrirlovchi' : language === 'ru' ? 'Редактор' : 'Editor')
              : (language === 'uz' ? 'Ko\'ruvchi' : language === 'ru' ? 'Наблюдатель' : 'Viewer')
            }
          </span>
          <LogOut size={12} style={{ marginLeft: 8, opacity: 0.6 }} />
        </button>

        {userRole === 'editor' && (
          <button onClick={onOpenAddModal} style={styles.addButton}>
            <Plus size={16} style={{ marginRight: 6 }} />
            <span>{t.newVideo}</span>
          </button>
        )}
      </div>
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
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  roleIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: 'var(--accent-color)',
    color: '#ffffff',
    border: 'none',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
    transition: 'all 0.15s ease',
  },
};
