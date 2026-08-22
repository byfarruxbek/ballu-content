import React from 'react';
import type { Video } from '../types';
import { VideoCard } from './VideoCard';
import type { Language } from '../locale';
import { translations } from '../locale';

interface WeeklyPlannerViewProps {
  videos: Video[];
  onOpenCard: (video: Video) => void;
  onUpdateVideoDates: (id: string, newDelivery: string, newPublish: string) => void;
  language: Language;
  userRole: 'editor' | 'viewer';
}

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  videos,
  onOpenCard,
  onUpdateVideoDates,
  language,
  userRole,
}) => {
  const t = translations[language];

  // Get start of the current week (Monday)
  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const [currentWeekMonday, setCurrentWeekMonday] = React.useState<Date>(() => {
    return getMonday(new Date());
  });

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekMonday);
      d.setDate(currentWeekMonday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  
  const uzDays = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];
  const ruDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  const enDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const dayNames = language === 'uz' ? uzDays : language === 'ru' ? ruDays : enDays;

  const prevWeek = () => {
    setCurrentWeekMonday(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 7);
      return d;
    });
  };

  const nextWeek = () => {
    setCurrentWeekMonday(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 7);
      return d;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    const videoId = e.dataTransfer.getData('text/plain');
    if (!videoId) return;

    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const buffer = video.safetyBufferDays ?? 1;
    const pubDate = new Date(targetDateStr);
    const deadlineDate = new Date(pubDate);
    deadlineDate.setDate(pubDate.getDate() - buffer);

    onUpdateVideoDates(
      videoId,
      deadlineDate.toISOString().split('T')[0],
      pubDate.toISOString().split('T')[0]
    );
  };

  const getFormattedWeekRange = () => {
    if (language === 'uz') {
      const oylar = ['Yanv', 'Fev', 'Mart', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
      return `${weekDays[0].getDate()}-${oylar[weekDays[0].getMonth()]} – ${weekDays[6].getDate()}-${oylar[weekDays[6].getMonth()]}, ${weekDays[6].getFullYear()}`;
    }
    const localeStr = language === 'ru' ? 'ru-RU' : 'en-US';
    return `${weekDays[0].toLocaleDateString(localeStr, { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString(localeStr, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.plannerHeader}>
        <div>
          <h2 style={styles.title}>{t.weeklySchedule}</h2>
          <p style={styles.subtitle}>
            {t.weekOf} {getFormattedWeekRange()}
          </p>
        </div>
        <div style={styles.navBtns}>
          <button onClick={prevWeek} style={styles.navBtn}>{t.prevWeek}</button>
          <button onClick={nextWeek} style={styles.navBtn}>{t.nextWeek}</button>
        </div>
      </div>

      <div style={styles.plannerGrid}>
        {weekDays.map((day, idx) => {
          const dateStr = day.toISOString().split('T')[0];
          // Filter videos scheduled to publish or due on this day
          const dayVideos = videos.filter(v => 
            v.status !== 'Cancelled' && 
            (v.publishDate === dateStr || v.deliveryDeadline === dateStr)
          );

          return (
            <div 
              key={dateStr}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dateStr)}
              style={styles.dayColumn}
            >
              <div style={styles.dayHeader}>
                <span style={styles.dayName}>{dayNames[idx]}</span>
                <span style={styles.dayDate}>
                  {(() => {
                    if (language === 'uz') {
                      const oylar = ['Yanv', 'Fev', 'Mart', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
                      return `${day.getDate()}-${oylar[day.getMonth()]}`;
                    }
                    const localeStr = language === 'ru' ? 'ru-RU' : 'en-US';
                    return day.toLocaleDateString(localeStr, { month: 'short', day: 'numeric' });
                  })()}
                </span>
              </div>

              <div style={styles.cardsContainer}>
                {dayVideos.length === 0 ? (
                  <div style={styles.emptyColumn}>{t.dropHere}</div>
                ) : (
                  dayVideos.map(video => {
                    const isPublish = video.publishDate === dateStr;
                    return (
                      <div key={video.id} style={styles.cardWrapper}>
                        <div style={{
                          ...styles.cardIndicator,
                          backgroundColor: isPublish ? 'var(--status-published)' : 'var(--status-editing)',
                        }}>
                          {isPublish ? t.publishing : t.dueEditing}
                        </div>
                        <VideoCard 
                          video={video} 
                          onClick={() => onOpenCard(video)} 
                          language={language}
                          userRole={userRole}
                        />
                      </div>
                    );
                  })
                )}
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
  plannerHeader: {
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
  plannerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '12px',
    overflowX: 'auto' as const,
    paddingBottom: '20px',
  },
  dayColumn: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    minWidth: '270px',
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '65vh',
  },
  dayHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  dayName: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  dayDate: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 600,
    marginTop: '2px',
  },
  cardsContainer: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    flexGrow: 1,
  },
  emptyColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    border: '2px dashed var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontWeight: 500,
    minHeight: '100px',
  },
  cardWrapper: {
    position: 'relative' as const,
  },
  cardIndicator: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#ffffff',
    padding: '2px 6px',
    borderRadius: '4px',
    position: 'absolute' as const,
    top: '-8px',
    left: '12px',
    zIndex: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};
