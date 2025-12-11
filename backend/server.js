import express from 'express';
import cors from 'cors';
import ytDlp from 'yt-dlp-exec';

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// CONTENT FILTERING - Block Adult/Inappropriate Content
// ===========================
const BLOCKED_DOMAINS = [
    // Adult content sites
    'pornhub', 'xvideos', 'xnxx', 'xhamster', 'redtube', 'youporn', 'tube8',
    'spankbang', 'eporner', 'ixxx', 'tnaflix', 'porntrex', 'beeg', 'porn',
    'xxx', 'adult', 'nsfw', 'onlyfans', 'fansly', 'chaturbate', 'stripchat',
    'cam4', 'bongacams', 'livejasmin', 'camsoda', 'myfreecams', 'flirt4free',
    'imlive', 'streamate', 'jerkmate', 'pornmd', 'thumbzilla', 'pornone',
    'hqporner', 'daftsex', 'sxyprn', 'playvids', 'heavy-r', 'efukt',
    'motherless', 'bestgore', 'kaotic', 'crazyshit', 'theync', 'documenting',
    'livegore', 'shockchan', 'rotten', 'ogrish', 'hentai', 'nhentai', 'hanime',
    'rule34', 'e621', 'furaffinity', 'gelbooru', 'danbooru', 'sankaku',
    'literotica', 'asstr', 'sexstories', 'luscious', 'fakku', 'tsumino',
    'fapdu', 'nudevista', 'fuq', 'youjizz', 'drtuber', 'txxx', 'hdzog',
    'hclips', 'upornia', 'vjav', 'javhd', 'jav', 'dmm', 'r18', 'caribbean',
    'tokyo-hot', '1pondo', 'pacopacomama', 'heydouga', 'mywife', 'h0930',
    'av', 'javlibrary', 'javbus', 'javdb', 'missav', 'supjav',
    // Gore/Violence
    'liveleak', 'documentingreality', 'goregrish', 'seegore',
    // Gambling
    'bet365', 'betway', 'bovada', 'pokerstars', 'draftkings', 'fanduel',
    // Drug related
    'erowid', 'drugs-forum',
];

const BLOCKED_KEYWORDS = [
    'porn', 'xxx', 'sex', 'adult', 'nsfw', 'nude', 'naked', 'hentai',
    'erotic', 'fetish', 'bdsm', 'gore', '死', 'gruesom', 'torture'
];

function isBlockedUrl(url) {
    const lowerUrl = url.toLowerCase();
    
    // Check against blocked domains
    for (const domain of BLOCKED_DOMAINS) {
        if (lowerUrl.includes(domain)) {
            return { blocked: true, reason: 'This website is not supported due to content policy restrictions.' };
        }
    }
    
    // Check URL path for blocked keywords
    try {
        const urlObj = new URL(url);
        const pathAndQuery = (urlObj.pathname + urlObj.search).toLowerCase();
        for (const keyword of BLOCKED_KEYWORDS) {
            if (pathAndQuery.includes(keyword)) {
                return { blocked: true, reason: 'This content is not supported due to content policy restrictions.' };
            }
        }
    } catch (e) {
        // Invalid URL
    }
    
    return { blocked: false };
}

function isBlockedContent(videoInfo) {
    const title = (videoInfo.title || '').toLowerCase();
    const description = (videoInfo.description || '').toLowerCase();
    const channel = (videoInfo.uploader || '').toLowerCase();
    const categories = (videoInfo.categories || []).map(c => c.toLowerCase());
    const tags = (videoInfo.tags || []).map(t => t.toLowerCase());
    
    // Check if age-restricted
    if (videoInfo.age_limit && videoInfo.age_limit >= 18) {
        return { blocked: true, reason: 'Age-restricted content is not supported.' };
    }
    
    // Check title, description, channel for blocked keywords
    const textToCheck = `${title} ${description} ${channel} ${categories.join(' ')} ${tags.join(' ')}`;
    for (const keyword of BLOCKED_KEYWORDS) {
        if (textToCheck.includes(keyword)) {
            return { blocked: true, reason: 'This content is not supported due to content policy restrictions.' };
        }
    }
    
    return { blocked: false };
}

