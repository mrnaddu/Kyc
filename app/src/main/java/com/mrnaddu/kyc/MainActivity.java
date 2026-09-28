package com.mrnaddu.kyc;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;

public class MainActivity extends Activity {
    private static final int CAMERA_PERMISSION_REQUEST = 1001;

    private WebView webView;
    private PermissionRequest pendingPermissionRequest;
    private NativeKycBridge nativeKycBridge;
    private AppUpdater appUpdater;
    private Insets safeArea = Insets.NONE;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        getWindow().setStatusBarColor(Color.rgb(15, 23, 42));
        getWindow().setNavigationBarColor(Color.rgb(15, 23, 42));

        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        insetsController.setAppearanceLightStatusBars(false);
        insetsController.setAppearanceLightNavigationBars(false);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(15, 23, 42));
        ViewCompat.setOnApplyWindowInsetsListener(webView, (view, windowInsets) -> {
            safeArea = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );
            applySafeAreaToWebView();
            return WindowInsetsCompat.CONSUMED;
        });
        setContentView(webView);
        ViewCompat.requestApplyInsets(webView);
        configureWebView();
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    private void applySafeAreaToWebView() {
        float density = getResources().getDisplayMetrics().density;
        int top = Math.round(safeArea.top / density);
        int right = Math.round(safeArea.right / density);
        int bottom = Math.round(safeArea.bottom / density);
        int left = Math.round(safeArea.left / density);
        String script = "document.documentElement.style.setProperty('--safe-area-top','" + top + "px');"
            + "document.documentElement.style.setProperty('--safe-area-right','" + right + "px');"
            + "document.documentElement.style.setProperty('--safe-area-bottom','" + bottom + "px');"
            + "document.documentElement.style.setProperty('--safe-area-left','" + left + "px');";
        webView.post(() -> webView.evaluateJavascript(script, null));
    }

    private void configureWebView() {
        WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        settings.setTextZoom(100);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        appUpdater = new AppUpdater(this);
        nativeKycBridge = new NativeKycBridge(this, webView, appUpdater);
        webView.addJavascriptInterface(nativeKycBridge, "AndroidKyc");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("appassets.androidplatform.net".equals(uri.getHost())) {
                    return false;
                }
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                WebResourceResponse response = assetLoader.shouldInterceptRequest(Uri.parse(request.getUrl().toString()));
                return response != null ? response : super.shouldInterceptRequest(view, request);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                applySafeAreaToWebView();
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> handleWebPermissionRequest(request));
            }
        });
    }

    private void handleWebPermissionRequest(PermissionRequest request) {
        boolean requestsCamera = false;
        for (String resource : request.getResources()) {
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)) {
                requestsCamera = true;
                break;
            }
        }

        if (!requestsCamera) {
            request.deny();
            return;
        }

        if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            request.grant(new String[] { PermissionRequest.RESOURCE_VIDEO_CAPTURE });
        } else {
            pendingPermissionRequest = request;
            requestPermissions(new String[] { Manifest.permission.CAMERA }, CAMERA_PERMISSION_REQUEST);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != CAMERA_PERMISSION_REQUEST || pendingPermissionRequest == null) {
            return;
        }

        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            pendingPermissionRequest.grant(new String[] { PermissionRequest.RESOURCE_VIDEO_CAPTURE });
        } else {
            pendingPermissionRequest.deny();
        }
        pendingPermissionRequest = null;
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (pendingPermissionRequest != null) {
            pendingPermissionRequest.deny();
            pendingPermissionRequest = null;
        }
        if (nativeKycBridge != null) {
            nativeKycBridge.shutdown();
        }
        if (appUpdater != null) {
            appUpdater.shutdown();
        }
        webView.destroy();
        super.onDestroy();
    }
}
