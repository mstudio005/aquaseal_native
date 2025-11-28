"""
AquaSeal Video Downloader - Python Module
Uses yt-dlp to extract video information and download videos
"""

import json
import os
import yt_dlp


def get_video_info(url):
    """
    Extract video information from a URL
    Returns a JSON string with video details
    """
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'skip_download': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            if info is None:
                return json.dumps({'error': 'Could not extract video information'})
            
            # Check if it's a playlist
            if info.get('_type') == 'playlist':
                return json.dumps({'error': 'This is a playlist. Use get_playlist_info instead.'})
            
            # Extract available formats
            formats = []
            if 'formats' in info:
                for f in info['formats']:
                    if f.get('vcodec') != 'none':  # Has video
                        format_info = {
                            'formatId': f.get('format_id', ''),
                            'ext': f.get('ext', 'mp4'),
                            'quality': f'{f.get("height", "?")}p' if f.get('height') else f.get('format_note', 'Unknown'),
                            'filesize': f.get('filesize') or f.get('filesize_approx') or 0,
                            'vcodec': f.get('vcodec', ''),
                            'acodec': f.get('acodec', ''),
                            'fps': f.get('fps', 0),
                        }
                        formats.append(format_info)
            
            # Sort formats by quality (height)
            formats.sort(key=lambda x: int(x['quality'].replace('p', '').replace('?', '0')) if x['quality'].replace('p', '').replace('?', '0').isdigit() else 0, reverse=True)
            
            # Remove duplicates based on quality
            seen_qualities = set()
            unique_formats = []
            for f in formats:
                if f['quality'] not in seen_qualities:
                    seen_qualities.add(f['quality'])
                    unique_formats.append(f)
            
            result = {
                'id': info.get('id', ''),
                'title': info.get('title', 'Unknown'),
                'channel': info.get('uploader', info.get('channel', 'Unknown')),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', ''),
                'description': info.get('description', '')[:500] if info.get('description') else '',
                'viewCount': info.get('view_count', 0),
                'likeCount': info.get('like_count', 0),
                'formats': unique_formats[:10],  # Limit to top 10 formats
            }
            
            return json.dumps(result)
            
    except Exception as e:
        return json.dumps({'error': str(e)})


def get_playlist_info(url):
    """
    Extract playlist information from a URL
    Returns a JSON string with playlist details
    """
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,  # Don't download individual videos yet
            'skip_download': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            if info is None:
                return json.dumps({'error': 'Could not extract playlist information'})
            
            videos = []
            entries = info.get('entries', [])
            
            for i, entry in enumerate(entries):
                if entry is None:
                    continue
                    
                video_info = {
                    'index': i + 1,
                    'id': entry.get('id', ''),
                    'title': entry.get('title', f'Video {i + 1}'),
                    'channel': entry.get('uploader', entry.get('channel', 'Unknown')),
                    'duration': entry.get('duration', 0),
                    'thumbnail': entry.get('thumbnail', ''),
                    'url': entry.get('url', f"https://www.youtube.com/watch?v={entry.get('id', '')}"),
                }
                videos.append(video_info)
            
            result = {
                'id': info.get('id', ''),
                'title': info.get('title', 'Playlist'),
                'channel': info.get('uploader', info.get('channel', 'Unknown')),
                'videoCount': len(videos),
                'videos': videos,
            }
            
            return json.dumps(result)
            
    except Exception as e:
        return json.dumps({'error': str(e)})


def download_video(url, output_dir, format_id='best', progress_callback=None):
    """
    Download a video to the specified directory
    Returns a JSON string with download result
    """
    try:
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)
        
        # Build format selector
        if format_id == 'best':
            format_selector = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
        elif format_id == 'audio':
            format_selector = 'bestaudio[ext=m4a]/bestaudio'
        else:
            format_selector = f'{format_id}+bestaudio[ext=m4a]/{format_id}/best'
        
        output_template = os.path.join(output_dir, '%(title)s.%(ext)s')
        
        ydl_opts = {
            'format': format_selector,
            'outtmpl': output_template,
            'quiet': True,
            'no_warnings': True,
            'merge_output_format': 'mp4',
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4',
            }] if format_id != 'audio' else [],
        }
        
        # Add progress hook if callback provided
        if progress_callback:
            def progress_hook(d):
                if d['status'] == 'downloading':
                    progress = {
                        'status': 'downloading',
                        'downloaded': d.get('downloaded_bytes', 0),
                        'total': d.get('total_bytes') or d.get('total_bytes_estimate', 0),
                        'speed': d.get('speed', 0),
                        'eta': d.get('eta', 0),
                    }
                    progress_callback(json.dumps(progress))
                elif d['status'] == 'finished':
                    progress_callback(json.dumps({'status': 'finished', 'filename': d.get('filename', '')}))
            
            ydl_opts['progress_hooks'] = [progress_hook]
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            
            if info is None:
                return json.dumps({'error': 'Download failed'})
            
            # Find the downloaded file
            filename = ydl.prepare_filename(info)
            if not filename.endswith('.mp4') and format_id != 'audio':
                filename = os.path.splitext(filename)[0] + '.mp4'
            
            result = {
                'success': True,
                'filename': filename,
                'title': info.get('title', 'Unknown'),
                'duration': info.get('duration', 0),
            }
            
            return json.dumps(result)
            
    except Exception as e:
        return json.dumps({'error': str(e)})


def get_download_path():
    """
    Get the download directory path for Android
    Returns the path to use for downloads
    """
    # On Android with Chaquopy, we use the app's internal storage
    home = os.environ.get('HOME', '/data/data/com.mutaibstudio.aquaseal/files')
    download_dir = os.path.join(home, 'Downloads')
    os.makedirs(download_dir, exist_ok=True)
    return download_dir


def download_thumbnail(url, video_id, output_dir):
    """
    Download the highest quality thumbnail for a YouTube video
    Returns a JSON string with the file path
    """
    try:
        import urllib.request
        import urllib.error
        
        os.makedirs(output_dir, exist_ok=True)
        
        # Try different quality thumbnails in order
        thumbnail_urls = [
            f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg",
            f"https://i.ytimg.com/vi/{video_id}/sddefault.jpg",
            f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
            f"https://i.ytimg.com/vi/{video_id}/mqdefault.jpg",
            url,  # Fallback to provided URL
        ]
        
        output_path = os.path.join(output_dir, f"{video_id}_thumbnail.jpg")
        
        for thumb_url in thumbnail_urls:
            if not thumb_url:
                continue
            try:
                urllib.request.urlretrieve(thumb_url, output_path)
                # Check if file was downloaded
                if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                    return json.dumps({
                        'success': True,
                        'path': output_path,
                    })
            except urllib.error.HTTPError:
                continue
        
        return json.dumps({'error': 'Could not download thumbnail'})
        
    except Exception as e:
        return json.dumps({'error': str(e)})


# Test function
def test():
    """Test the downloader module"""
    result = get_video_info("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    return result