// Middleware
app.use(cors({
    exposedHeaders: ['Content-Length', 'X-Expected-Size']
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AquaSeal API is running' });
});

// Get video information and available formats
app.post('/api/video-info', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'YouTube URL is required' });
        }

        // Check if URL is blocked
        const urlCheck = isBlockedUrl(url);
        if (urlCheck.blocked) {
            return res.status(403).json({ error: urlCheck.reason });
        }

        console.log('Fetching video info for:', url);

        // Get video information using yt-dlp
        const output = await ytDlp(url, {
            dumpJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
        });

        // Check if content is blocked
        const contentCheck = isBlockedContent(output);
        if (contentCheck.blocked) {
            return res.status(403).json({ error: contentCheck.reason });
        }

        // Get best thumbnail - prioritize maxresdefault for YouTube
        let bestThumbnail = output.thumbnail;
        if (output.thumbnails && output.thumbnails.length > 0) {
            // Sort by resolution (prefer highest)
            const sortedThumbnails = output.thumbnails
                .filter(t => t.url)
                .sort((a, b) => (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0));
            if (sortedThumbnails.length > 0) {
                bestThumbnail = sortedThumbnails[0].url;
            }
        }
        
        // For YouTube, construct maxresdefault URL directly
        if (output.id && (url.includes('youtube.com') || url.includes('youtu.be'))) {
            bestThumbnail = `https://i.ytimg.com/vi/${output.id}/maxresdefault.jpg`;
        }

        // Extract relevant information
        const videoInfo = {
            id: output.id,
            title: output.title,
            duration: output.duration,
            thumbnail: bestThumbnail,
            channel: output.uploader,
            views: output.view_count,
            uploadDate: output.upload_date,
            description: output.description?.substring(0, 200) + '...' || '',
            formats: []
        };

        // Find the best audio format to calculate combined sizes
        const bestAudio = output.formats
            .filter(f => f.vcodec === 'none' && f.acodec !== 'none')
            .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
        
        const audioSize = bestAudio ? (bestAudio.filesize || bestAudio.filesize_approx || 0) : 0;
        console.log('Best audio format:', bestAudio?.format_id, 'Size:', audioSize);

        // Process available formats - prioritize video-only formats that will be merged with audio
        const videoOnlyFormats = output.formats
            .filter(f => f.vcodec !== 'none' && (f.acodec === 'none' || !f.acodec))
            .sort((a, b) => (b.height || 0) - (a.height || 0));

        const combinedFormats = output.formats
            .filter(f => f.vcodec !== 'none' && f.acodec !== 'none')
            .sort((a, b) => (b.height || 0) - (a.height || 0));

        // Create simplified format list
        const seenQualities = new Set();
        
        // First add video-only formats (which will be merged with audio)
        videoOnlyFormats.forEach(format => {
            const quality = format.height || 'audio';
            const qualityLabel = format.format_note || `${quality}p`;

            if (!seenQualities.has(quality) && quality !== 'audio') {
                seenQualities.add(quality);
                const videoSize = format.filesize || format.filesize_approx || 0;
                // Combined size = video + audio
                const totalSize = videoSize + audioSize;
                
                videoInfo.formats.push({
                    formatId: format.format_id,
                    quality: qualityLabel,
                    height: format.height,
                    ext: 'mp4',
                    filesize: totalSize, // Now includes audio size
                    videoSize: videoSize,
                    audioSize: audioSize,
                    fps: format.fps,
                    needsMerge: true,
                });
            }
        });

        // Then add combined formats for qualities not already covered
        combinedFormats.forEach(format => {
            const quality = format.height || 'audio';
            const qualityLabel = format.format_note || `${quality}p`;

            if (!seenQualities.has(quality) && quality !== 'audio') {
                seenQualities.add(quality);
                videoInfo.formats.push({
                    formatId: format.format_id,
                    quality: qualityLabel,
                    height: format.height,
                    ext: format.ext || 'mp4',
                    filesize: format.filesize || format.filesize_approx || 0,
                    fps: format.fps,
                    needsMerge: false,
                });
            }
        });

        // Sort by height descending
        videoInfo.formats.sort((a, b) => (b.height || 0) - (a.height || 0));

        // If no formats found, add best option
        if (videoInfo.formats.length === 0) {
            const bestVideo = output.formats
                .filter(f => f.vcodec !== 'none')
                .sort((a, b) => (b.height || 0) - (a.height || 0))[0];

            if (bestVideo) {
                const videoSize = bestVideo.filesize || bestVideo.filesize_approx || 0;
                videoInfo.formats.push({
                    formatId: 'best',
                    quality: `${bestVideo.height}p (best)`,
                    height: bestVideo.height,
                    ext: 'mp4',
                    filesize: videoSize + audioSize,
                    fps: bestVideo.fps,
                });
            }
        }

        res.json(videoInfo);

    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({
            error: 'Failed to fetch video information',
            message: error.message
        });
    }
});

