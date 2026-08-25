import React from 'react';
import type { Video, Client } from '../types';
import type { Language } from '../locale';
import { translations } from '../locale';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null; // null means we are adding a new video
  clients: Client[];
  onSave: (video: Partial<Video>) => void;
  onDelete?: (id: string) => void;
  language: Language;
  userRole: 'editor' | 'viewer';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  video,
  clients,
  onSave,
  onDelete,
  language,
  userRole,
}) => {
  if (!isOpen) return null;
  const t = translations[language];
  const isViewer = userRole === 'viewer';

  const [formData, setFormData] = React.useState<Partial<Video>>({
    clientId: '',
    title: '',
    platform: 'Instagram Reels',
    rawMaterialLink: '',
    deliveryDeadline: '',
    publishDate: '',
    finalVideoLink: '',
    publishedPostLink: '',
    notes: '',
    priority: 'Medium',
    status: 'Material Not Received',
    safetyBufferDays: 1,
  });

  React.useEffect(() => {
    if (video) {
      setFormData(video);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().split('T')[0];

      setFormData({
        clientId: clients[0]?.id || '',
        title: '',
        platform: 'Instagram Reels',
        rawMaterialLink: '',
        deliveryDeadline: today,
        publishDate: tomorrow,
        finalVideoLink: '',
        publishedPostLink: '',
        notes: '',
        priority: 'Medium',
        status: 'Material Not Received',
        safetyBufferDays: 1,
      });
    }
  }, [video, clients, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (isViewer) return;
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'publishDate') {
        const pubDate = new Date(value);
        if (!isNaN(pubDate.getTime())) {
          const buffer = prev.safetyBufferDays ?? 1;
          const deadline = new Date(pubDate);
          deadline.setDate(pubDate.getDate() - buffer);
          updated.deliveryDeadline = deadline.toISOString().split('T')[0];
        }
      }

      return updated;
    });
  };

  const handleBufferChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isViewer) return;
    const buffer = parseInt(e.target.value, 10);
    setFormData((prev) => {
      const updated = { ...prev, safetyBufferDays: buffer };
      if (prev.publishDate) {
        const pubDate = new Date(prev.publishDate);
        if (!isNaN(pubDate.getTime())) {
          const deadline = new Date(pubDate);
          deadline.setDate(pubDate.getDate() - buffer);
          updated.deliveryDeadline = deadline.toISOString().split('T')[0];
        }
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;
    const client = clients.find(c => c.id === formData.clientId);
    const updatedData = {
      ...formData,
      clientName: client ? client.name : 'Unknown Client',
    };
    onSave(updatedData);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>{isViewer ? (language === 'uz' ? 'Video ma\'lumotlari' : language === 'ru' ? 'Информация о видео' : 'Video Information') : (video ? t.editDetails : t.addDetails)}</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>{t.clientLabel}</label>
              <select 
                name="clientId" 
                value={formData.clientId} 
                onChange={handleChange} 
                required 
                disabled={isViewer}
                style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.specialty})</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>{t.platformLabel}</label>
              <select 
                name="platform" 
                value={formData.platform} 
                onChange={handleChange} 
                required 
                disabled={isViewer}
                style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }}
              >
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="YouTube">YouTube</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t.videoTitleLabel}</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              disabled={isViewer}
              placeholder="e.g. Stressni yengish yo'llari"
              style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }} 
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>{t.safetyBuffer}</label>
              <select 
                value={formData.safetyBufferDays ?? 1} 
                onChange={handleBufferChange} 
                disabled={isViewer}
                style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }}
              >
                <option value={0}>{t.sameDay}</option>
                <option value={1}>{t.oneDay}</option>
                <option value={2}>{t.twoDays}</option>
                <option value={3}>{t.threeDays}</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>{t.publishDateLabel}</label>
              <input 
                type="date" 
                name="publishDate" 
                value={formData.publishDate} 
                onChange={handleChange} 
                required 
                disabled={isViewer}
                style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }} 
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>{t.deliveryDeadlineLabel}</label>
              <input 
                type="date" 
                name="deliveryDeadline" 
                value={formData.deliveryDeadline} 
                onChange={handleChange} 
                required 
                disabled={isViewer}
                style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }} 
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>{t.tablePriority}</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                disabled={isViewer}
                style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>{t.tableStatus}</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                disabled={isViewer}
                style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }}
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
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t.rawLabel}</label>
            <input 
              type="url" 
              name="rawMaterialLink" 
              value={formData.rawMaterialLink} 
              onChange={handleChange} 
              disabled={isViewer}
              placeholder="https://..."
              style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }} 
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>{t.finalLabel}</label>
              <input 
                type="url" 
                name="finalVideoLink" 
                value={formData.finalVideoLink} 
                onChange={handleChange} 
                disabled={isViewer}
                placeholder="https://..."
                style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }} 
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>{t.publishedLabel}</label>
              <input 
                type="url" 
                name="publishedPostLink" 
                value={formData.publishedPostLink} 
                onChange={handleChange} 
                disabled={isViewer}
                placeholder="https://..."
                style={{ ...styles.input, opacity: isViewer ? 0.7 : 1 }} 
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t.notesLabel}</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              rows={3} 
              disabled={isViewer}
              placeholder="Tuzatishlar, topshiriqlar..."
              style={{ ...styles.textarea, opacity: isViewer ? 0.7 : 1 }} 
            />
          </div>

          <div style={styles.footerBtns}>
            {video && video.id && !isViewer && onDelete && (
              <button 
                type="button" 
                onClick={() => {
                  const confirmMsg = language === 'uz' 
                    ? 'Ushbu videoni o\'chirmoqchimisiz?' 
                    : language === 'ru' 
                      ? 'Вы уверены, что хотите удалить это видео?' 
                      : 'Are you sure you want to delete this video?';
                  if (window.confirm(confirmMsg)) {
                    onDelete(video.id);
                  }
                }}
                style={styles.deleteBtn}
              >
                {language === 'uz' ? 'O\'chirish' : language === 'ru' ? 'Удалить' : 'Delete'}
              </button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} style={styles.cancelBtn}>{isViewer ? (language === 'uz' ? 'Yopish' : language === 'ru' ? 'Закрыть' : 'Close') : t.cancel}</button>
              {!isViewer && <button type="submit" style={styles.saveBtn}>{t.save}</button>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '650px',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid var(--border-color)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  closeBtn: {
    border: 'none',
    background: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    transition: 'all 0.2s ease',
  },
  footerBtns: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
  },
  saveBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
  },
  deleteBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    color: '#ef4444',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'all 0.15s ease',
  },
};
