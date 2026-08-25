import React from 'react';
import type { Client } from '../types';
import type { Language } from '../locale';
import { translations } from '../locale';

interface SettingsViewProps {
  clients: Client[];
  safetyBuffer: number;
  onUpdateSafetyBuffer: (val: number) => void;
  onClearAllDatabase?: () => void;
  language: Language;
  userRole: 'editor' | 'viewer';
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  clients,
  safetyBuffer,
  onUpdateSafetyBuffer,
  onClearAllDatabase,
  language,
  userRole,
}) => {
  const t = translations[language];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{t.sysSettings}</h2>

      {/* Safety Buffer Setting */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t.globalPlanning}</h3>
        <p style={styles.sectionDesc}>{t.planningDesc}</p>
        
        <div style={styles.bufferControls}>
          <label style={styles.label}>{t.safetyBufferLabel}</label>
          <select 
            value={safetyBuffer} 
            onChange={(e) => onUpdateSafetyBuffer(parseInt(e.target.value, 10))}
            disabled={userRole === 'viewer'}
            style={{
              ...styles.select,
              opacity: userRole === 'viewer' ? 0.6 : 1,
              cursor: userRole === 'viewer' ? 'default' : 'pointer'
            }}
          >
            <option value={0}>{t.sameDay}</option>
            <option value={1}>{t.oneDay}</option>
            <option value={2}>{t.twoDays}</option>
            <option value={3}>{t.threeDays}</option>
          </select>
        </div>
      </div>

      {/* Client List */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t.registeredClients} ({clients.length})</h3>
        <div style={styles.clientList}>
          {clients.map(c => (
            <div key={c.id} style={styles.clientItem}>
              <div>
                <div style={styles.clientNameText}>{c.name}</div>
                <div style={styles.clientNiche}>{c.specialty}</div>
              </div>
              <div style={styles.clientTargets}>
                {c.reelsTarget > 0 && <span>{c.reelsTarget} Reels</span>}
                {c.reelsTarget > 0 && c.youtubeTarget > 0 && <span> + </span>}
                {c.youtubeTarget > 0 && <span>{c.youtubeTarget} YouTube</span>}
                {c.reelsTarget === 0 && c.youtubeTarget === 0 && <span>{t.noTargets}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dangerous Zone (Clear Database) */}
      {userRole === 'editor' && onClearAllDatabase && (
        <div style={{ ...styles.section, border: '1px dashed #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
          <h3 style={{ ...styles.sectionTitle, color: '#ef4444' }}>
            {language === 'uz' ? 'Tizimni tozalash' : language === 'ru' ? 'Сброс данных' : 'Danger Zone'}
          </h3>
          <p style={styles.sectionDesc}>
            {language === 'uz' 
              ? 'Barcha ro\'yxatdan o\'tgan mijozlarni va rejalashtirilgan videolarni butunlay o\'chirib yuboradi.' 
              : language === 'ru' 
                ? 'Полностью удалит всех зарегистрированных клиентов и запланированные видео.' 
                : 'This will delete all registered clients and planned videos completely.'}
          </p>
          <button
            onClick={() => {
              const pass = prompt(
                language === 'uz' 
                  ? 'Barcha ma\'lumotlarni o\'chirish uchun parolni kiriting:' 
                  : language === 'ru' 
                    ? 'Введите пароль для сброса всех данных:' 
                    : 'Enter password to clear all database:'
              );
              if (pass === '1234') {
                onClearAllDatabase();
              } else {
                alert(
                  language === 'uz' 
                    ? 'Noto\'g\'ri parol!' 
                    : language === 'ru' 
                      ? 'Неверный пароль!' 
                      : 'Incorrect password!'
                );
              }
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              alignSelf: 'flex-start',
              marginTop: '8px',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)'
            }}
          >
            {language === 'uz' ? 'Barcha ma\'lumotlarni o\'chirish' : language === 'ru' ? 'Сбросить все данные' : 'Clear All Data'}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    maxWidth: '700px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  section: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  sectionDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  bufferControls: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    marginTop: '6px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: 500,
    outline: 'none',
    width: '200px',
  },
  clientList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  clientItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
  },
  clientNameText: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  clientNiche: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  clientTargets: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
};