// Download video endpoint
app.post('/api/download', async (req, res) => {
    try {
        const { url, formatId, expectedSize } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'YouTube URL is required' });
        }

        // Check if URL is blocked
        const urlCheck = isBlockedUrl(url);
        if (urlCheck.blocked) {
            return res.status(403).json({ error: urlCheck.reason });
        }

        console.log('Starting download for:', url, 'format:', formatId);

        // Get video info for filename
        const info = await ytDlp(url, { dumpJson: true });
        
        // Check content again before download
        const contentCheck = isBlockedContent(info);
        if (contentCheck.blocked) {
            return res.status(403).json({ error: contentCheck.reason });
        }

        const filename = `${info.title.replace(/[^\w\s-]/g, '').trim()}.mp4`;

        console.log('Requested format:', formatId);

        // Calculate combined filesize for video + audio
        let filesize = expectedSize || 0;
        
        if (!filesize) {
            // Find video format
            const videoFormat = info.formats.find(f => f.format_id === formatId);
            if (videoFormat) {
                filesize = videoFormat.filesize || videoFormat.filesize_approx || 0;
                console.log('Video format size:', filesize);
                
                // If this is a video-only format, we need to add audio size
                if (videoFormat.acodec === 'none' || !videoFormat.acodec) {
                    // Find the best audio format
                    const audioFormat = info.formats
                        .filter(f => f.vcodec === 'none' && f.acodec !== 'none')
                        .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
                    
                    if (audioFormat) {
                        const audioSize = audioFormat.filesize || audioFormat.filesize_approx || 0;
                        console.log('Audio format size:', audioSize);
                        filesize += audioSize;
                    }
                }
            }
        }

        console.log('Downloading:', filename, 'Total estimated size:', filesize);

        // Set response headers
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'video/mp4');
        // Send expected size as custom header (more reliable than Content-Length for streaming)
        if (filesize > 0) {
            res.setHeader('X-Expected-Size', filesize.toString());
            res.setHeader('Content-Length', filesize);
        }

        // Use yt-dlp to download and stream
        // Use bestvideo+bestaudio format spec for better compatibility
        let formatSpec = formatId || 'best';
        if (formatId && formatId !== 'best') {
            // Use the specific video format + best audio
            formatSpec = `${formatId}+bestaudio/best`;
        }

        const ytDlpProcess = ytDlp.exec(url, {
            format: formatSpec,
            output: '-', // Output to stdout
            noWarnings: true,
            noCallHome: true,
            mergeOutputFormat: 'mp4',
        });

        // Pipe the video stream to response
        ytDlpProcess.stdout.pipe(res);

        // Handle errors
        ytDlpProcess.stderr.on('data', (data) => {
            console.error('yt-dlp stderr:', data.toString());
        });

        ytDlpProcess.on('error', (error) => {
            console.error('Process error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Download failed', message: error.message });
            }
        });

        ytDlpProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`yt-dlp exited with code ${code}`);
            } else {
                console.log('Download completed successfully');
            }
        });

    } catch (error) {
        console.error('Error downloading video:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to download video',
                message: error.message
            });
        }
    }
});

