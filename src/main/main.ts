import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, Notification } from 'electron';
import * as path from 'path';
import { PingService } from './services/pingService';
import { SettingsManager } from './services/settingsManager';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let pingService: PingService;
let settingsManager: SettingsManager;

const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden',
    frame: false,
    backgroundColor: '#ffffff',
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(icon);
  tray.setToolTip('AI-Status');

  updateTrayMenu();

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });
}

function updateTrayMenu() {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show AI-Status',
      click: () => {
        mainWindow?.show();
      },
    },
    { type: 'separator' },
    {
      label: 'Check Now',
      click: () => {
        pingService.checkNow();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

function updateTrayIcon(status: 'online' | 'partial' | 'offline') {
  if (!tray) return;

  let iconName = 'tray-icon-green.png';
  if (status === 'partial') iconName = 'tray-icon-yellow.png';
  if (status === 'offline') iconName = 'tray-icon-red.png';

  const iconPath = path.join(__dirname, `../../assets/${iconName}`);
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  tray.setImage(icon);
}

function sendNotification(title: string, body: string) {
  const settings = settingsManager.getSettings();
  if (!settings.notificationsEnabled) return;

  const notification = new Notification({
    title,
    body,
    icon: path.join(__dirname, '../../assets/icon.png'),
  });

  notification.show();
}

// IPC Handlers
function setupIpcHandlers() {
  ipcMain.handle('get-status', () => {
    return pingService.getStatus();
  });

  ipcMain.handle('get-settings', () => {
    return settingsManager.getSettings();
  });

  ipcMain.handle('update-settings', (_event, settings) => {
    settingsManager.updateSettings(settings);
    pingService.updateInterval(settings.checkInterval);
    return settingsManager.getSettings();
  });

  ipcMain.handle('check-now', () => {
    pingService.checkNow();
  });

  ipcMain.handle('get-history', () => {
    return pingService.getHistory();
  });

  ipcMain.handle('export-logs', async (_event, format: 'json' | 'csv') => {
    return pingService.exportLogs(format);
  });

  ipcMain.on('minimize-window', () => {
    mainWindow?.hide();
  });

  ipcMain.on('close-window', () => {
    app.quit();
  });
}

app.whenReady().then(() => {
  // Initialize services
  settingsManager = new SettingsManager();
  pingService = new PingService(settingsManager.getSettings());

  // Set up auto-launch
  if (settingsManager.getSettings().autoStart) {
    app.setLoginItemSettings({
      openAtLogin: true,
    });
  }

  createWindow();
  createTray();
  setupIpcHandlers();

  // Start ping service
  pingService.start();

  // Listen to status changes
  pingService.on('status-changed', (data) => {
    updateTrayIcon(data.overallStatus);
    
    // Send notification
    if (data.overallStatus === 'offline') {
      sendNotification('🚨 AI Services Unreachable', 'All AI services are currently unreachable.');
    } else if (data.previousStatus === 'offline' && data.overallStatus === 'online') {
      sendNotification('✅ AI Access Restored', 'AI services are back online.');
    } else if (data.overallStatus === 'partial') {
      const offlineServices = data.services.filter(s => s.status === 'offline').map(s => s.name);
      sendNotification('🟡 Partial AI Access', `Some services are down: ${offlineServices.join(', ')}`);
    }

    // Send to renderer
    if (mainWindow) {
      mainWindow.webContents.send('status-update', data);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});
