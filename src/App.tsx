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

function App() {
  const [currentTab, setCurrentTab] = React.useState('dashboard');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [language, setLanguage] = React.useState<Language>(() => {
    const saved = localStorage.getItem('ballu_language');
    return (saved as Language) || 'uz';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  
  // App state
  const [clients, setClients] = React.useState<Client[]>(() => {
    const saved = localStorage.getItem('videoflow_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [videos, setVideos] = React.useState<Video[]>(() => {
    const saved = localStorage.getItem('videoflow_videos');
    return saved ? JSON.parse(saved) : getInitialVideos();
  });

  const [safetyBuffer, setSafetyBuffer] = React.useState<number>(() => {
    const saved = localStorage.getItem('videoflow_buffer');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Modal control
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);

  // Sync state to local storage
  React.useEffect(() => {
    localStorage.setItem('videoflow_clients', JSON.stringify(clients));
  }, [clients]);

  React.useEffect(() => {
    localStorage.setItem('videoflow_videos', JSON.stringify(videos));
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

  const handleSaveVideo = (videoData: Partial<Video>) => {
    if (videoData.id) {
      setVideos(prev => prev.map(v => v.id === videoData.id ? { ...v, ...videoData } as Video : v));
    } else {
      const newVideo: Video = {
        ...videoData,
        id: `v-${Date.now()}`,
        safetyBufferDays: safetyBuffer,
      } as Video;
      setVideos(prev => [newVideo, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: VideoStatus) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  const handleUpdateVideoDates = (id: string, newDelivery: string, newPublish: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, deliveryDeadline: newDelivery, publishDate: newPublish } : v));
  };

  const handleUpdateClientTargets = (clientId: string, reelsTarget: number, youtubeTarget: number) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, reelsTarget, youtubeTarget } : c));
  };

  const handleAddClient = (name: string, specialty: string, reelsTarget: number, youtubeTarget: number) => {
    const newClient: Client = {
      id: `c-${Date.now()}`,
      name,
      specialty,
      reelsTarget,
      youtubeTarget,
    };
    setClients(prev => [...prev, newClient]);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    setVideos(prev => prev.filter(v => v.clientId !== clientId));
  };

  const t = translations[language];

  // Render view router
  const renderTabContent = () => {
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
            onUpdateSafetyBuffer={setSafetyBuffer} 
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
