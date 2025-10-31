import { useState, useEffect } from 'react';
import { StatusData, Settings, HistoryEntry } from './types';
import TitleBar from './components/TitleBar';
import StatusView from './components/StatusView';
import SettingsView from './components/SettingsView';
import HistoryView from './components/HistoryView';

type View = 'status' | 'settings' | 'history';

function App() {
  const [view, setView] = useState<View>('status');
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load initial data
    loadStatus();
    loadSettings();
    loadHistory();

    // Listen for status updates
    window.electronAPI.onStatusUpdate((data) => {
      setStatusData(data);
    });

    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);

    // Listen for dark mode changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const loadStatus = async () => {
    const data = await window.electronAPI.getStatus();
    setStatusData(data);
  };

  const loadSettings = async () => {
    const data = await window.electronAPI.getSettings();
    setSettings(data);
  };

  const loadHistory = async () => {
    const data = await window.electronAPI.getHistory();
    setHistory(data);
  };

  const handleCheckNow = async () => {
    await window.electronAPI.checkNow();
    await loadStatus();
    await loadHistory();
  };

  const handleUpdateSettings = async (newSettings: Partial<Settings>) => {
    const updated = await window.electronAPI.updateSettings(newSettings);
    setSettings(updated);
  };

  const handleExportLogs = async (format: 'json' | 'csv') => {
    const logs = await window.electronAPI.exportLogs(format);
    const blob = new Blob([logs], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-status-logs-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
        <TitleBar />
        
        {/* Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4 px-6 pt-4">
            <button
              onClick={() => setView('status')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                view === 'status'
                  ? 'bg-white dark:bg-gray-800 text-primary border-b-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Status
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                view === 'history'
                  ? 'bg-white dark:bg-gray-800 text-primary border-b-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setView('settings')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                view === 'settings'
                  ? 'bg-white dark:bg-gray-800 text-primary border-b-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {view === 'status' && statusData && (
            <StatusView statusData={statusData} onCheckNow={handleCheckNow} />
          )}
          {view === 'history' && (
            <HistoryView history={history} onExportLogs={handleExportLogs} />
          )}
          {view === 'settings' && settings && (
            <SettingsView settings={settings} onUpdateSettings={handleUpdateSettings} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
