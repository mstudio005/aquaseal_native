# AquaSeal Backend

Backend API for AquaSeal YouTube downloader using yt-dlp.

## Prerequisites

- Node.js 16 or higher
- npm

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on http://localhost:3000

## API Endpoints

### Health Check
```
GET /api/health
```

### Get Video Information
```
POST /api/video-info
Body: { "url": "youtube_url" }
```

### Download Video
```
POST /api/download
Body: { "url": "youtube_url", "formatId": "format_id" }
```

## Notes

- yt-dlp will be automatically installed when you run `npm install`
- CORS is enabled for local development
- Videos are streamed directly to the client
