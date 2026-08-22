import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { WeeklyPlannerView } from './components/WeeklyPlannerView';
import { CalendarView } from './components/CalendarView';
import { VideosView } from './components/VideosView';
import { ClientsView } from './components/ClientsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { Modal } from './components/Modal';
import type { Client, Video, VideoStatus } from './types';
import { INITIAL_CLIENTS, getInitialVideos } from './data';
import type { Language } from './locale';
import { translations } from './locale';
import { supabase, hasSupabaseConfig } from './supabaseClient';

function App() {
  const [currentTab, setCurrentTab] = React.useState('dashboard');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [language, setLanguage] = React.useState<Language>(() => {
    const saved = localStorage.getItem('ballu_language');
    return (saved as Language) || 'uz';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  
  // App state
  const [clients, setClients] = React.useState<Client[]>([]);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [safetyBuffer, setSafetyBuffer] = React.useState<number>(1);
  const [loading, setLoading] = React.useState(true);

  // Load configuration and data (Supabase vs LocalStorage)
  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (hasSupabaseConfig()) {
        try {
          // Fetch clients
          const { data: dbClients, error: cErr } = await supabase.from('clients').select('*');
          if (cErr) throw cErr;
          
          // Fetch videos
          const { data: dbVideos, error: vErr } = await supabase.from('videos').select('*');
          if (vErr) throw vErr;

          // Fetch buffer metadata config if exists
          const { data: dbMeta } = await supabase.from('settings').select('*').single();
          
          if (dbClients && dbClients.length > 0) {
            setClients(dbClients);
          } else {
            // Seed default clients to Supabase if empty
            await supabase.from('clients').insert(INITIAL_CLIENTS);
            setClients(INITIAL_CLIENTS);
          }

          if (dbVideos) {
            setVideos(dbVideos);
          } else {
            const initialVids = getInitialVideos();
            await supabase.from('videos').insert(initialVids);
            setVideos(initialVids);
          }

          if (dbMeta) {
            setSafetyBuffer(dbMeta.safety_buffer || 1);
          }
        } catch (err) {
          console.error("Supabase load failed, falling back to localStorage", err);
          fallbackToLocal();
        }
      } else {
        fallbackToLocal();
      }
      setLoading(false);
    }

    function fallbackToLocal() {
      const savedClients = localStorage.getItem('videoflow_clients');
      setClients(savedClients ? JSON.parse(savedClients) : INITIAL_CLIENTS);

      const savedVideos = localStorage.getItem('videoflow_videos');
      setVideos(savedVideos ? JSON.parse(savedVideos) : getInitialVideos());

      const savedBuffer = localStorage.getItem('videoflow_buffer');
      setSafetyBuffer(savedBuffer ? parseInt(savedBuffer, 10) : 1);
    }

    loadData();
  }, []);

  // Sync state to local storage (for fallback)
  React.useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('videoflow_clients', JSON.stringify(clients));
    }
  }, [clients]);

  React.useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('videoflow_videos', JSON.stringify(videos));
    }
  }, [videos]);

  React.useEffect(() => {
    localStorage.setItem('videoflow_buffer', safetyBuffer.toString());
  }, [safetyBuffer]);

  React.useEffect(() => {
    localStorage.setItem('ballu_language', language);
  }, [language]);

  // Sync theme
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Modal control
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);

  const handleOpenAddModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleOpenQuickAddWithDate = (dateStr: string) => {
    setSelectedVideo(null);
    setIsModalOpen(true);
    const tempVideo: Partial<Video> = {
      publishDate: dateStr,
      deliveryDeadline: (() => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() - safetyBuffer);
        return d.toISOString().split('T')[0];
      })(),
      safetyBufferDays: safetyBuffer,
    };
    setSelectedVideo(tempVideo as Video);
  };

  const handleSaveVideo = async (videoData: Partial<Video>) => {
    if (videoData.id) {
      // Edit
      setVideos(prev => prev.map(v => v.id === videoData.id ? { ...v, ...videoData } as Video : v));
      if (hasSupabaseConfig()) {
        await supabase.from('videos').update(videoData).eq('id', videoData.id);
      }
    } else {
      // New
      const newVideo: Video = {
        ...videoData,
        id: `v-${Date.now()}`,
        safetyBufferDays: safetyBuffer,
      } as Video;
      setVideos(prev => [newVideo, ...prev]);
      if (hasSupabaseConfig()) {
        await supabase.from('videos').insert([newVideo]);
      }
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = async (id: string, newStatus: VideoStatus) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    if (hasSupabaseConfig()) {
      await supabase.from('videos').update({ status: newStatus }).eq('id', id);
    }
  };

  const handleUpdateVideoDates = async (id: string, newDelivery: string, newPublish: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, deliveryDeadline: newDelivery, publishDate: newPublish } : v));
    if (hasSupabaseConfig()) {
      await supabase.from('videos').update({ deliveryDeadline: newDelivery, publishDate: newPublish }).eq('id', id);
    }
  };

  const handleUpdateClientTargets = async (clientId: string, reelsTarget: number, youtubeTarget: number) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, reelsTarget, youtubeTarget } : c));
    if (hasSupabaseConfig()) {
      await supabase.from('clients').update({ reelsTarget, youtubeTarget }).eq('id', clientId);
    }
  };

  const handleAddClient = async (name: string, specialty: string, reelsTarget: number, youtubeTarget: number) => {
    const newClient: Client = {
      id: `c-${Date.now()}`,
      name,
      specialty,
      reelsTarget,
      youtubeTarget,
    };
    setClients(prev => [...prev, newClient]);
    if (hasSupabaseConfig()) {
      await supabase.from('clients').insert([newClient]);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    setVideos(prev => prev.filter(v => v.clientId !== clientId));
    if (hasSupabaseConfig()) {
      await supabase.from('clients').delete().eq('id', clientId);
      await supabase.from('videos').delete().eq('clientId', clientId);
    }
  };

  const handleUpdateSafetyBuffer = async (val: number) => {
    setSafetyBuffer(val);
    if (hasSupabaseConfig()) {
      await supabase.from('settings').upsert({ id: 1, safety_buffer: val });
    }
  };

  const t = translations[language];

  // Render view router
  const renderTabContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Yuklanmoqda / Loading...
        </div>
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView 
            videos={videos} 
            onOpenCard={handleOpenEditModal} 
            onStatusChange={handleStatusChange} 
            language={language}
          />
        );
      case 'weekly':
        return (
          <WeeklyPlannerView 
            videos={videos} 
            onOpenCard={handleOpenEditModal} 
            onUpdateVideoDates={handleUpdateVideoDates} 
            language={language}
          />
        );
      case 'calendar':
        return (
          <CalendarView 
            videos={videos} 
            onOpenCard={handleOpenEditModal} 
            onOpenQuickAddWithDate={handleOpenQuickAddWithDate} 
            language={language}
          />
        );
      case 'videos':
        return (
          <VideosView 
            videos={videos} 
            clients={clients} 
            onOpenCard={handleOpenEditModal} 
            language={language}
          />
        );
      case 'clients':
        return (
          <ClientsView 
            clients={clients} 
            videos={videos} 
            onUpdateTargets={handleUpdateClientTargets}
            onAddClient={handleAddClient}
            onDeleteClient={handleDeleteClient}
            language={language}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            videos={videos} 
            language={language}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            clients={clients} 
            safetyBuffer={safetyBuffer} 
            onUpdateSafetyBuffer={handleUpdateSafetyBuffer} 
            language={language}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard': return t.dashboard;
      case 'weekly': return t.weeklyPlanner;
      case 'calendar': return t.calendar;
      case 'videos': return t.videos;
      case 'clients': return t.clients;
      case 'analytics': return t.analytics;
      case 'settings': return t.settings;
      default: return currentTab;
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', width: '100%' }}>
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        language={language}
        setLanguage={setLanguage}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      <main style={{ flexGrow: 1, padding: '40px', overflowY: 'auto', height: '100vh' }}>
        <Header 
          title={getPageTitle()} 
          onOpenAddModal={handleOpenAddModal} 
          language={language}
        />
        
        {renderTabContent()}
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        video={selectedVideo} 
        clients={clients} 
        onSave={handleSaveVideo} 
        language={language}
      />
    </div>
  );
}

export default App;
