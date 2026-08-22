import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CalendarRange, 
  Film, 
  Users, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon,
  Video,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { Language } from '../locale';
import { translations } from '../locale';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  theme, 
  toggleTheme,
  language,
  setLanguage,
  isCollapsed,
  setIsCollapsed
}) => {
  const t = translations[language];

  const tabs = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'weekly', label: t.weeklyPlanner, icon: CalendarDays },
    { id: 'calendar', label: t.calendar, icon: CalendarRange },
    { id: 'videos', label: t.videos, icon: Film },
    { id: 'clients', label: t.clients, icon: Users },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <aside style={{
      ...styles.sidebar,
      width: isCollapsed ? '78px' : '240px',
    }}>
      <div style={styles.brandContainer}>
        <div style={styles.logoBox}>
          <Video size={16} color="#ffffff" />
        </div>
        {!isCollapsed && <span style={styles.brandName}>Ballu Content</span>}
      </div>

      <nav style={styles.nav}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                transform: isActive && !isCollapsed ? 'translateX(4px)' : 'translateX(0)',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                padding: isCollapsed ? '10px 0' : '10px 14px',
              }}
              title={isCollapsed ? tab.label : ''}
            >
              <Icon size={18} style={{ 
                marginRight: isCollapsed ? 0 : 12, 
                strokeWidth: isActive ? 2.5 : 2 
              }} />
              {!isCollapsed && <span>{tab.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={styles.footer}>
        {/* Toggle trigger button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          style={styles.collapseToggle}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!isCollapsed && <span style={{ marginLeft: 8 }}>Collapse Menu</span>}
        </button>

        {/* Language selector dropdown */}
        <div style={{
          ...styles.languageContainer,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          padding: isCollapsed ? '8px 0' : '8px 12px',
        }}>
          <Globe size={15} style={{ color: 'var(--text-secondary)', marginRight: isCollapsed ? 0 : 8 }} />
          {!isCollapsed && (
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={styles.langSelect}
            >
              <option value="uz">O'zbekcha</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          )}
        </div>

        <button 
          onClick={toggleTheme} 
          style={{
            ...styles.themeToggle,
            justifyContent: isCollapsed ? 'center' : 'center',
          }}
        >
          {theme === 'light' ? (
            <>
              <Moon size={16} style={{ marginRight: isCollapsed ? 0 : 8 }} />
              {!isCollapsed && <span>{t.darkMode}</span>}
            </>
          ) : (
            <>
              <Sun size={16} style={{ marginRight: isCollapsed ? 0 : 8 }} />
              {!isCollapsed && <span>{t.lightMode}</span>}
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    position: 'sticky' as const,
    top: 0,
    padding: '24px 16px',
    zIndex: 10,
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '32px',
    paddingLeft: '8px',
  },
  logoBox: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: 'var(--accent-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
    flexShrink: 0,
  },
  brandName: {
    fontSize: '17px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap' as const,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    flexGrow: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left' as const,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    outline: 'none',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  collapseToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '8px',
    borderRadius: '10px',
    border: '1px dashed var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  languageContainer: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    transition: 'all 0.2s ease',
  },
  langSelect: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: 600,
    outline: 'none',
    flexGrow: 1,
    cursor: 'pointer',
  },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    transition: 'all 0.25s ease',
  },
};
