# AI-Status Project Structure

```
AI-Status/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & build scripts
│   ├── tsconfig.json               # TypeScript config (renderer)
│   ├── tsconfig.main.json          # TypeScript config (main)
│   ├── vite.config.ts              # Vite bundler config
│   ├── tailwind.config.js          # TailwindCSS config
│   ├── postcss.config.js           # PostCSS config
│   ├── .gitignore                  # Git ignore rules
│   └── index.html                  # HTML entry point
│
├── 📚 Documentation
│   ├── README.md                   # Main documentation
│   ├── GETTING_STARTED.md          # Quick start guide
│   ├── PROJECT_SUMMARY.md          # Complete feature list
│   └── ICONS.md                    # Icon generation guide
│
├── 🎨 Assets
│   └── assets/
│       ├── icon.svg                # App icon (SVG)
│       ├── icon.png                # App icon (placeholder)
│       ├── tray-icon.png           # Default tray icon
│       ├── tray-icon-green.png     # Online status icon
│       ├── tray-icon-yellow.png    # Partial status icon
│       └── tray-icon-red.png       # Offline status icon
│
├── 🔧 Main Process (Electron/Node.js)
│   └── src/main/
│       ├── main.ts                 # ⭐ App entry point
│       │                           #    - Window management
│       │                           #    - System tray
│       │                           #    - Notifications
│       │                           #    - IPC handlers
│       │
│       ├── preload.ts              # Context bridge (IPC)
│       │
│       └── services/
│           ├── pingService.ts      # ⭐ AI endpoint monitoring
│           │                       #    - Periodic checks
│           │                       #    - Status tracking
│           │                       #    - History management
│           │                       #    - Log export
│           │
│           └── settingsManager.ts  # Settings persistence
│                                   #    - JSON storage
│                                   #    - User preferences
│
└── 🎨 Renderer Process (React/TypeScript)
    └── src/renderer/
        ├── main.tsx                # React entry point
        ├── index.css               # Global styles (Tailwind)
        ├── types.ts                # TypeScript definitions
        │
        ├── App.tsx                 # ⭐ Main app component
        │                           #    - View routing
        │                           #    - State management
        │                           #    - Dark mode
        │
        └── components/
            ├── TitleBar.tsx        # Custom window controls
            │                       #    - Minimize/Close buttons
            │                       #    - Drag region
            │
            ├── StatusView.tsx      # ⭐ Service status display
            │                       #    - Real-time status
            │                       #    - Latency display
            │                       #    - Check now button
            │
            ├── HistoryView.tsx     # ⭐ Analytics dashboard
            │                       #    - Uptime graph
            │                       #    - Recent checks
            │                       #    - Export logs
            │
            └── SettingsView.tsx    # ⭐ User preferences
                                    #    - Check interval
                                    #    - Notifications toggle
                                    #    - Auto-start
                                    #    - Custom endpoints
```

## 📊 File Statistics

- **Total Files**: 31
- **TypeScript Files**: 11
- **React Components**: 5
- **Configuration Files**: 7
- **Documentation Files**: 4
- **Asset Files**: 7

## 🔑 Key Files (⭐)

### Must-Read Files
1. **`src/main/main.ts`** - Electron main process orchestration
2. **`src/main/services/pingService.ts`** - Core monitoring logic
3. **`src/renderer/App.tsx`** - UI application logic
4. **`package.json`** - Build commands and dependencies

### Component Files
5. **`src/renderer/components/StatusView.tsx`** - Real-time status display
6. **`src/renderer/components/HistoryView.tsx`** - Uptime analytics
7. **`src/renderer/components/SettingsView.tsx`** - User configuration

## 🚀 Build Output Structure

After running `npm run build`:

```
AI-Status/
├── dist/
│   ├── main/                  # Compiled main process
│   │   ├── main.js
│   │   ├── preload.js
│   │   └── services/
│   │       ├── pingService.js
│   │       └── settingsManager.js
│   │
│   └── renderer/              # Compiled renderer
│       ├── index.html
│       ├── assets/
│       └── *.js (bundled)
```

After running `npm run package`:

```
AI-Status/
└── dist/
    ├── AI-Status-1.0.0.dmg           # macOS installer
    ├── AI-Status-1.0.0-mac.zip       # macOS portable
    ├── AI-Status Setup 1.0.0.exe     # Windows installer
    └── AI-Status 1.0.0.exe           # Windows portable
```

## 🎯 File Purposes

### Configuration Layer
- **package.json** → Dependencies, scripts, electron-builder config
- **tsconfig*.json** → TypeScript compilation settings
- **vite.config.ts** → Bundler configuration (dev server, build)
- **tailwind.config.js** → Custom colors, fonts, themes

### Main Process Layer
- **main.ts** → App lifecycle, window/tray management
- **preload.ts** → Secure IPC bridge between processes
- **pingService.ts** → Network checks, status tracking
- **settingsManager.ts** → Persistent user preferences

### Renderer Layer
- **App.tsx** → Root component, view routing
- **StatusView.tsx** → Service status dashboard
- **HistoryView.tsx** → Uptime graphs and logs
- **SettingsView.tsx** → Configuration panel
- **TitleBar.tsx** → Custom window controls

## 📦 Dependencies

### Production
- `electron` - Desktop framework
- `react` + `react-dom` - UI library
- `recharts` - Data visualization

### Development
- `typescript` - Type safety
- `vite` - Build tool
- `tailwindcss` - Styling
- `electron-builder` - App packaging
- `@types/*` - Type definitions

## 🔄 Data Flow

```
User Action (UI)
    ↓
IPC Call (preload.ts)
    ↓
Handler (main.ts)
    ↓
Service Logic (pingService.ts / settingsManager.ts)
    ↓
IPC Response
    ↓
State Update (App.tsx)
    ↓
Component Re-render
```

## 🎨 Styling Architecture

```
TailwindCSS (utility classes)
    ↓
Custom Config (tailwind.config.js)
    ↓
Primary Color: #1D33F3 (Blue)
Font: Inter
Dark Mode: class-based
    ↓
Global Styles (index.css)
    ↓
Component Styles (inline className)
```

---

**Total Lines of Code**: ~2,500+
**Development Time**: Fully featured prototype
**Build Size**: ~150-200 MB (packaged app)
