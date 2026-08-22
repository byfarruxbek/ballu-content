import React from 'react';
import type { Video, Platform, Priority, VideoStatus } from '../types';
import { 
  Play, 
  Video as VideoIcon, 
  PlaySquare, 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
} from 'lucide-react';
import type { Language } from '../locale';
import { translations } from '../locale';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  onStatusChange?: (id: string, newStatus: VideoStatus) => void;
  language?: Language;
}

export const getPlatformIcon = (platform: Platform) => {
  switch (platform) {
    case 'Instagram Reels':
      return <VideoIcon size={13} color="#ffffff" />;
    case 'YouTube Shorts':
      return <Play size={13} color="#ffffff" fill="#ffffff" />;
    case 'YouTube':
      return <PlaySquare size={13} color="#ffffff" />;
  }
};

export const getLocalizedStatus = (status: VideoStatus, lang: Language = 'uz'): string => {
  const t = translations[lang];
  switch (status) {
    case 'Material Not Received': return t.statusNotReceived;
    case 'Material Received': return t.statusReceived;
    case 'In Editing': return t.statusEditing;
    case 'Revision': return t.statusRevision;
    case 'Ready': return t.statusReady;
    case 'Scheduled': return t.statusScheduled;
    case 'Published': return t.statusPublished;
    case 'Cancelled': return t.statusCancelled;
    default: return status;
  }
};

export const getStatusColor = (status: VideoStatus): string => {
  switch (status) {
    case 'Material Not Received': return '#6b7280';
    case 'Material Received': return '#0ea5e9';
    case 'In Editing': return '#d97706';
    case 'Revision': return '#ea580c';
    case 'Ready': return '#10b981';
    case 'Scheduled': return '#6366f1';
    case 'Published': return '#2563eb';
    case 'Cancelled': return '#dc2626';
    default: return '#3b82f6';
  }
};

export const getStatusBadgeStyle = (status: VideoStatus) => {
  const color = getStatusColor(status);
  return { backgroundColor: `${color}12`, color, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: `1px solid ${color}22` };
};

export const getPriorityBadgeStyle = (priority: Priority) => {
  let bg = '';
  let color = '#ffffff';

  switch (priority) {
    case 'Low':
      bg = 'rgba(107, 114, 128, 0.08)';
      color = 'var(--text-muted)';
      break;
    case 'Medium':
      bg = 'rgba(59, 130, 246, 0.08)';
      color = '#3b82f6';
      break;
    case 'High':
      bg = 'rgba(249, 115, 22, 0.08)';
      color = '#f97316';
      break;
    case 'Urgent':
      bg = 'rgba(220, 38, 38, 0.08)';
      color = '#dc2626';
      break;
  }
  return { backgroundColor: bg, color, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: `1px solid ${color}22` };
};

