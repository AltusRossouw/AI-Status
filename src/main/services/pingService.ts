import { EventEmitter } from 'events';
import * as https from 'https';
import * as http from 'http';

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

export interface HistoryEntry {
  timestamp: Date;
  services: ServiceEndpoint[];
  overallStatus: 'online' | 'partial' | 'offline';
}

export class PingService extends EventEmitter {
  private services: ServiceEndpoint[] = [
    { name: 'OpenAI', url: 'https://api.openai.com/v1/models', status: 'checking', latency: null, lastChecked: null },
    { name: 'Anthropic', url: 'https://api.anthropic.com/v1/messages', status: 'checking', latency: null, lastChecked: null },
    { name: 'Google Gemini', url: 'https://generativelanguage.googleapis.com/v1beta/models', status: 'checking', latency: null, lastChecked: null },
    { name: 'Cohere', url: 'https://api.cohere.ai/v1/generate', status: 'checking', latency: null, lastChecked: null },
    { name: 'Hugging Face', url: 'https://huggingface.co/api/models', status: 'checking', latency: null, lastChecked: null },
  ];

  private interval: NodeJS.Timeout | null = null;
  private checkIntervalMs: number;
  private previousStatus: 'online' | 'partial' | 'offline' = 'online';
  private history: HistoryEntry[] = [];
  private maxHistorySize = 1000;

  constructor(settings: { checkInterval: number; customEndpoints?: Array<{ name: string; url: string }> }) {
    super();
    this.checkIntervalMs = settings.checkInterval * 1000;

    // Add custom endpoints
    if (settings.customEndpoints && settings.customEndpoints.length > 0) {
      settings.customEndpoints.forEach(endpoint => {
        this.services.push({
          name: endpoint.name,
          url: endpoint.url,
          status: 'checking',
          latency: null,
          lastChecked: null,
        });
      });
    }
  }

  start() {
    this.checkNow();
    this.interval = setInterval(() => this.checkNow(), this.checkIntervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  updateInterval(intervalSeconds: number) {
    this.checkIntervalMs = intervalSeconds * 1000;
    this.stop();
    this.start();
  }

  async checkNow() {
    const checkPromises = this.services.map((service, index) =>
      this.checkService(service.url).then(result => {
        this.services[index] = {
          ...service,
          status: result.success ? 'online' : 'offline',
          latency: result.latency,
          lastChecked: new Date(),
        };
      })
    );

    await Promise.all(checkPromises);

    const overallStatus = this.calculateOverallStatus();
    const statusChanged = overallStatus !== this.previousStatus;

    // Add to history
    this.addToHistory({
      timestamp: new Date(),
      services: JSON.parse(JSON.stringify(this.services)),
      overallStatus,
    });

    if (statusChanged) {
      this.emit('status-changed', {
        services: this.services,
        overallStatus,
        previousStatus: this.previousStatus,
        lastChecked: new Date(),
      });
      this.previousStatus = overallStatus;
    }
  }

  private async checkService(url: string): Promise<{ success: boolean; latency: number | null }> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const protocol = url.startsWith('https') ? https : http;
      
      const timeout = setTimeout(() => {
        resolve({ success: false, latency: null });
      }, 10000); // 10 second timeout

      try {
        const urlObj = new URL(url);
        const options = {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.pathname + urlObj.search,
          method: 'HEAD',
          timeout: 10000,
          headers: {
            'User-Agent': 'AI-Status/1.0',
          },
        };

        const req = protocol.request(options, (res) => {
          clearTimeout(timeout);
          const latency = Date.now() - startTime;
          // Consider any response (even errors like 401, 403) as "online"
          // because it means the service is reachable
          resolve({ success: res.statusCode !== undefined && res.statusCode < 500, latency });
          res.resume();
        });

        req.on('error', () => {
          clearTimeout(timeout);
          resolve({ success: false, latency: null });
        });

        req.on('timeout', () => {
          clearTimeout(timeout);
          req.destroy();
          resolve({ success: false, latency: null });
        });

        req.end();
      } catch (error) {
        clearTimeout(timeout);
        resolve({ success: false, latency: null });
      }
    });
  }

  private calculateOverallStatus(): 'online' | 'partial' | 'offline' {
    const onlineCount = this.services.filter(s => s.status === 'online').length;
    const totalCount = this.services.length;

    if (onlineCount === totalCount) return 'online';
    if (onlineCount === 0) return 'offline';
    return 'partial';
  }

  private addToHistory(entry: HistoryEntry) {
    this.history.push(entry);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  getStatus(): StatusData {
    return {
      services: this.services,
      overallStatus: this.calculateOverallStatus(),
      previousStatus: this.previousStatus,
      lastChecked: new Date(),
    };
  }

  getHistory(): HistoryEntry[] {
    return this.history;
  }

  exportLogs(format: 'json' | 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(this.history, null, 2);
    } else {
      // CSV format
      let csv = 'Timestamp,Service,Status,Latency\n';
      this.history.forEach(entry => {
        entry.services.forEach(service => {
          csv += `${entry.timestamp.toISOString()},${service.name},${service.status},${service.latency || 'N/A'}\n`;
        });
      });
      return csv;
    }
  }
}
