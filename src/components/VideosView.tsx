import React from 'react';
import type { Video, Client } from '../types';
import { VideoCard, getLocalizedStatus } from './VideoCard';
import { Search, LayoutGrid, List } from 'lucide-react';
import type { Language } from '../locale';
import { translations } from '../locale';

interface VideosViewProps {
  videos: Video[];
  clients: Client[];
  onOpenCard: (video: Video) => void;
  language: Language;
}

export const VideosView: React.FC<VideosViewProps> = ({
  videos,
  clients,
  onOpenCard,
  language,
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterClient, setFilterClient] = React.useState('All');
  const [filterPlatform, setFilterPlatform] = React.useState('All');
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [filterPriority, setFilterPriority] = React.useState('All');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // Filter Logic
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.notes && video.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClient = filterClient === 'All' || video.clientId === filterClient;
    const matchesPlatform = filterPlatform === 'All' || video.platform === filterPlatform;
    const matchesPriority = filterPriority === 'All' || video.priority === filterPriority;
    
    let matchesStatus = true;
    if (filterStatus === 'Cancelled') {
      matchesStatus = video.status === 'Cancelled';
    } else if (filterStatus === 'Published') {
      matchesStatus = video.status === 'Published';
    } else if (filterStatus === 'Active') {
      matchesStatus = video.status !== 'Cancelled' && video.status !== 'Published';
    } else if (filterStatus !== 'All') {
      matchesStatus = video.status === filterStatus;
    } else {
      matchesStatus = video.status !== 'Cancelled';
    }

    return matchesSearch && matchesClient && matchesPlatform && matchesPriority && matchesStatus;
  });

  const openLink = (url: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div style={styles.container}>
      {/* Search & Filter bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <Search size={16} color="var(--text-muted)" style={{ marginLeft: 12 }} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.selectorsRow}>
          <div style={styles.selectorGroup}>
            <span style={styles.selectorLabel}>{t.clients}</span>
            <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} style={styles.select}>
              <option value="All">{t.filterClient}</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={styles.selectorGroup}>
            <span style={styles.selectorLabel}>{t.tablePlatform}</span>
            <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} style={styles.select}>
              <option value="All">{t.filterPlatform}</option>
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

          <div style={styles.selectorGroup}>
            <span style={styles.selectorLabel}>{t.tableStatus}</span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.select}>
              <option value="All">{t.filterStatus}</option>
              <option value="Material Not Received">{t.statusNotReceived}</option>
              <option value="Material Received">{t.statusReceived}</option>
              <option value="In Editing">{t.statusEditing}</option>
              <option value="Revision">{t.statusRevision}</option>
              <option value="Ready">{t.statusReady}</option>
              <option value="Scheduled">{t.statusScheduled}</option>
              <option value="Published">{t.statusPublished}</option>
              <option value="Cancelled">{t.statusCancelled}</option>
            </select>
          </div>

          <div style={styles.selectorGroup}>
            <span style={styles.selectorLabel}>{t.tablePriority}</span>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={styles.select}>
              <option value="All">{t.filterPriority}</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div style={styles.viewModeToggle}>
            <button 
              onClick={() => setViewMode('grid')} 
              style={{ ...styles.modeBtn, backgroundColor: viewMode === 'grid' ? 'var(--bg-tertiary)' : 'transparent' }}
            >
              <LayoutGrid size={15} />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              style={{ ...styles.modeBtn, backgroundColor: viewMode === 'list' ? 'var(--bg-tertiary)' : 'transparent' }}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List View renders */}
      {filteredVideos.length === 0 ? (
        <div style={styles.emptyState}>
          <p>{t.noVideos}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={styles.videosGrid}>
          {filteredVideos.map(video => (
            <VideoCard key={video.id} video={video} onClick={() => onOpenCard(video)} language={language} />
          ))}
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHead}>
                <th style={styles.th}>{t.tableClient}</th>
                <th style={styles.th}>{t.tableTitle}</th>
                <th style={styles.th}>{t.tablePlatform}</th>
                <th style={styles.th}>{t.tableDeadline}</th>
                <th style={styles.th}>{t.tablePublish}</th>
                <th style={styles.th}>{t.tableStatus}</th>
                <th style={styles.th}>{t.tablePriority}</th>
                <th style={styles.th}>{t.tableActions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map(video => (
                <tr key={video.id} style={styles.trBody} onClick={() => onOpenCard(video)}>
                  <td style={styles.td}>{video.clientName}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{video.title}</td>
                  <td style={styles.td}>{video.platform}</td>
                  <td style={styles.td}>{video.deliveryDeadline}</td>
                  <td style={styles.td}>{video.publishDate}</td>
                  <td style={styles.td}>
                    <span style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      border: `1px solid var(--border-color)`,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>{getLocalizedStatus(video.status, language)}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>{video.priority}</span>
                  </td>
                  <td style={styles.td} onClick={e => e.stopPropagation()}>
                    <div style={styles.linkButtons}>
                      {video.rawMaterialLink && (
                        <button onClick={() => openLink(video.rawMaterialLink)} style={styles.linkBtn}>Raw</button>
                      )}
                      {video.finalVideoLink && (
                        <button onClick={() => openLink(video.finalVideoLink)} style={styles.linkBtn}>Final</button>
                      )}
                      {video.publishedPostLink && (
                        <button onClick={() => openLink(video.publishedPostLink)} style={styles.linkBtn}>Post</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  filterBar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
  },
  searchInput: {
    flexGrow: 1,
    padding: '10px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  },
  selectorsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    alignItems: 'center',
  },
  selectorGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  selectorLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  select: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: 500,
    outline: 'none',
  },
  viewModeToggle: {
    display: 'flex',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginLeft: 'auto',
  },
  modeBtn: {
    padding: '6px 10px',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  tableWrapper: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflowX: 'auto' as const,
    boxShadow: 'var(--shadow-sm)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    textAlign: 'left' as const,
  },
  trHead: {
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
  },
  th: {
    padding: '14px 16px',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
  },
  trBody: {
    borderBottom: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease',
    ':hover': {
      backgroundColor: 'var(--bg-primary)',
    },
  },
  td: {
    padding: '14px 16px',
    fontSize: '13px',
    color: 'var(--text-primary)',
  },
  linkButtons: {
    display: 'flex',
    gap: '6px',
  },
  linkBtn: {
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: 'var(--accent-light)',
    color: 'var(--accent-color)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  emptyState: {
    padding: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px dashed var(--border-color)',
    textAlign: 'center' as const,
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
};
