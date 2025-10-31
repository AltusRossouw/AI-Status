import { HistoryEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoryViewProps {
  history: HistoryEntry[];
  onExportLogs: (format: 'json' | 'csv') => void;
}

function HistoryView({ history, onExportLogs }: HistoryViewProps) {
  // Calculate uptime percentage
  const calculateUptime = () => {
    if (history.length === 0) return 0;
    const onlineCount = history.filter(h => h.overallStatus === 'online').length;
    return Math.round((onlineCount / history.length) * 100);
  };

  // Prepare data for chart
  const chartData = history.slice(-50).map(entry => {
    const onlineCount = entry.services.filter(s => s.status === 'online').length;
    const totalCount = entry.services.length;
    const uptimePercent = Math.round((onlineCount / totalCount) * 100);
    
    return {
      time: new Date(entry.timestamp).toLocaleTimeString(),
      uptime: uptimePercent,
      online: onlineCount,
      total: totalCount,
    };
  });

  const uptime = calculateUptime();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">History & Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onExportLogs('json')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={() => onExportLogs('csv')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Uptime Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Uptime</p>
          <p className="text-3xl font-bold text-primary">{uptime}%</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Checks</p>
          <p className="text-3xl font-bold">{history.length}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Status</p>
          <p className="text-3xl font-bold">
            {history.length > 0 ? (
              <span className={
                history[history.length - 1].overallStatus === 'online' ? 'text-green-500' :
                history[history.length - 1].overallStatus === 'offline' ? 'text-red-500' :
                'text-yellow-500'
              }>
                {history[history.length - 1].overallStatus === 'online' ? '🟢' :
                 history[history.length - 1].overallStatus === 'offline' ? '🔴' : '🟡'}
              </span>
            ) : '—'}
          </p>
        </div>
      </div>

      {/* Uptime Graph */}
      {chartData.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Uptime Over Time (Last 50 Checks)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="uptime"
                stroke="#1D33F3"
                strokeWidth={2}
                dot={false}
                name="Uptime %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent History */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Checks</h3>
        <div className="space-y-2">
          {history.slice(-20).reverse().map((entry, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">
                  {entry.overallStatus === 'online' ? '🟢' :
                   entry.overallStatus === 'offline' ? '🔴' : '🟡'}
                </span>
                <div>
                  <p className="font-medium">
                    {entry.overallStatus === 'online' ? 'All Services Online' :
                     entry.overallStatus === 'offline' ? 'All Services Offline' :
                     'Partial Access'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.services.filter(s => s.status === 'online').length} / {entry.services.length} services online
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryView;
