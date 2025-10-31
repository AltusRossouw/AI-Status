import { StatusData } from '../types';

interface StatusViewProps {
  statusData: StatusData;
  onCheckNow: () => void;
}

function StatusView({ statusData, onCheckNow }: StatusViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return '🟢';
      case 'offline':
        return '🔴';
      default:
        return '🟡';
    }
  };

  const getOverallStatusText = () => {
    switch (statusData.overallStatus) {
      case 'online':
        return 'All AI Services Online';
      case 'offline':
        return 'All AI Services Offline';
      default:
        return 'Partial AI Access';
    }
  };

  const formatLatency = (latency: number | null) => {
    if (latency === null) return 'N/A';
    return `${latency}ms`;
  };

  const formatLastChecked = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="p-6">
      {/* Overall Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{getStatusIcon(statusData.overallStatus)}</span>
            <div>
              <h2 className={`text-2xl font-bold ${getStatusColor(statusData.overallStatus)}`}>
                {getOverallStatusText()}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last checked: {formatLastChecked(statusData.lastChecked)}
              </p>
            </div>
          </div>
          <button
            onClick={onCheckNow}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
          >
            Check Now
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-4">AI Services</h3>
        {statusData.services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getStatusIcon(service.status)}</span>
              <div>
                <h4 className="font-semibold">{service.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{service.url}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${getStatusColor(service.status)}`}>
                {service.status.toUpperCase()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {service.status === 'online' ? formatLatency(service.latency) : 'Unreachable'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusView;