// Alert Logic Helper
export const getAlertDetails = (video: Video, lang: Language = 'uz') => {
  if (video.status === 'Cancelled') return null;

  const t = translations[lang];
  const today = new Date();
  today.setHours(0,0,0,0);

  const deadline = new Date(video.deliveryDeadline);
  deadline.setHours(0,0,0,0);

  const publish = new Date(video.publishDate);
  publish.setHours(0,0,0,0);

  const isCompleted = ['Ready', 'Scheduled', 'Published'].includes(video.status);

  // Overdue: Delivery passed and not Ready, Scheduled, Published
  if (deadline.getTime() < today.getTime() && !isCompleted) {
    return {
      type: 'overdue',
      label: t.alertOverdue,
      color: '#ef4444',
      icon: <AlertCircle size={12} color="#ef4444" style={{ marginRight: 4 }} />
    };
  }

  // At Risk: Published tomorrow but not Ready/Scheduled/Published
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (publish.getTime() === tomorrow.getTime() && !isCompleted) {
    return {
      type: 'at-risk',
      label: t.alertAtRisk,
      color: '#f97316',
      icon: <AlertTriangle size={12} color="#f97316" style={{ marginRight: 4 }} />
    };
  }

  // Urgent: Delivery is today and not completed
  if (deadline.getTime() === today.getTime() && !isCompleted) {
    return {
      type: 'urgent',
      label: t.alertUrgent,
      color: '#ef4444',
      icon: <Clock size={12} color="#ef4444" style={{ marginRight: 4 }} />
    };
  }

  // Ready to Publish: Status is Ready & publish date is today
  if (video.status === 'Ready' && publish.getTime() === today.getTime()) {
    return {
      type: 'ready-publish',
      label: t.alertReadyPublish,
      color: '#10b981',
      icon: <CheckCircle size={12} color="#10b981" style={{ marginRight: 4 }} />
    };
  }

  return null;
};

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, onStatusChange, language = 'uz' }) => {
  const t = translations[language];
  const alert = getAlertDetails(video, language);
  const statusColor = getStatusColor(video.status);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', video.id);
  };

  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(video.id, e.target.value as VideoStatus);
    }
  };

  const openLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (url) window.open(url, '_blank');
  };

  // Format YYYY-MM-DD to cleaner relative or display format
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (language === 'uz') {
          const oylar = ['Yanv', 'Fev', 'Mart', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
          return `${d.getDate()}-${oylar[d.getMonth()]}`;
        }
        return d.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      style={{
        ...styles.card,
        borderLeft: `4px solid ${statusColor}`
      }}
      className="video-card-element"
    >
      {/* Title & Platform header */}
      <div style={styles.header}>
        <div style={styles.titleArea}>
          <span style={styles.client}>{video.clientName}</span>
          <h4 style={styles.title}>{video.title}</h4>
        </div>
        <div style={{ ...styles.platformIcon, backgroundColor: statusColor }}>
          {getPlatformIcon(video.platform)}
        </div>
      </div>

      {/* Dates block - Google Calendar style: stacked and clear */}
      <div style={styles.datesGrid}>
        <div style={styles.dateBlock}>
          <span style={styles.dateLabel}>{language === 'uz' ? 'Topshirish:' : language === 'ru' ? 'Сдать:' : 'Due:'}</span>
          <span style={styles.dateValue}>{formatDateString(video.deliveryDeadline)}</span>
        </div>
        <div style={styles.dateBlock}>
          <span style={styles.dateLabel}>{language === 'uz' ? 'Chop etish:' : language === 'ru' ? 'Пост:' : 'Pub:'}</span>
          <span style={styles.dateValue}>{formatDateString(video.publishDate)}</span>
        </div>
      </div>

      {/* Badges and Alert banner if applicable */}
      <div style={styles.badgeRow}>
        <span style={getPriorityBadgeStyle(video.priority)}>{video.priority}</span>
        {alert && (
          <div style={{ ...styles.alertBox, color: alert.color }}>
            {alert.icon}
            <span style={styles.alertText}>{alert.label}</span>
          </div>
        )}
      </div>

      {/* Quick Action Footer: Inline status switcher and quick action link dots */}
      <div style={styles.cardFooter} onClick={(e) => e.stopPropagation()}>
        <select 
          value={video.status}
          onChange={handleStatusSelect}
          style={styles.statusSelect}
        >
          <option value="Material Not Received">{t.statusNotReceived}</option>
          <option value="Material Received">{t.statusReceived}</option>
          <option value="In Editing">{t.statusEditing}</option>
          <option value="Revision">{t.statusRevision}</option>
          <option value="Ready">{t.statusReady}</option>
          <option value="Scheduled">{t.statusScheduled}</option>
          <option value="Published">{t.statusPublished}</option>
          <option value="Cancelled">{t.statusCancelled}</option>
        </select>

        <div style={styles.linkButtons}>
          {video.rawMaterialLink && (
            <button 
              onClick={(e) => openLink(e, video.rawMaterialLink)}
              style={styles.linkButton} 
              title="Raw Materials"
            >
              Raw
            </button>
          )}
          {video.finalVideoLink && (
            <button 
              onClick={(e) => openLink(e, video.finalVideoLink)}
              style={styles.linkButton} 
              title="Final Cut"
            >
              Final
            </button>
          )}
          {video.publishedPostLink && (
            <button 
              onClick={(e) => openLink(e, video.publishedPostLink)}
              style={styles.linkButton} 
              title="Published Link"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '12px 14px',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'grab',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    transition: 'all 0.15s ease',
    marginBottom: '10px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
    overflow: 'hidden',
  },
  client: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginTop: '2px',
    lineHeight: '1.35',
    whiteSpace: 'normal' as const,
    wordBreak: 'break-word' as const,
  },
  platformIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  datesGrid: {
    display: 'flex',
    gap: '10px',
    backgroundColor: 'var(--bg-primary)',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
  },
  dateBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
  },
  dateLabel: {
    fontSize: '8px',
    color: 'var(--text-muted)',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
  dateValue: {
    fontSize: '11px',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  alertBox: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: 700,
    backgroundColor: 'transparent',
  },
  alertText: {
    fontSize: '10px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-color)',
    gap: '8px',
  },
  statusSelect: {
    flexGrow: 1,
    fontSize: '10px',
    padding: '3px 6px',
    borderRadius: '4px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    outline: 'none',
    cursor: 'pointer',
    maxWidth: '95px',
    fontWeight: 600,
  },
  linkButtons: {
    display: 'flex',
    gap: '4px',
  },
  linkButton: {
    padding: '4px 6px',
    fontSize: '9px',
    fontWeight: 700,
    backgroundColor: 'var(--accent-light)',
    color: 'var(--accent-color)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
