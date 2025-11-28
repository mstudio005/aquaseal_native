# 🚀 AquaSeal - Quick Start Guide

## ⚠️ Important: You Need Node.js

The backend requires Node.js to run. Here's how to get started:

## Step 1: Install Node.js

Download and install Node.js from: https://nodejs.org/

- Download the **LTS version** (recommended)
- Run the installer
- This will install both Node.js and npm (package manager)

## Step 2: Verify Installation

Open a new PowerShell/Command Prompt and run:

```bash
node --version
npm --version
```

You should see version numbers if installed correctly.

## Step 3: Install Backend Dependencies

Navigate to the backend folder and install dependencies:

```bash
cd C:\Users\ADFAR\.gemini\antigravity\scratch\aquaseal\backend
npm install
```

This will install:
- express
- cors  
- yt-dlp-exec (the free YouTube downloader)

## Step 4: Start the Backend Server

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   🌊 AquaSeal API Server Running 🌊   ║
╠════════════════════════════════════════╣
║  Port: 3000                            ║
║  Status: Active                        ║
╚════════════════════════════════════════╝
```

## Step 5: Open the Frontend

Open `index.html` in your browser:
- Double-click the file, OR
- Right-click → Open with → Your browser

## 🎯 Usage

### For Thumbnails (No Backend Needed):
1. Click "Thumbnail" mode
2. Paste a YouTube URL
3. Click "Get Thumbnail"  
4. Select quality and download

### For Videos (Backend Required):
1. Make sure backend is running (`npm start`)
2. Click "Video" mode
3. Paste a YouTube URL
4. Click "Get Video Info"
5. Select quality and download

## 🐛 Troubleshooting

### Backend Not Starting?
- Make sure you ran `npm install` first
- Check if port 3000 is already in use
- Look for error messages in the terminal

### Video Download Failing?
- Ensure backend is running on `http://localhost:3000`
- Check browser console for errors (F12)
- Some videos may have restrictions

### Thumbnail Download Failing?
- Try a different quality option
- Make sure the URL is a valid YouTube video

## 📝 Test URLs

Try these YouTube URLs to test:
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/jNQXAC9IVRw`

## 🎨 Features

✅ Beautiful modern UI with glassmorphism effects
✅ Download thumbnails in 4 quality options
✅ Download videos in multiple qualities
✅ Completely free and runs locally
✅ PWA-ready for mobile app conversion
✅ Zero cost - uses open-source yt-dlp

## 🔥 Next Steps

Once you have it working:
1. Test with various YouTube videos
2. Try different quality options
3. When ready, we can containerize it for deployment
4. Or convert it to a mobile app using Capacitor!

---

**Questions? The backend logs will show any errors that occur.**
