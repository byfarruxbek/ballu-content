import React from 'react';
import type { Video } from '../types';
import { getPlatformIcon } from './VideoCard';
import type { Language } from '../locale';
import { translations } from '../locale';

interface CalendarViewProps {
  videos: Video[];
  onOpenCard: (video: Video) => void;
  onOpenQuickAddWithDate: (dateStr: string) => void;
  language: Language;
  userRole: 'editor' | 'viewer';
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  videos,
  onOpenCard,
  onOpenQuickAddWithDate,
  language,
  userRole,
}) => {
  const t = translations[language];
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const getFormattedMonth = () => {
    const localeStr = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US';
    return currentDate.toLocaleDateString(localeStr, { month: 'long', year: 'numeric' });
  };

  const uzWeek = ['Dush', 'Ses', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
  const ruWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const enWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weekdays = language === 'uz' ? uzWeek : language === 'ru' ? ruWeek : enWeek;

  return (
    <div style={styles.container}>
      <div style={styles.calendarHeader}>
        <div>
          <h2 style={styles.title}>{t.monthlyPlanner}</h2>
          <p style={styles.subtitle}>{getFormattedMonth()}</p>
        </div>
        <div style={styles.navBtns}>
          <button onClick={prevMonth} style={styles.navBtn}>{t.prevMonth}</button>
          <button onClick={nextMonth} style={styles.navBtn}>{t.nextMonth}</button>
        </div>
      </div>

      <div style={styles.calendarGrid}>
        {weekdays.map(d => (
          <div key={d} style={styles.weekdayHeader}>{d}</div>
        ))}

        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} style={styles.emptyDay} />;
          }

          const dateStr = day.toISOString().split('T')[0];
          
          const dayVideos = videos.filter(v => 
            v.status !== 'Cancelled' && 
            (v.publishDate === dateStr || v.deliveryDeadline === dateStr)
          );

          return (
            <div 
              key={dateStr} 
              style={{
                ...styles.dayCell,
                cursor: userRole === 'viewer' ? 'default' : 'pointer'
              }}
              onClick={() => {
                if (userRole !== 'viewer') {
                  onOpenQuickAddWithDate(dateStr);
                }
              }}
            >
              <div style={styles.dayNumber}>{day.getDate()}</div>
              <div style={styles.eventsContainer}>
                {dayVideos.map(video => {
                  const isPublish = video.publishDate === dateStr;
                  return (
                    <div 
                      key={video.id} 
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCard(video);
                      }}
                      style={{
                        ...styles.eventChip,
                        borderLeft: `3px solid ${isPublish ? 'var(--status-published)' : 'var(--status-editing)'}`,
                      }}
                    >
                      <div style={styles.eventText}>
                        <span style={styles.eventClient}>{video.clientName}</span>
                        <span style={styles.eventTitle}>{video.title}</span>
                      </div>
                      <div style={styles.eventIcon}>
                        {getPlatformIcon(video.platform)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: 500,
    textTransform: 'capitalize' as const,
  },
  navBtns: {
    display: 'flex',
    gap: '10px',
  },
  navBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    backgroundColor: 'var(--border-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  weekdayHeader: {
    backgroundColor: 'var(--bg-secondary)',
    padding: '12px',
    textAlign: 'center' as const,
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)',
  },
  dayCell: {
    backgroundColor: 'var(--bg-secondary)',
    minHeight: '120px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  emptyDay: {
    backgroundColor: 'var(--bg-primary)',
  },
  dayNumber: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    alignSelf: 'flex-end',
    marginBottom: '6px',
  },
  eventsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    flexGrow: 1,
    overflowY: 'auto' as const,
    maxHeight: '90px',
  },
  eventChip: {
    backgroundColor: 'var(--bg-primary)',
    padding: '4px 6px',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '10px',
    gap: '4px',
    boxShadow: 'var(--shadow-sm)',
    transition: 'opacity 0.15s ease',
  },
  eventText: {
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    flexGrow: 1,
  },
  eventClient: {
    fontWeight: 700,
    color: 'var(--text-secondary)',
  },
  eventTitle: {
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  eventIcon: {
    display: 'flex',
    alignItems: 'center',
  },
};
