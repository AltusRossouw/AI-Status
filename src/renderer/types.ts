export interface ServiceEndpoint {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'checking';
  latency: number | null;
  lastChecked: Date | null;
}

export interface StatusData {
  services: ServiceEndpoint[];
  overallStatus: 'online' | 'partial' | 'offline';
  previousStatus: 'online' | 'partial' | 'offline';
  lastChecked: Date;
}

export interface Settings {
  checkInterval: number;
  notificationsEnabled: boolean;
  autoStart: boolean;
  customEndpoints: Array<{ name: string; url: string }>;
}

export interface HistoryEntry {
  timestamp: Date;
  services: ServiceEndpoint[];
  overallStatus: 'online' | 'partial' | 'offline';
}

declare global {
  interface Window {
    electronAPI: {
      getStatus: () => Promise<StatusData>;
      getSettings: () => Promise<Settings>;
      updateSettings: (settings: Partial<Settings>) => Promise<Settings>;
      checkNow: () => Promise<void>;
      getHistory: () => Promise<HistoryEntry[]>;
      exportLogs: (format: 'json' | 'csv') => Promise<string>;
      onStatusUpdate: (callback: (data: StatusData) => void) => void;
      minimizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}
