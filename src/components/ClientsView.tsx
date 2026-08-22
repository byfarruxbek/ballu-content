import React from 'react';
import type { Client, Video } from '../types';
import { Award, Layers, CheckCircle2, AlertTriangle, VideoOff, Edit, Trash2, UserPlus } from 'lucide-react';
import type { Language } from '../locale';
import { translations } from '../locale';

interface ClientsViewProps {
  clients: Client[];
  videos: Video[];
  onUpdateTargets: (clientId: string, reelsTarget: number, youtubeTarget: number) => void;
  onAddClient: (name: string, specialty: string, reelsTarget: number, youtubeTarget: number) => void;
  onDeleteClient: (clientId: string) => void;
  language: Language;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  videos,
  onUpdateTargets,
  onAddClient,
  onDeleteClient,
  language,
}) => {
  const t = translations[language];

  const [editingClientId, setEditingClientId] = React.useState<string | null>(null);
  const [editReels, setEditReels] = React.useState(0);
  const [editYoutube, setEditYoutube] = React.useState(0);

  // New Client Form State
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newSpecialty, setNewSpecialty] = React.useState('');
  const [newReels, setNewReels] = React.useState(0);
  const [newYoutube, setNewYoutube] = React.useState(0);

  const startEditing = (client: Client) => {
    setEditingClientId(client.id);
    setEditReels(client.reelsTarget);
    setEditYoutube(client.youtubeTarget);
  };

  const saveTargets = (clientId: string) => {
    onUpdateTargets(clientId, editReels, editYoutube);
    setEditingClientId(null);
  };

  const handleAddNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSpecialty) return;
    onAddClient(newName, newSpecialty, newReels, newYoutube);
    // Reset Form
    setNewName('');
    setNewSpecialty('');
    setNewReels(0);
    setNewYoutube(0);
    setShowAddForm(false);
  };

  const handleDelete = (clientId: string, clientName: string) => {
    if (window.confirm(t.confirmDelete.replace('{clientName}', clientName))) {
      onDeleteClient(clientId);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>{t.clientsTitle}</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          style={styles.addClientTrigger}
        >
          <UserPlus size={16} style={{ marginRight: 8 }} />
          <span>{showAddForm ? t.cancel : t.addClient}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddNewClient} style={styles.addClientForm}>
          <h3 style={styles.formTitle}>{t.addNewClientTitle}</h3>
          <div style={styles.formRow}>
            <div style={styles.formField}>
              <label style={styles.formLabel}>{t.tableClient} *</label>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                required 
                placeholder="e.g. Asadbek aka"
                style={styles.formInput}
              />
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>{language === 'uz' ? 'Mutaxassislik' : language === 'ru' ? 'Специализация' : 'Niche'} *</label>
              <input 
                type="text" 
                value={newSpecialty} 
                onChange={(e) => setNewSpecialty(e.target.value)} 
                required 
                placeholder="e.g. Pediatr, Stomatolog"
                style={styles.formInput}
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formField}>
              <label style={styles.formLabel}>{t.reelsTarget}</label>
              <input 
                type="number" 
                value={newReels} 
                onChange={(e) => setNewReels(Math.max(0, parseInt(e.target.value, 10) || 0))}
                style={styles.formInput}
              />
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>{t.ytTarget}</label>
              <input 
                type="number" 
                value={newYoutube} 
                onChange={(e) => setNewYoutube(Math.max(0, parseInt(e.target.value, 10) || 0))}
                style={styles.formInput}
              />
            </div>
          </div>
          <button type="submit" style={styles.submitBtn}>{t.registerClient}</button>
        </form>
      )}

      <div style={styles.grid}>
        {clients.map((client) => {
          // Get videos belonging to client
          const clientVideos = videos.filter(v => v.clientId === client.id);
          
          // Targets
          const reelsTarget = client.reelsTarget;
          const youtubeTarget = client.youtubeTarget;
          const totalTarget = reelsTarget + youtubeTarget;

          // Aggregates
          const published = clientVideos.filter(v => v.status === 'Published').length;
          const inEditing = clientVideos.filter(v => v.status === 'In Editing').length;
          const ready = clientVideos.filter(v => v.status === 'Ready').length;
          const cancelled = clientVideos.filter(v => v.status === 'Cancelled').length;
          const totalPlanned = clientVideos.filter(v => v.status !== 'Cancelled').length;

          // Target vs Planned calculations
          const completionPercentage = totalTarget > 0 
            ? Math.min(Math.round((published / totalTarget) * 100), 100) 
            : 0;

          const isEditingThis = editingClientId === client.id;

          return (
            <div key={client.id} style={styles.clientCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.clientName}>{client.name}</h3>
                  <span style={styles.specialtyChip}>{client.specialty}</span>
                </div>
                <div style={styles.actionButtons}>
                  {!isEditingThis && (
                    <>
                      <button 
                        onClick={() => startEditing(client)} 
                        style={styles.editBtn} 
                        title={t.setTarget}
                      >
                        <Edit size={13} />
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id, client.name)} 
                        style={styles.deleteBtn} 
                        title={t.delete}
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditingThis ? (
                <div style={styles.editForm}>
                  <div style={styles.editRow}>
                    <div style={styles.editField}>
                      <label style={styles.editLabel}>{t.reelsTarget}</label>
                      <input 
                        type="number" 
                        value={editReels} 
                        onChange={(e) => setEditReels(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        style={styles.editInput}
                      />
                    </div>
                    <div style={styles.editField}>
                      <label style={styles.editLabel}>{t.ytTarget}</label>
                      <input 
                        type="number" 
                        value={editYoutube} 
                        onChange={(e) => setEditYoutube(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        style={styles.editInput}
                      />
                    </div>
                  </div>
                  <div style={styles.editActions}>
                    <button onClick={() => setEditingClientId(null)} style={styles.cancelBtn}>{t.cancel}</button>
                    <button onClick={() => saveTargets(client.id)} style={styles.saveBtn}>{t.saveBtn}</button>
                  </div>
                </div>
              ) : (
                <div style={styles.targetsRow}>
                  {reelsTarget > 0 && (
                    <div style={styles.targetCol}>
                      <span style={styles.targetLabel}>{t.reelsTarget}</span>
                      <span style={styles.targetVal}>{reelsTarget} / mo</span>
                    </div>
                  )}
                  {youtubeTarget > 0 && (
                    <div style={styles.targetCol}>
                      <span style={styles.targetLabel}>{t.ytTarget}</span>
                      <span style={styles.targetVal}>{youtubeTarget} / mo</span>
                    </div>
                  )}
                  {reelsTarget === 0 && youtubeTarget === 0 && (
                    <div style={styles.targetCol}>
                      <span style={styles.targetLabel}>{t.reelsTarget}</span>
                      <span style={{ ...styles.targetVal, color: 'var(--text-muted)' }}>{t.noTargets}</span>
                    </div>
                  )}
                </div>
              )}

              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <span style={styles.progressLabel}>{t.targetCompletion}</span>
                  <span style={styles.progressVal}>{completionPercentage}%</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div 
                    style={{ 
                      ...styles.progressBarFill, 
                      width: `${completionPercentage}%`,
                      backgroundColor: completionPercentage === 100 ? 'var(--status-ready)' : 'var(--accent-color)'
                    }} 
                  />
                </div>
              </div>

              <div style={styles.metricsGrid}>
                <div style={styles.metricItem}>
                  <Layers size={14} color="var(--text-muted)" />
                  <div style={styles.metricText}>
                    <span style={styles.metricVal}>{totalPlanned}</span>
                    <span style={styles.metricLabel}>{t.planned}</span>
                  </div>
                </div>

                <div style={styles.metricItem}>
                  <CheckCircle2 size={14} color="var(--status-published)" />
                  <div style={styles.metricText}>
                    <span style={styles.metricVal}>{published}</span>
                    <span style={styles.metricLabel}>{translations[language].statusPublished}</span>
                  </div>
                </div>

                <div style={styles.metricItem}>
                  <Award size={14} color="var(--status-ready)" />
                  <div style={styles.metricText}>
                    <span style={styles.metricVal}>{ready}</span>
                    <span style={styles.metricLabel}>{translations[language].statusReady}</span>
                  </div>
                </div>

                <div style={styles.metricItem}>
                  <AlertTriangle size={14} color="var(--status-editing)" />
                  <div style={styles.metricText}>
                    <span style={styles.metricVal}>{inEditing}</span>
                    <span style={styles.metricLabel}>{translations[language].statusEditing}</span>
                  </div>
                </div>

                <div style={styles.metricItem}>
                  <VideoOff size={14} color="var(--status-cancelled)" />
                  <div style={styles.metricText}>
                    <span style={styles.metricVal}>{cancelled}</span>
                    <span style={styles.metricLabel}>{translations[language].statusCancelled}</span>
                  </div>
                </div>
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
  headerRow: {
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
  addClientTrigger: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: 'var(--accent-color)',
    color: '#ffffff',
    border: 'none',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.15s ease',
  },
  addClientForm: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
    boxShadow: 'var(--shadow-md)',
  },
  formTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
    gap: '6px',
  },
  formLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  formInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    outline: 'none',
  },
  submitBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginTop: '6px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  clientCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    position: 'relative' as const,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientName: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    marginBottom: '4px',
  },
  specialtyChip: {
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
  },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  deleteBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    color: '#ef4444',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  targetsRow: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
    minHeight: '48px',
    alignItems: 'center',
  },
  targetCol: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  targetLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  targetVal: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: 600,
  },
  progressLabel: {
    color: 'var(--text-secondary)',
  },
  progressVal: {
    color: 'var(--text-primary)',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginTop: '8px',
  },
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--bg-primary)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  metricText: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  metricVal: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  metricLabel: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    padding: '10px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  editRow: {
    display: 'flex',
    gap: '10px',
  },
  editField: {
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
    gap: '4px',
  },
  editLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  editInput: {
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '12px',
    outline: 'none',
  },
  editActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '4px',
  },
  cancelBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
