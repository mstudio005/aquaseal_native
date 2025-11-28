# AquaSeal - YouTube Downloader

A modern, beautiful YouTube thumbnail and video downloader with zero cost.

## 📁 Project Structure

```
aquaseal/
├── index.html          # Frontend UI
├── style.css           # Styling
├── script.js           # Frontend logic
├── manifest.json       # PWA manifest
├── icon-192.png        # App icon
├── icon-512.png        # App icon
└── backend/            # Node.js backend
    ├── package.json
    ├── server.js       # Express + yt-dlp server
    └── README.md
```

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- Express (web server)
- CORS (cross-origin requests)
- yt-dlp-exec (YouTube downloader - completely free!)

### 2. Start the Backend Server

```bash
npm start
```

The server will run on `http://localhost:3000`

###3. Open the Frontend

Simply open `index.html` in your browser (or use Live Server in VS Code).

## ✨ Features

- 🖼️ **Thumbnail Downloads**: Get YouTube thumbnails in multiple qualities
- 🎥 **Video Downloads**: Download YouTube videos in various qualities
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations
- ⚡ **Fast**: Instant downloads with streaming support
- 🔒 **Privacy**: Everything runs locally, no external APIs
- 💰 **Zero Cost**: Completely free, uses open-source yt-dlp
- 📱 **PWA Ready**: Can be installed as an app
- 🐳 **Easy to Containerize**: Ready for Docker deployment

## 🎯 How to Use

1. Start the backend server (`cd backend && npm start`)
2. Open `index.html` in your browser
3. Choose mode: Thumbnail or Video
4. Paste a YouTube URL
5. Click "Get Thumbnail" or "Get Video Info"
6. Select quality and download!

## 🔧 API Endpoints

The backend provides these endpoints:

- `GET /api/health` - Check if server is running
- `POST /api/video-info` - Get video metadata and available formats
- `POST /api/download` - Download video in selected quality

## 📦 Converting to Mobile App

When ready to convert to a mobile app:

### Using Capacitor (Recommended)

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init AquaSeal com.aquaseal.app

# Add platforms
npx cap add android
npx cap add ios

# Build and sync
npx cap sync
```

The backend can run as:
1. **Remote API**: Deploy to any cloud provider (Heroku, Railway, etc.)
2. **Local Service**: Package with the app using Capacitor plugins

### Using Electron (Desktop App)

```bash
npm install electron electron-builder
```

Package both frontend and backend together.

## 🐳 Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

# Install yt-dlp dependencies
RUN apk add --no-cache python3 ffmpeg

WORKDIR /app

# Copy backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend/ ./backend/
COPY index.html style.css script.js manifest.json ./

EXPOSE 3000

CMD ["node", "backend/server.js"]
```

Build and run:
```bash
docker build -t aquaseal .
docker run -p 3000:3000 aquaseal
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3 (Glassmorphism), Vanilla JavaScript
- **Backend**: Node.js, Express
- **Downloader**: yt-dlp (open-source, most reliable YouTube downloader)
- **Fonts**: Google Fonts (Inter)
- **Icons**: Custom SVG icons

## 🎨 Design Features

- Dark theme with aqua/teal branding
- Glassmorphism card effects
- Smooth animations and transitions
- Floating gradient orbs background
- Responsive design (mobile, tablet, desktop)
- Modern typography
- Interactive hover effects

## 📝 Notes

- Backend must be running for video downloads
- Thumbnail downloads work without backend (direct from YouTube)
- yt-dlp is automatically installed with `npm install`
- CORS is enabled for local development
- Videos are streamed directly to avoid memory issues

## 🔮 Future Enhancements

- Playlist download support
- Audio-only downloads
- Format conversion
- Download queue
- History of downloads
- Dark/Light theme toggle

## 📄 License

MIT License - Feel free to use for personal or commercial projects!

---

**Made with ❤️ using modern web technologies**
