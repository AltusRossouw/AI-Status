import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export interface Settings {
  checkInterval: number; // in seconds
  notificationsEnabled: boolean;
  autoStart: boolean;
  customEndpoints: Array<{ name: string; url: string }>;
}

const DEFAULT_SETTINGS: Settings = {
  checkInterval: 60, // 60 seconds
  notificationsEnabled: true,
  autoStart: false,
  customEndpoints: [],
};

export class SettingsManager {
  private settingsPath: string;
  private settings: Settings;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.settingsPath = path.join(userDataPath, 'settings.json');
    this.settings = this.loadSettings();
  }

  private loadSettings(): Settings {
    try {
      if (fs.existsSync(this.settingsPath)) {
        const data = fs.readFileSync(this.settingsPath, 'utf-8');
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings() {
    try {
      const dir = path.dirname(this.settingsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  getSettings(): Settings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<Settings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }
}
