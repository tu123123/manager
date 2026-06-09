# PWA (Progressive Web App) Setup Guide

Your Next.js application has been configured as a Progressive Web App. This allows users to install your app on their devices and use it offline.

## What's Included

### 1. **next-pwa Package**
   - Automatically handles service worker generation and registration
   - Provides caching strategies for offline support
   - Manages web app manifest

### 2. **Service Worker (`/public/sw.js`)**
   - Intercepts network requests
   - Caches resources for offline access
   - Implements "Network First" caching strategy
   - Cleans up old caches on updates

### 3. **Web App Manifest (`/public/manifest.json`)**
   - Defines app metadata (name, icons, colors, etc.)
   - Specifies app display mode (standalone)
   - Lists app screenshots and categories

### 4. **PWA Provider Component**
   - Registers the service worker
   - Handles install prompts
   - Manages app lifecycle

### 5. **Offline Fallback Page (`/public/offline.html`)**
   - Graceful offline experience
   - User-friendly messaging

## Customization

### Update App Information
Edit `/public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "description": "Your app description",
  "start_url": "/",
  "theme_color": "#4f46e5",
  "background_color": "#ffffff"
}
```

### Replace App Icons
Add your icons to `/public/`:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

### Customize Colors
Update in multiple places:
1. `next.config.js` - theme_color
2. `/public/manifest.json` - theme_color and background_color
3. `/app/layout.tsx` - meta theme-color

### Modify Caching Strategy
Edit `/public/sw.js` to adjust:
- `urlsToCache` - What resources to cache on install
- Fetch event handler - Change caching strategy (Network First, Cache First, etc.)

## Installation on Devices

### Desktop (Chrome/Edge)
1. Visit your web app
2. Click the install icon in the address bar
3. Click "Install" in the prompt

### Mobile (iOS)
1. Open in Safari
2. Tap Share → Add to Home Screen
3. Confirm installation

### Mobile (Android)
1. Open in Chrome
2. Tap menu → "Install app"
3. Confirm installation

## Features

✅ **Offline Support** - App works when internet is unavailable
✅ **Fast Loading** - Cached resources load instantly
✅ **Install Prompt** - Users can install as native app
✅ **App Icon** - Appears on home screen
✅ **Standalone Mode** - Runs fullscreen without browser UI
✅ **Auto-Updates** - New versions are served automatically

## Testing

### Test Service Worker
```bash
# Open Chrome DevTools
# Application tab → Service Workers
# Check if service worker is registered and active
```

### Test Offline Mode
1. Open DevTools
2. Go to Network tab
3. Check "Offline" checkbox
4. Refresh page - should show cached content

### Test Installation
1. Open app in Chrome/Edge
2. Look for install prompt in address bar
3. Click to install and verify it works

## Troubleshooting

### Service Worker not registering?
- Check browser console for errors
- Ensure HTTPS is enabled (required for PWA)
- Clear site data and reload

### Icons not showing?
- Verify icon files exist in `/public/`
- Check manifest.json icon paths
- Ensure PNG format and correct dimensions

### Changes not appearing?
- Service workers cache aggressively
- Clear browser cache: Ctrl+Shift+Delete
- In DevTools, check "Update on reload" option
- Uninstall app and reinstall

## Security Considerations

- Service workers must be served over HTTPS
- Only HTTPS requests are cached by default
- Sensitive data should not be cached
- Regular cache cleanup prevents excessive storage use

## Next Steps

1. Replace placeholder icons with your app icons
2. Update manifest.json with your app information
3. Test on different devices
4. Monitor offline usage patterns
5. Iterate based on user feedback
