package com.mutaibstudio.aquaseal;

import android.os.Bundle;
import com.chaquo.python.Python;
import com.chaquo.python.android.AndroidPlatform;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Initialize Python before super.onCreate()
        if (!Python.isStarted()) {
            Python.start(new AndroidPlatform(this));
        }
        
        // Register the Python Bridge plugin
        registerPlugin(PythonBridgePlugin.class);
        
        super.onCreate(savedInstanceState);
    }
}
