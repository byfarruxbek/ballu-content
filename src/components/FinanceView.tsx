import React from 'react';
import type { Video, Client } from '../types';
import type { Language } from '../locale';
import { supabase, hasSupabaseConfig } from '../supabaseClient';

interface FinanceViewProps {
  videos: Video[];
  clients: Client[];
  language: Language;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  videos,
  clients,
  language
}) => {
  // Helper variables for editing inline pricing targets
  const [editingClientId, setEditingClientId] = React.useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = React.useState<string | null>(null);
  
  const [clientPriceVal, setClientPriceVal] = React.useState<number>(0);
  const [videoPriceVal, setVideoPriceVal] = React.useState<number>(0);
  
  // Local states to handle live visual reactivity before page reload
  const [localClients, setLocalClients] = React.useState<Client[]>(clients);
  const [localVideos, setLocalVideos] = React.useState<Video[]>(videos);

  React.useEffect(() => {
    setLocalClients(clients);
  }, [clients]);

  React.useEffect(() => {
    setLocalVideos(videos);
  }, [videos]);

  const handleUpdateClientPrice = async (clientId: string) => {
    setLocalClients(prev => prev.map(c => c.id === clientId ? { ...c, monthlyContractPrice: clientPriceVal } : c));
    if (hasSupabaseConfig()) {
      await supabase.from('clients').update({ monthlyContractPrice: clientPriceVal }).eq('id', clientId);
    }
    setEditingClientId(null);
  };

  const handleUpdateVideoPrice = async (videoId: string) => {
    setLocalVideos(prev => prev.map(v => v.id === videoId ? { ...v, price: videoPriceVal } : v));
    if (hasSupabaseConfig()) {
      await supabase.from('videos').update({ price: videoPriceVal }).eq('id', videoId);
    }
    setEditingVideoId(null);
  };

  const handleTogglePayment = async (videoId: string, currentPaidState: boolean) => {
    const updatedState = !currentPaidState;
    setLocalVideos(prev => prev.map(v => v.id === videoId ? { ...v, isPaid: updatedState } : v));
    if (hasSupabaseConfig()) {
      await supabase.from('videos').update({ isPaid: updatedState }).eq('id', videoId);
    }
  };

  // Financial statistics calculations
  const totalContractRevenue = localClients.reduce((acc, c) => acc + (c.monthlyContractPrice || 0), 0);
  
  const totalEarnedFromVideos = localVideos
    .filter(v => v.status === 'Published')
    .reduce((acc, v) => acc + (v.price || 0), 0);
    
  const totalPaidRevenue = localVideos
    .filter(v => v.isPaid)
    .reduce((acc, v) => acc + (v.price || 0), 0);
    
  const totalUnpaidRevenue = localVideos
    .filter(v => !v.isPaid && (v.price || 0) > 0)
    .reduce((acc, v) => acc + (v.price || 0), 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {language === 'uz' ? 'Moliyaviy hisobot va tahlillar' : language === 'ru' ? 'Финансовая отчетность' : 'Financial Statement'}
      </h2>

      {/* Summary Cards Grid */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.card, borderTop: '4px solid #10b981' }}>
          <span style={styles.cardLabel}>{language === 'uz' ? 'Jami kelishilgan oylik (Shartnoma)' : language === 'ru' ? 'Общий контрактный доход' : 'Total Monthly Contracts'}</span>
          <span style={{ ...styles.cardValue, color: '#10b981' }}>{totalContractRevenue.toLocaleString()} UZS</span>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #3b82f6' }}>
          <span style={styles.cardLabel}>{language === 'uz' ? 'Tayyor videolar qiymati' : language === 'ru' ? 'Стоимость готового контента' : 'Published Videos Value'}</span>
          <span style={{ ...styles.cardValue, color: '#3b82f6' }}>{totalEarnedFromVideos.toLocaleString()} UZS</span>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #f59e0b' }}>
          <span style={styles.cardLabel}>{language === 'uz' ? 'To\'langan daromad' : language === 'ru' ? 'Получено оплат' : 'Received Payments'}</span>
          <span style={{ ...styles.cardValue, color: '#f59e0b' }}>{totalPaidRevenue.toLocaleString()} UZS</span>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #ef4444' }}>
          <span style={styles.cardLabel}>{language === 'uz' ? 'Kutilayotgan qoldiq' : language === 'ru' ? 'Ожидается к оплате' : 'Unpaid Balance'}</span>
          <span style={{ ...styles.cardValue, color: '#ef4444' }}>{totalUnpaidRevenue.toLocaleString()} UZS</span>
        </div>
      </div>

      {/* Two columns layout: Client pricing settings vs Video ledger list */}
      <div style={styles.detailsSplit}>
        {/* Clients list ledger */}
        <div style={styles.ledgerSection}>
          <h3 style={styles.sectionHeading}>
            {language === 'uz' ? 'Mijozlar bilan shartnomalar' : language === 'ru' ? 'Контракты с клиентами' : 'Client Monthly Budgets'}
          </h3>
          <div style={styles.listContainer}>
            {localClients.map(c => (
              <div key={c.id} style={styles.ledgerItem}>
                <div>
                  <div style={styles.clientNameText}>{c.name}</div>
                  <div style={styles.clientNiche}>{c.specialty}</div>
                </div>
                <div>
                  {editingClientId === c.id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        value={clientPriceVal} 
                        onChange={(e) => setClientPriceVal(parseInt(e.target.value, 10) || 0)}
                        style={styles.priceInput}
                      />
                      <button onClick={() => handleUpdateClientPrice(c.id)} style={styles.saveSmallBtn}>✓</button>
                      <button onClick={() => setEditingClientId(null)} style={styles.cancelSmallBtn}>×</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={styles.priceLabel}>{(c.monthlyContractPrice || 0).toLocaleString()} UZS</span>
                      <button onClick={() => {
                        setEditingClientId(c.id);
                        setClientPriceVal(c.monthlyContractPrice || 0);
                      }} style={styles.editBtn}>✏️</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video payment trackers */}
        <div style={styles.ledgerSection}>
          <h3 style={styles.sectionHeading}>
            {language === 'uz' ? 'Videolar bo\'yicha to\'lovlar' : language === 'ru' ? 'Оплаты за видео' : 'Video Billing Ledger'}
          </h3>
          <div style={styles.listContainer}>
            {localVideos.filter(v => v.status !== 'Cancelled').map(v => (
              <div key={v.id} style={styles.ledgerItem}>
                <div style={{ flexGrow: 1, maxWidth: '60%' }}>
                  <div style={styles.clientNameText}>{v.title}</div>
                  <div style={styles.clientNiche}>{v.clientName} | {v.platform}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {editingVideoId === v.id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        value={videoPriceVal} 
                        onChange={(e) => setVideoPriceVal(parseInt(e.target.value, 10) || 0)}
                        style={styles.priceInput}
                      />
                      <button onClick={() => handleUpdateVideoPrice(v.id)} style={styles.saveSmallBtn}>✓</button>
                      <button onClick={() => setEditingVideoId(null)} style={styles.cancelSmallBtn}>×</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={styles.priceLabel}>{(v.price || 0).toLocaleString()} UZS</span>
                      <button onClick={() => {
                        setEditingVideoId(v.id);
                        setVideoPriceVal(v.price || 0);
                      }} style={styles.editBtn}>✏️</button>
                    </div>
                  )}
                  
                  {/* Payment toggle check box */}
                  <button 
                    onClick={() => handleTogglePayment(v.id, v.isPaid || false)}
                    style={{
                      ...styles.paymentBadge,
                      backgroundColor: v.isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.08)',
                      color: v.isPaid ? '#10b981' : '#ef4444',
                      border: `1px solid ${v.isPaid ? '#10b98133' : '#ef444433'}`
                    }}
                  >
                    {v.isPaid 
                      ? (language === 'uz' ? 'To\'landi' : language === 'ru' ? 'Оплачено' : 'Paid') 
                      : (language === 'uz' ? 'Kutilmoqda' : language === 'ru' ? 'Ожидание' : 'Unpaid')}
                  </button>
                </div>
              </div>
            ))}
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
    gap: '28px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    boxShadow: 'var(--shadow-sm)',
  },
  cardLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  cardValue: {
    fontSize: '18px',
    fontWeight: 700,
  },
  detailsSplit: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '28px',
    marginTop: '12px',
  },
  ledgerSection: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-md)',
  },
  sectionHeading: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '16px',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    maxHeight: '450px',
    overflowY: 'auto' as const,
    paddingRight: '4px',
  },
  ledgerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
  },
  clientNameText: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  clientNiche: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
    marginTop: '2px',
  },
  priceLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  editBtn: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '4px',
    opacity: 0.8,
  },
  priceInput: {
    width: '90px',
    padding: '4px 6px',
    fontSize: '12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  saveSmallBtn: {
    border: 'none',
    backgroundColor: '#10b981',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '2px 8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  cancelSmallBtn: {
    border: 'none',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '2px 8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  paymentBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.15s ease',
  },
};
