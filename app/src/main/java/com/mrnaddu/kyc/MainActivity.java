package com.mrnaddu.kyc;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final int CAMERA_PERMISSION_REQUEST = 1001;

    private WebView webView;
    private PermissionRequest pendingPermissionRequest;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(15, 23, 42));
        getWindow().setNavigationBarColor(Color.rgb(15, 23, 42));

        webView = new WebView(this);
        setContentView(webView);
        configureWebView();
        webView.loadUrl(BuildConfig.APP_URL);
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showConnectionError();
                }
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

    private void showConnectionError() {
        String html = "<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'>"
            + "<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0f172a;color:#e2e8f0;"
            + "font-family:system-ui;padding:24px;box-sizing:border-box}.card{max-width:360px;text-align:center}h1{font-size:22px;color:#fff}"
            + "p{line-height:1.55;color:#94a3b8}.url{font-family:monospace;color:#fbbf24;word-break:break-all}button{border:0;border-radius:12px;"
            + "padding:13px 24px;background:#fbbf24;color:#0f172a;font-weight:800;font-size:15px}</style></head><body><div class='card'>"
            + "<h1>Cannot connect to the e-KYC server</h1><p>Connect this phone to the same Wi-Fi as the computer and keep "
            + "<strong>node server.js</strong> running.</p><p class='url'>" + BuildConfig.APP_URL + "</p>"
            + "<button onclick=\"location.href='" + BuildConfig.APP_URL + "'\">Try Again</button></div></body></html>";
        webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
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
        webView.destroy();
        super.onDestroy();
    }
}
