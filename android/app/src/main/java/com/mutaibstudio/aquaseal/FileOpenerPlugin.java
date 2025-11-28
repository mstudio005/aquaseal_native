package com.mutaibstudio.aquaseal;

import android.content.Intent;
import android.net.Uri;
import android.webkit.MimeTypeMap;
import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

@CapacitorPlugin(name = "FileOpener")
public class FileOpenerPlugin extends Plugin {

    @PluginMethod
    public void openFile(PluginCall call) {
        String filePath = call.getString("path");
        String mimeType = call.getString("mimeType", "*/*");
        
        if (filePath == null || filePath.isEmpty()) {
            call.reject("File path is required");
            return;
        }
        
        try {
            File file = new File(filePath);
            
            if (!file.exists()) {
                call.reject("File does not exist: " + filePath);
                return;
            }
            
            // Get MIME type if not provided
            if (mimeType.equals("*/*")) {
                String extension = MimeTypeMap.getFileExtensionFromUrl(filePath);
                if (extension != null) {
                    String detectedMime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.toLowerCase());
                    if (detectedMime != null) {
                        mimeType = detectedMime;
                    }
                }
            }
            
            // Use FileProvider for Android 7+ (API 24+)
            Uri fileUri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                file
            );
            
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(fileUri, mimeType);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            
            // Check if there's an app to handle this intent
            if (intent.resolveActivity(getContext().getPackageManager()) != null) {
                getContext().startActivity(intent);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("path", filePath);
                call.resolve(result);
            } else {
                // Try with chooser
                Intent chooser = Intent.createChooser(intent, "Open with");
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(chooser);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("path", filePath);
                call.resolve(result);
            }
            
        } catch (Exception e) {
            call.reject("Failed to open file: " + e.getMessage(), e);
        }
    }
    
    @PluginMethod
    public void openUrl(PluginCall call) {
        String url = call.getString("url");
        
        if (url == null || url.isEmpty()) {
            call.reject("URL is required");
            return;
        }
        
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            
            JSObject result = new JSObject();
            result.put("success", true);
            result.put("url", url);
            call.resolve(result);
            
        } catch (Exception e) {
            call.reject("Failed to open URL: " + e.getMessage(), e);
        }
    }
}
