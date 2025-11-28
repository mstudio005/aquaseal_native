package com.mutaibstudio.aquaseal;

import android.os.Environment;
import android.util.Log;

import com.chaquo.python.PyObject;
import com.chaquo.python.Python;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Capacitor Plugin to bridge JavaScript calls to Python (yt-dlp)
 */
@CapacitorPlugin(name = "PythonBridge")
public class PythonBridgePlugin extends Plugin {
    
    private static final String TAG = "PythonBridge";
    private Python py;
    private PyObject downloaderModule;
    private ExecutorService executor;
    
    @Override
    public void load() {
        super.load();
        executor = Executors.newSingleThreadExecutor();
        
        // Initialize Python if not already started
        if (!Python.isStarted()) {
            Python.start(new com.chaquo.python.android.AndroidPlatform(getContext()));
        }
        py = Python.getInstance();
        downloaderModule = py.getModule("downloader");
        
        Log.i(TAG, "PythonBridge plugin loaded and Python initialized");
    }
    
    /**
     * Get video information from a URL
     */
    @PluginMethod
    public void getVideoInfo(PluginCall call) {
        String url = call.getString("url");
        
        if (url == null || url.isEmpty()) {
            call.reject("URL is required");
            return;
        }
        
        executor.execute(() -> {
            try {
                Log.d(TAG, "Getting video info for: " + url);
                PyObject result = downloaderModule.callAttr("get_video_info", url);
                String jsonResult = result.toString();
                
                JSONObject json = new JSONObject(jsonResult);
                
                if (json.has("error")) {
                    call.reject(json.getString("error"));
                } else {
                    JSObject ret = new JSObject();
                    ret.put("id", json.optString("id", ""));
                    ret.put("title", json.optString("title", "Unknown"));
                    ret.put("channel", json.optString("channel", "Unknown"));
                    ret.put("duration", json.optInt("duration", 0));
                    ret.put("thumbnail", json.optString("thumbnail", ""));
                    ret.put("description", json.optString("description", ""));
                    ret.put("viewCount", json.optLong("viewCount", 0));
                    ret.put("likeCount", json.optLong("likeCount", 0));
                    
                    // Add formats array
                    if (json.has("formats")) {
                        ret.put("formats", json.getJSONArray("formats"));
                    }
                    
                    call.resolve(ret);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error getting video info", e);
                call.reject("Failed to get video info: " + e.getMessage());
            }
        });
    }
    
    /**
     * Get playlist information from a URL
     */
    @PluginMethod
    public void getPlaylistInfo(PluginCall call) {
        String url = call.getString("url");
        
        if (url == null || url.isEmpty()) {
            call.reject("URL is required");
            return;
        }
        
        executor.execute(() -> {
            try {
                Log.d(TAG, "Getting playlist info for: " + url);
                PyObject result = downloaderModule.callAttr("get_playlist_info", url);
                String jsonResult = result.toString();
                
                JSONObject json = new JSONObject(jsonResult);
                
                if (json.has("error")) {
                    call.reject(json.getString("error"));
                } else {
                    JSObject ret = new JSObject();
                    ret.put("id", json.optString("id", ""));
                    ret.put("title", json.optString("title", "Playlist"));
                    ret.put("channel", json.optString("channel", "Unknown"));
                    ret.put("videoCount", json.optInt("videoCount", 0));
                    
                    if (json.has("videos")) {
                        ret.put("videos", json.getJSONArray("videos"));
                    }
                    
                    call.resolve(ret);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error getting playlist info", e);
                call.reject("Failed to get playlist info: " + e.getMessage());
            }
        });
    }
    
    /**
     * Download a video
     */
    @PluginMethod
    public void downloadVideo(PluginCall call) {
        String url = call.getString("url");
        String formatId = call.getString("formatId", "best");
        
        if (url == null || url.isEmpty()) {
            call.reject("URL is required");
            return;
        }
        
        executor.execute(() -> {
            try {
                Log.d(TAG, "Downloading video: " + url + " with format: " + formatId);
                
                // Get download directory
                File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                if (!downloadDir.exists()) {
                    downloadDir = getContext().getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                }
                if (downloadDir == null) {
                    downloadDir = getContext().getFilesDir();
                }
                
                String outputPath = downloadDir.getAbsolutePath();
                Log.d(TAG, "Download directory: " + outputPath);
                
                PyObject result = downloaderModule.callAttr("download_video", url, outputPath, formatId);
                String jsonResult = result.toString();
                
                JSONObject json = new JSONObject(jsonResult);
                
                if (json.has("error")) {
                    call.reject(json.getString("error"));
                } else {
                    JSObject ret = new JSObject();
                    ret.put("success", json.optBoolean("success", true));
                    ret.put("filename", json.optString("filename", ""));
                    ret.put("title", json.optString("title", ""));
                    ret.put("duration", json.optInt("duration", 0));
                    
                    call.resolve(ret);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error downloading video", e);
                call.reject("Failed to download video: " + e.getMessage());
            }
        });
    }
    
    /**
     * Download a thumbnail
     */
    @PluginMethod
    public void downloadThumbnail(PluginCall call) {
        String url = call.getString("url");
        String videoId = call.getString("videoId");
        
        if (videoId == null || videoId.isEmpty()) {
            call.reject("Video ID is required");
            return;
        }
        
        executor.execute(() -> {
            try {
                Log.d(TAG, "Downloading thumbnail for: " + videoId);
                
                File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
                if (!downloadDir.exists()) {
                    downloadDir = getContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
                }
                if (downloadDir == null) {
                    downloadDir = getContext().getFilesDir();
                }
                
                String outputPath = downloadDir.getAbsolutePath();
                
                PyObject result = downloaderModule.callAttr("download_thumbnail", 
                    url != null ? url : "", videoId, outputPath);
                String jsonResult = result.toString();
                
                JSONObject json = new JSONObject(jsonResult);
                
                if (json.has("error")) {
                    call.reject(json.getString("error"));
                } else {
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    ret.put("path", json.optString("path", ""));
                    
                    call.resolve(ret);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error downloading thumbnail", e);
                call.reject("Failed to download thumbnail: " + e.getMessage());
            }
        });
    }
    
    /**
     * Get the download directory path
     */
    @PluginMethod
    public void getDownloadPath(PluginCall call) {
        try {
            File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            if (!downloadDir.exists()) {
                downloadDir = getContext().getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
            }
            if (downloadDir == null) {
                downloadDir = getContext().getFilesDir();
            }
            
            JSObject ret = new JSObject();
            ret.put("path", downloadDir.getAbsolutePath());
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to get download path: " + e.getMessage());
        }
    }
    
    /**
     * Test Python connection
     */
    @PluginMethod
    public void testPython(PluginCall call) {
        executor.execute(() -> {
            try {
                PyObject result = downloaderModule.callAttr("test");
                
                JSObject ret = new JSObject();
                ret.put("result", result.toString());
                ret.put("success", true);
                
                call.resolve(ret);
            } catch (Exception e) {
                call.reject("Python test failed: " + e.getMessage());
            }
        });
    }
}