// Download thumbnail
app.post('/api/download-thumbnail', async (req, res) => {
    try {
        const { url, videoId, title } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'Thumbnail URL is required' });
        }

        console.log('Downloading thumbnail:', url);

        // Try multiple thumbnail qualities for YouTube
        let thumbnailUrls = [url];
        if (videoId) {
            thumbnailUrls = [
                `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
                `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
                url
            ];
        }

        let imageBuffer = null;
        for (const thumbUrl of thumbnailUrls) {
            try {
                const response = await fetch(thumbUrl);
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    // Check if it's actually an image (not a placeholder)
                    if (contentType && contentType.startsWith('image/')) {
                        imageBuffer = await response.arrayBuffer();
                        // Check if image is larger than placeholder (usually < 1KB)
                        if (imageBuffer.byteLength > 5000) {
                            break;
                        }
                    }
                }
            } catch (e) {
                continue;
            }
        }

        if (!imageBuffer) {
            return res.status(404).json({ error: 'Thumbnail not found' });
        }

        const filename = `${(title || 'thumbnail').replace(/[^a-zA-Z0-9]/g, '_')}_thumbnail.jpg`;
        
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(Buffer.from(imageBuffer));

    } catch (error) {
        console.error('Thumbnail download error:', error);
        res.status(500).json({ error: 'Failed to download thumbnail' });
    }
});

// Get playlist information
app.post('/api/playlist-info', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'Playlist URL is required' });
        }

        console.log('Fetching playlist info for:', url);

        // Use yt-dlp-exec's exec method which handles the binary path correctly
        const ytDlpProcess = ytDlp.exec(url, {
            dumpJson: true,
            flatPlaylist: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
        });

        let stdout = '';
        let stderr = '';
        let responseSent = false;

        ytDlpProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        ytDlpProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        ytDlpProcess.on('close', (code) => {
            if (responseSent) return;
            
            if (code !== 0 && !stdout) {
                console.error('yt-dlp stderr:', stderr);
                responseSent = true;
                return res.status(500).json({
                    error: 'Failed to fetch playlist information',
                    message: stderr || 'yt-dlp process failed'
                });
            }

            try {
                // Parse each line as a separate JSON object
                const lines = stdout.trim().split('\n').filter(line => line.trim());
                const videos = [];
                let playlistTitle = 'YouTube Playlist';
                let playlistChannel = 'Unknown';
                let playlistId = 'playlist';

                for (const line of lines) {
                    try {
                        const entry = JSON.parse(line);
                        
                        // Check if this is a playlist metadata entry or video entry
                        if (entry._type === 'playlist') {
                            playlistTitle = entry.title || playlistTitle;
                            playlistChannel = entry.uploader || entry.channel || playlistChannel;
                            playlistId = entry.id || playlistId;
                        } else {
                            // This is a video entry
                            videos.push({
                                id: entry.id || entry.url?.split('v=')[1] || `video_${videos.length + 1}`,
                                title: entry.title || `Video ${videos.length + 1}`,
                                duration: entry.duration || 0,
                                thumbnail: entry.thumbnails?.[0]?.url || null,
                                channel: entry.uploader || entry.channel || playlistChannel
                            });
                        }
                    } catch (parseErr) {
                        console.warn('Failed to parse line:', line.substring(0, 100));
                    }
                }

                const playlistData = {
                    id: playlistId,
                    title: playlistTitle,
                    channel: playlistChannel,
                    thumbnail: videos[0]?.thumbnail || null,
                    videoCount: videos.length,
                    videos: videos
                };

                console.log(`Found ${playlistData.videoCount} videos in playlist`);
                responseSent = true;
                res.json(playlistData);

            } catch (parseError) {
                console.error('Error parsing playlist data:', parseError);
                if (!responseSent) {
                    responseSent = true;
                    res.status(500).json({
                        error: 'Failed to parse playlist information',
                        message: parseError.message
                    });
                }
            }
        });

        ytDlpProcess.on('error', (error) => {
            if (responseSent) return;
            console.error('Failed to run yt-dlp:', error);
            responseSent = true;
            res.status(500).json({
                error: 'Failed to run yt-dlp',
                message: error.message
            });
        });

    } catch (error) {
        console.error('Error fetching playlist info:', error);
        res.status(500).json({
            error: 'Failed to fetch playlist information',
            message: error.message
        });
    }
});

