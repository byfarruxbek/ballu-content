import React from 'react';
import type { Video } from '../types';
import { VideoCard, getAlertDetails } from './VideoCard';
import { AlertCircle, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import type { Language } from '../locale';
import { translations } from '../locale';

interface DashboardViewProps {
  videos: Video[];
  onOpenCard: (video: Video) => void;
  onStatusChange: (id: string, newStatus: any) => void;
  language: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  videos,
  onOpenCard,
  onStatusChange,
  language,
}) => {
  const t = translations[language];
  const todayStr = new Date().toISOString().split('T')[0];

  // Active status groups & KPI aggregations
  const inEditing = videos.filter(v => v.status === 'In Editing').length;
  
  const dueToday = videos.filter(v => v.deliveryDeadline === todayStr && v.status !== 'Cancelled').length;
  const publishingToday = videos.filter(v => v.publishDate === todayStr && v.status !== 'Cancelled').length;
  const cancelledCount = videos.filter(v => v.status === 'Cancelled').length;

  // Alerts counters
  const overdueVideos = videos.filter(v => {
    const alert = getAlertDetails(v);
    return alert?.type === 'overdue';
  });

  const atRiskVideos = videos.filter(v => {
    const alert = getAlertDetails(v);
    return alert?.type === 'at-risk';
  });

  const urgentVideos = videos.filter(v => {
    const alert = getAlertDetails(v);
    return alert?.type === 'urgent';
  });

  const readyToPublishVideos = videos.filter(v => {
    const alert = getAlertDetails(v);
    return alert?.type === 'ready-publish';
  });

  // Client counts
  const clientSet = new Set(videos.map(v => v.clientId));
  const activeClients = clientSet.size;

  // Tasks for today: videos with delivery deadline today or publish date today
  const todaysTasks = videos.filter(v => 
    (v.deliveryDeadline === todayStr || v.publishDate === todayStr) && 
    v.status !== 'Cancelled'
  );

  return (
    <div style={styles.container}>
      {/* KPI Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>{t.activeClients}</span>
          <span style={styles.statVal}>{activeClients}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>{t.statusEditing}</span>
          <span style={styles.statVal}>{inEditing}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>{t.dueToday}</span>
          <span style={styles.statVal}>{dueToday}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>{t.publishingToday}</span>
          <span style={styles.statVal}>{publishingToday}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>{t.overdueVideos}</span>
          <span style={{ ...styles.statVal, color: 'var(--priority-urgent)' }}>{overdueVideos.length}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>{t.statusCancelled}</span>
          <span style={styles.statVal}>{cancelledCount}</span>
        </div>
      </div>

      {/* Smart Alerts Section */}
      <div style={styles.alertsContainer}>
        <h3 style={styles.sectionTitle}>{t.smartAlerts}</h3>
        <div style={styles.alertsGrid}>
          {/* Overdue */}
          <div style={{ ...styles.alertBox, backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: '#ef4444' }}>
            <div style={styles.alertHeader}>
              <AlertCircle size={18} color="#ef4444" />
              <span style={{ ...styles.alertTitle, color: '#ef4444' }}>{t.alertOverdue} ({overdueVideos.length})</span>
            </div>
            <p style={styles.alertDesc}>{t.overdueDesc}</p>
            {overdueVideos.map(v => (
              <div key={v.id} onClick={() => onOpenCard(v)} style={styles.alertItem}>
                <span>{v.clientName} - {v.title}</span>
              </div>
            ))}
          </div>

          {/* At Risk */}
          <div style={{ ...styles.alertBox, backgroundColor: 'rgba(249, 115, 22, 0.08)', borderColor: '#f97316' }}>
            <div style={styles.alertHeader}>
              <AlertTriangle size={18} color="#f97316" />
              <span style={{ ...styles.alertTitle, color: '#f97316' }}>{t.alertAtRisk} ({atRiskVideos.length})</span>
            </div>
            <p style={styles.alertDesc}>{t.atRiskDesc}</p>
            {atRiskVideos.map(v => (
              <div key={v.id} onClick={() => onOpenCard(v)} style={styles.alertItem}>
                <span>{v.clientName} - {v.title}</span>
              </div>
            ))}
          </div>

          {/* Urgent */}
          <div style={{ ...styles.alertBox, backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: '#ef4444' }}>
            <div style={styles.alertHeader}>
              <Clock size={18} color="#ef4444" />
              <span style={{ ...styles.alertTitle, color: '#ef4444' }}>{t.alertUrgent} ({urgentVideos.length})</span>
            </div>
            <p style={styles.alertDesc}>{t.urgentDesc}</p>
            {urgentVideos.map(v => (
              <div key={v.id} onClick={() => onOpenCard(v)} style={styles.alertItem}>
                <span>{v.clientName} - {v.title}</span>
              </div>
            ))}
          </div>

          {/* Ready to Publish */}
          <div style={{ ...styles.alertBox, backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: '#10b981' }}>
            <div style={styles.alertHeader}>
              <CheckCircle size={18} color="#10b981" />
              <span style={{ ...styles.alertTitle, color: '#10b981' }}>{t.alertReadyPublish} ({readyToPublishVideos.length})</span>
            </div>
            <p style={styles.alertDesc}>{t.readyPublishDesc}</p>
            {readyToPublishVideos.map(v => (
              <div key={v.id} onClick={() => onOpenCard(v)} style={styles.alertItem}>
                <span>{v.clientName} - {v.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Tasks Section */}
      <div style={styles.tasksSection}>
        <h3 style={styles.sectionTitle}>{t.todaysTasks}</h3>
        {todaysTasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p>{t.noTasks}</p>
          </div>
        ) : (
          <div style={styles.tasksGrid}>
            {todaysTasks.map(v => (
              <VideoCard 
                key={v.id} 
                video={v} 
                onClick={() => onOpenCard(v)} 
                onStatusChange={onStatusChange}
                language={language}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '28px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  statCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: 'var(--shadow-sm)',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
  statVal: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  alertsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  alertBox: {
    border: '1px solid',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: 700,
  },
  alertDesc: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginBottom: '4px',
  },
  alertItem: {
    fontSize: '12px',
    padding: '6px 8px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'all 0.15s ease',
  },
  tasksSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  emptyState: {
    padding: '32px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px dashed var(--border-color)',
    textAlign: 'center' as const,
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
  tasksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
};
