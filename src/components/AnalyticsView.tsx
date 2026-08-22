import React from 'react';
import type { Video } from '../types';
import { 
  Play, 
  Video as VideoIcon, 
  PlaySquare, 
  TrendingUp, 
  Film, 
  CheckCircle 
} from 'lucide-react';
import type { Language } from '../locale';
import { translations } from '../locale';

interface AnalyticsViewProps {
  videos: Video[];
  language: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ videos, language }) => {
  const t = translations[language];

  const published = videos.filter(v => v.status === 'Published');
  const totalCount = videos.filter(v => v.status !== 'Cancelled').length;

  const instaReelsCount = videos.filter(v => v.platform === 'Instagram Reels' && v.status !== 'Cancelled').length;
  const youtubeShortsCount = videos.filter(v => v.platform === 'YouTube Shorts' && v.status !== 'Cancelled').length;
  const youtubeVideosCount = videos.filter(v => v.platform === 'YouTube' && v.status !== 'Cancelled').length;

  const pubReels = published.filter(v => v.platform === 'Instagram Reels').length;
  const pubShorts = published.filter(v => v.platform === 'YouTube Shorts').length;
  const pubYTVid = published.filter(v => v.platform === 'YouTube').length;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{t.analytics}</h2>

      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>{t.prodRate}</span>
            <TrendingUp size={16} color="var(--status-ready)" />
          </div>
          <span style={styles.cardValue}>
            {totalCount > 0 ? Math.round((published.length / totalCount) * 100) : 0}%
          </span>
          <span style={styles.cardSub}>{t.ofPlanned}</span>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>{t.pipeline}</span>
            <Film size={16} color="var(--accent-color)" />
          </div>
          <span style={styles.cardValue}>{totalCount}</span>
          <span style={styles.cardSub}>{t.pipeline}</span>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>{t.publishedCount}</span>
            <CheckCircle size={16} color="var(--status-ready)" />
          </div>
          <span style={styles.cardValue}>{published.length}</span>
          <span style={styles.cardSub}>{t.allTimePub}</span>
        </div>
      </div>

      <div style={styles.chartSection}>
        <h3 style={styles.sectionTitle}>{t.platformBreakdown}</h3>
        <div style={styles.breakdownList}>
          {/* Instagram Reels */}
          <div style={styles.breakdownRow}>
            <div style={styles.platformLabel}>
              <VideoIcon size={18} color="#e1306c" />
              <span style={styles.platformName}>Instagram Reels</span>
            </div>
            <div style={styles.barContainer}>
              <div style={styles.barLabel}>{pubReels} / {instaReelsCount} {translations[language].statusPublished}</div>
              <div style={styles.progressBg}>
                <div 
                  style={{ 
                    ...styles.progressFill, 
                    width: `${instaReelsCount > 0 ? (pubReels / instaReelsCount) * 100 : 0}%`,
                    backgroundColor: '#e1306c' 
                  }} 
                />
              </div>
            </div>
          </div>

          {/* YouTube Shorts */}
          <div style={styles.breakdownRow}>
            <div style={styles.platformLabel}>
              <Play size={18} color="#ff0000" />
              <span style={styles.platformName}>YouTube Shorts</span>
            </div>
            <div style={styles.barContainer}>
              <div style={styles.barLabel}>{pubShorts} / {youtubeShortsCount} {translations[language].statusPublished}</div>
              <div style={styles.progressBg}>
                <div 
                  style={{ 
                    ...styles.progressFill, 
                    width: `${youtubeShortsCount > 0 ? (pubShorts / youtubeShortsCount) * 100 : 0}%`,
                    backgroundColor: '#ff0000' 
                  }} 
                />
              </div>
            </div>
          </div>

          {/* YouTube Videos */}
          <div style={styles.breakdownRow}>
            <div style={styles.platformLabel}>
              <PlaySquare size={18} color="#ff0000" />
              <span style={styles.platformName}>YouTube Videos</span>
            </div>
            <div style={styles.barContainer}>
              <div style={styles.barLabel}>{pubYTVid} / {youtubeVideosCount} {translations[language].statusPublished}</div>
              <div style={styles.progressBg}>
                <div 
                  style={{ 
                    ...styles.progressFill, 
                    width: `${youtubeVideosCount > 0 ? (pubYTVid / youtubeVideosCount) * 100 : 0}%`,
                    backgroundColor: '#2563eb' 
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  cardLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    marginBottom: '4px',
  },
  cardSub: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  chartSection: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  breakdownList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  breakdownRow: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    alignItems: 'center',
    gap: '16px',
  },
  platformLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  platformName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  barLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  progressBg: {
    height: '8px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
};
