function TitleBar() {
  const handleMinimize = () => {
    window.electronAPI.minimizeWindow();
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  return (
    <div className="h-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 select-none" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full"></div>
        <span className="text-sm font-semibold">AI-Status</span>
      </div>
      <div className="flex space-x-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button
          onClick={handleMinimize}
          className="w-8 h-8 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400"
        >
          −
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded hover:bg-red-500 hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-400"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
