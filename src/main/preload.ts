import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getStatus: () => ipcRenderer.invoke('get-status'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings: any) => ipcRenderer.invoke('update-settings', settings),
  checkNow: () => ipcRenderer.invoke('check-now'),
  getHistory: () => ipcRenderer.invoke('get-history'),
  exportLogs: (format: 'json' | 'csv') => ipcRenderer.invoke('export-logs', format),
  onStatusUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('status-update', (_event, data) => callback(data));
  },
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
});