// Download a single video from playlist
app.post('/api/download-playlist-video', async (req, res) => {
    try {
        const { url, quality, filename, options } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        console.log('Downloading playlist video:', url, 'Quality:', quality);

        // Determine format based on quality
        let formatSpec;
        switch (quality) {
            case 'audio':
                formatSpec = 'bestaudio/best';
                break;
            case 'best':
                formatSpec = 'bestvideo+bestaudio/best';
                break;
            case '1080':
                formatSpec = 'bestvideo[height<=1080]+bestaudio/best[height<=1080]';
                break;
            case '720':
                formatSpec = 'bestvideo[height<=720]+bestaudio/best[height<=720]';
                break;
            case '480':
                formatSpec = 'bestvideo[height<=480]+bestaudio/best[height<=480]';
                break;
            case '360':
                formatSpec = 'bestvideo[height<=360]+bestaudio/best[height<=360]';
                break;
            default:
                formatSpec = 'bestvideo[height<=720]+bestaudio/best';
        }

        // Set response headers
        const ext = quality === 'audio' ? 'mp3' : 'mp4';
        const safeFilename = (filename || 'video').replace(/[^\w\s.-]/g, '').trim();
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.${ext}"`);
        res.setHeader('Content-Type', quality === 'audio' ? 'audio/mpeg' : 'video/mp4');

        // Build yt-dlp options
        const ytDlpOptions = {
            format: formatSpec,
            output: '-',
            noWarnings: true,
            noCallHome: true,
        };

        // Add optional features
        if (quality === 'audio') {
            ytDlpOptions.extractAudio = true;
            ytDlpOptions.audioFormat = 'mp3';
        } else {
            ytDlpOptions.mergeOutputFormat = 'mp4';
        }

        if (options?.subtitles) {
            ytDlpOptions.writeSub = true;
            ytDlpOptions.subLang = 'en';
        }

        if (options?.thumbnail) {
            ytDlpOptions.embedThumbnail = true;
        }

        if (options?.metadata) {
            ytDlpOptions.addMetadata = true;
        }

        const ytDlpProcess = ytDlp.exec(url, ytDlpOptions);

        // Pipe the stream to response
        ytDlpProcess.stdout.pipe(res);

        ytDlpProcess.stderr.on('data', (data) => {
            console.error('yt-dlp stderr:', data.toString());
        });

        ytDlpProcess.on('error', (error) => {
            console.error('Process error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Download failed', message: error.message });
            }
        });

        ytDlpProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`yt-dlp exited with code ${code}`);
            } else {
                console.log('Playlist video download completed');
            }
        });

    } catch (error) {
        console.error('Error downloading playlist video:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to download video',
                message: error.message
            });
        }
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════╗
║   🌊 AquaSeal API Server Running 🌊   ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                            ║
║  Status: Active                        ║
║  Endpoints:                            ║
║    GET  /api/health                    ║
║    POST /api/video-info                ║
║    POST /api/download                  ║
║    POST /api/playlist-info             ║
║    POST /api/download-playlist-video   ║
╚════════════════════════════════════════╝
    `);
});
