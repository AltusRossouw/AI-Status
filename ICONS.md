# Icon Generation Guide

The SVG icons in the `assets/` folder need to be converted to platform-specific formats for production builds.

## Required Icon Formats

### macOS (.icns)
- **File**: `assets/icon.icns`
- **Sizes needed**: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024

### Windows (.ico)
- **File**: `assets/icon.ico`
- **Sizes needed**: 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256

### Tray Icons (PNG)
Convert the SVG tray icons to PNG format:
- `tray-icon.png` (default)
- `tray-icon-green.png` (online)
- `tray-icon-yellow.png` (partial)
- `tray-icon-red.png` (offline)

Recommended size: 16x16@2x (32x32) for retina displays

## Online Tools

### Option 1: CloudConvert
1. Go to https://cloudconvert.com/svg-to-icns
2. Upload `assets/icon.svg`
3. Convert to ICNS (macOS) and ICO (Windows)

### Option 2: iConvert Icons
1. Go to https://iconverticons.com/online/
2. Upload your SVG
3. Download all platform-specific formats

### Option 3: Command Line (macOS only)

For macOS icon generation:

```bash
# Install iconutil (comes with Xcode)
# Create iconset folder
mkdir icon.iconset

# Generate different sizes (requires ImageMagick or similar)
convert assets/icon.svg -resize 16x16 icon.iconset/icon_16x16.png
convert assets/icon.svg -resize 32x32 icon.iconset/icon_16x16@2x.png
convert assets/icon.svg -resize 32x32 icon.iconset/icon_32x32.png
convert assets/icon.svg -resize 64x64 icon.iconset/icon_32x32@2x.png
convert assets/icon.svg -resize 128x128 icon.iconset/icon_128x128.png
convert assets/icon.svg -resize 256x256 icon.iconset/icon_128x128@2x.png
convert assets/icon.svg -resize 256x256 icon.iconset/icon_256x256.png
convert assets/icon.svg -resize 512x512 icon.iconset/icon_256x256@2x.png
convert assets/icon.svg -resize 512x512 icon.iconset/icon_512x512.png
convert assets/icon.svg -resize 1024x1024 icon.iconset/icon_512x512@2x.png

# Convert to icns
iconutil -c icns icon.iconset -o assets/icon.icns

# Clean up
rm -rf icon.iconset
```

For Windows ICO (requires ImageMagick):

```bash
convert assets/icon.svg -define icon:auto-resize=256,128,64,48,32,16 assets/icon.ico
```

## Quick Start Without Proper Icons

For development/testing, electron-builder can work with the SVG files, though it's not ideal for production. The current setup includes SVG placeholders that will work but should be replaced before final distribution.

## Tray Icon Generation

For tray icons, convert SVGs to PNGs:

```bash
# Using ImageMagick or similar
convert assets/tray-icon.svg -resize 32x32 assets/tray-icon.png
convert assets/tray-icon-green.svg -resize 32x32 assets/tray-icon-green.png
convert assets/tray-icon-yellow.svg -resize 32x32 assets/tray-icon-yellow.png
convert assets/tray-icon-red.svg -resize 32x32 assets/tray-icon-red.png
```

Or use online tools like:
- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png

## Testing Icons

After generating proper icons:

1. Replace the placeholder SVG files with generated ICNS/ICO files
2. Rebuild the app: `npm run package`
3. Check that:
   - App icon appears correctly in dock/taskbar
   - Tray icon displays properly
   - Icon shows in file browser
   - All sizes are crisp (not blurry)

---

**Note**: The current SVG placeholders are functional for development but should be replaced with proper icon formats before production deployment.
