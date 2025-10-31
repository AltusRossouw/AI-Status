import { useState } from 'react';
import { Settings } from '../types';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
}

function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [customEndpoint, setCustomEndpoint] = useState({ name: '', url: '' });

  const handleSave = () => {
    onUpdateSettings(localSettings);
  };

  const handleAddEndpoint = () => {
    if (customEndpoint.name && customEndpoint.url) {
      const newEndpoints = [...localSettings.customEndpoints, customEndpoint];
      setLocalSettings({ ...localSettings, customEndpoints: newEndpoints });
      setCustomEndpoint({ name: '', url: '' });
    }
  };

  const handleRemoveEndpoint = (index: number) => {
    const newEndpoints = localSettings.customEndpoints.filter((_, i) => i !== index);
    setLocalSettings({ ...localSettings, customEndpoints: newEndpoints });
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* Check Interval */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Check Interval (seconds)
        </label>
        <input
          type="number"
          min="15"
          max="300"
          value={localSettings.checkInterval}
          onChange={(e) =>
            setLocalSettings({ ...localSettings, checkInterval: parseInt(e.target.value) })
          }
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          How often to check AI service status (15-300 seconds)
        </p>
      </div>

      {/* Notifications */}
      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localSettings.notificationsEnabled}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, notificationsEnabled: e.target.checked })
            }
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
          />
          <span className="font-medium">Enable Notifications</span>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
          Get notified when AI service status changes
        </p>
      </div>

      {/* Auto Start */}
      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localSettings.autoStart}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, autoStart: e.target.checked })
            }
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
          />
          <span className="font-medium">Start on Boot</span>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
          Automatically start AI-Status when your computer starts
        </p>
      </div>

      {/* Custom Endpoints */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Custom Endpoints</h3>
        
        <div className="space-y-2 mb-4">
          {localSettings.customEndpoints.map((endpoint, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{endpoint.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{endpoint.url}</p>
              </div>
              <button
                onClick={() => handleRemoveEndpoint(index)}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Service Name"
            value={customEndpoint.name}
            onChange={(e) => setCustomEndpoint({ ...customEndpoint, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="url"
            placeholder="https://api.example.com"
            value={customEndpoint.url}
            onChange={(e) => setCustomEndpoint({ ...customEndpoint, url: e.target.value })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleAddEndpoint}
            disabled={!customEndpoint.name || !customEndpoint.url}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Custom Endpoint
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
      >
        Save Settings
      </button>
    </div>
  );
}

export default SettingsView;
