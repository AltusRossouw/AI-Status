# 🚀 Getting Started with AI-Status

## Installation & First Run

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Electron 28
- React 18 with TypeScript
- TailwindCSS
- Vite for fast builds
- Recharts for data visualization
- All necessary type definitions

### 2. Development Mode

```bash
npm run dev
```

This command:
1. Compiles the main process TypeScript → `dist/main/`
2. Starts Vite dev server on `http://localhost:3000`
3. Launches Electron with hot-reload enabled

**First Launch**: The app will appear in your system tray (menu bar on macOS, system tray on Windows).

### 3. Using the App

**Click the tray icon** to open the main window with three tabs:

#### Status Tab
- Shows all monitored AI services
- Real-time status indicators (🟢 🟡 🔴)
- Latency measurements
- "Check Now" button for manual refresh

#### History Tab
- Uptime percentage graph
- Recent check history
- Export logs as JSON or CSV

#### Settings Tab
- Adjust check interval (15s - 5min)
- Enable/disable notifications
- Toggle auto-start on boot
- Add custom endpoints to monitor

### 4. Building for Production

#### macOS
```bash
npm run package:mac
```
Creates:
- `.dmg` installer
- `.zip` portable app

Find in: `dist/AI-Status-1.0.0.dmg`

#### Windows
```bash
npm run package:win
```
Creates:
- `.exe` installer (NSIS)
- Portable `.exe`

Find in: `dist/AI-Status Setup 1.0.0.exe`

## Project Architecture

```
┌─────────────────────────────────────────┐
│           MAIN PROCESS                  │
│  (Node.js + Electron + TypeScript)      │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │  main.ts                         │  │
│  │  - Window management             │  │
│  │  - System tray                   │  │
│  │  - Notifications                 │  │
│  │  - IPC handlers                  │  │
│  └──────────────────────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │  pingService.ts                  │  │
│  │  - Endpoint checking             │  │
│  │  - Status tracking               │  │
│  │  - History management            │  │
│  └──────────────────────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │  settingsManager.ts              │  │
│  │  - Settings persistence          │  │
│  │  - User preferences              │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕
            IPC Communication
                    ↕
┌─────────────────────────────────────────┐
│         RENDERER PROCESS                │
│    (React + TypeScript + Tailwind)      │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │  App.tsx                         │  │
│  │  - View routing                  │  │
│  │  - State management              │  │
│  └──────────────────────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │  Components                      │  │
│  │  - StatusView                    │  │
│  │  - HistoryView (with charts)     │  │
│  │  - SettingsView                  │  │
│  │  - TitleBar                      │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Key Features Implemented

✅ **Periodic Ping Checks**
- Checks every 60 seconds (configurable 15s-5min)
- HEAD requests to minimize bandwidth
- 10-second timeout per service
- Latency measurement

✅ **System Tray Integration**
- Color-coded status icon
- Context menu with quick actions
- Click to show/hide window
- Minimize to tray behavior

✅ **Smart Notifications**
- Alerts on status changes
- Configurable on/off
- Platform-native notifications

✅ **Modern UI**
- React + TailwindCSS
- Dark mode support
- Responsive design
- Custom title bar

✅ **History & Analytics**
- Stores last 1000 checks
- Uptime percentage calculation
- Visual graphs (Recharts)
- Export to JSON/CSV

✅ **Customization**
- Adjustable check intervals
- Custom endpoint support
- Auto-start on boot
- Persistent settings

## Monitored Services (Default)

| Service | Endpoint |
|---------|----------|
| OpenAI | `https://api.openai.com/v1/models` |
| Anthropic | `https://api.anthropic.com/v1/messages` |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/models` |
| Cohere | `https://api.cohere.ai/v1/generate` |
| Hugging Face | `https://huggingface.co/api/models` |

## Next Steps

1. **Run the app**: `npm run dev`
2. **Customize**: Add your own endpoints in Settings
3. **Build**: Create production builds for distribution
4. **Deploy**: Share the built app with your team

## Troubleshooting

**Port 3000 already in use?**
```bash
# Edit vite.config.ts and change the port
server: {
  port: 3001, // or any other port
}
```

**TypeScript errors?**
The errors shown are expected during development - they'll resolve once dependencies are installed. Run `npm install` to fix.

**Icon not showing?**
SVG icons are provided as placeholders. For production, convert them to PNG/ICNS/ICO format using an icon generator tool.

## Production Checklist

Before building for distribution:

- [ ] Test on target platforms (macOS/Windows)
- [ ] Convert SVG icons to proper formats (.icns for macOS, .ico for Windows)
- [ ] Update version in `package.json`
- [ ] Test notifications permissions
- [ ] Verify auto-start functionality
- [ ] Test with real network restrictions
- [ ] Add code signing certificates (for distribution)

---

**Ready to start?** Run `npm install && npm run dev` 🚀
