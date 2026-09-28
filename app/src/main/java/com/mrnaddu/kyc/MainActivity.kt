package com.mrnaddu.kyc

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.displayCutout
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.webkit.WebViewAssetLoader
import com.mrnaddu.kyc.ui.theme.KycTheme
import com.mrnaddu.kyc.ui.utils.appBarScrollBehavior

class MainActivity : ComponentActivity() {
    private val cameraPermissionRequest = 1001
    private val notificationPermissionRequest = 1002

    private lateinit var webView: WebView
    private var pendingPermissionRequest: PermissionRequest? = null
    private var nativeKycBridge: NativeKycBridge? = null
    private var appUpdater: AppUpdater? = null
    private var currentLanguage by mutableStateOf("EN")
    private var initialUpdateChecked = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.WHITE

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true
        insetsController.isAppearanceLightNavigationBars = true

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), notificationPermissionRequest)
            }
        }

        setContent {
            KarnatakaKycApp()
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @androidx.compose.runtime.Composable
    private fun KarnatakaKycApp() {
        KycTheme {
            val topAppBarScrollBehavior = appBarScrollBehavior()
            Scaffold(
                modifier = Modifier
                    .fillMaxSize()
                    .nestedScroll(topAppBarScrollBehavior.nestedScrollConnection),
                containerColor = MaterialTheme.colorScheme.background,
                contentWindowInsets = WindowInsets.systemBars.only(
                    WindowInsetsSides.Horizontal + WindowInsetsSides.Bottom,
                ),
                topBar = {
                    TopAppBar(
                        modifier = Modifier.windowInsetsPadding(
                            WindowInsets.displayCutout.only(WindowInsetsSides.Horizontal),
                        ),
                        title = {
                            Text(
                                text = if (currentLanguage == "KN") {
                                    "ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ"
                                } else {
                                    "Ration Card e-KYC"
                                },
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                            )
                        },
                        navigationIcon = {
                            IconButton(onClick = { runWebScript("handleNavHome()") }) {
                                Icon(
                                    imageVector = Icons.Filled.Home,
                                    contentDescription = "Home",
                                )
                            }
                        },
                        actions = {
                            TextButton(onClick = { toggleLanguage() }) {
                                Text(
                                    text = if (currentLanguage == "EN") "ಕನ್ನಡ" else "English",
                                    maxLines = 1,
                                    color = MaterialTheme.colorScheme.primary,
                                    fontWeight = FontWeight.Bold,
                                )
                            }
                        },
                        colors = TopAppBarDefaults.topAppBarColors(
                            containerColor = MaterialTheme.colorScheme.surface,
                            titleContentColor = MaterialTheme.colorScheme.onSurface,
                            navigationIconContentColor = MaterialTheme.colorScheme.onSurface,
                            actionIconContentColor = MaterialTheme.colorScheme.onSurface,
                        ),
                        scrollBehavior = topAppBarScrollBehavior,
                    )
                },
            ) { contentPadding ->
                AndroidView(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(contentPadding)
                        .windowInsetsPadding(
                            WindowInsets.displayCutout.only(WindowInsetsSides.Horizontal),
                        ),
                    factory = { createWebView() },
                )
            }

            BackHandler {
                if (::webView.isInitialized) {
                    webView.evaluateJavascript(
                        "(function(){if(typeof appState!=='undefined'&&appState.step>0){handleNavBack();return true;}return false;})()",
                    ) { handled ->
                        if (handled != "true") finish()
                    }
                } else {
                    finish()
                }
            }
        }
    }

    private fun createWebView(): WebView {
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        return WebView(this).also { view ->
            webView = view
            view.setBackgroundColor(Color.rgb(248, 250, 252))

            view.settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = false
                useWideViewPort = true
                loadWithOverviewMode = false
                textZoom = 100
                mediaPlaybackRequiresUserGesture = false
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            }

            val updater = AppUpdater(this, view)
            appUpdater = updater
            nativeKycBridge = NativeKycBridge(this, view, updater)
            view.addJavascriptInterface(nativeKycBridge!!, "AndroidKyc")

            view.webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(
                    webView: WebView,
                    request: WebResourceRequest,
                ): Boolean {
                    val uri = request.url
                    if (uri.host == "appassets.androidplatform.net") return false
                    startActivity(Intent(Intent.ACTION_VIEW, uri))
                    return true
                }

                override fun shouldInterceptRequest(
                    webView: WebView,
                    request: WebResourceRequest,
                ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(Uri.parse(request.url.toString()))
                        ?: super.shouldInterceptRequest(webView, request)
                }

                override fun onPageFinished(webView: WebView, url: String) {
                    super.onPageFinished(webView, url)
                    runWebScript(
                        "document.documentElement.classList.add('native-shell');" +
                            "applyLanguage('$currentLanguage');",
                    )
                    if (!initialUpdateChecked) {
                        initialUpdateChecked = true
                        view.postDelayed({
                            if (!isFinishing && !isDestroyed) {
                                appUpdater?.checkForUpdates(false)
                            }
                        }, 2000)
                    }
                }
            }

            view.webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest) {
                    runOnUiThread { handleWebPermissionRequest(request) }
                }
            }

            view.loadUrl("https://appassets.androidplatform.net/assets/index.html")
        }
    }

    private fun toggleLanguage() {
        currentLanguage = if (currentLanguage == "EN") "KN" else "EN"
        runWebScript("applyLanguage('$currentLanguage')")
    }

    private fun runWebScript(script: String) {
        if (::webView.isInitialized) webView.evaluateJavascript(script, null)
    }

    private fun handleWebPermissionRequest(request: PermissionRequest) {
        val requestsCamera = request.resources.any {
            it == PermissionRequest.RESOURCE_VIDEO_CAPTURE
        }
        if (!requestsCamera) {
            request.deny()
            return
        }

        if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            request.grant(arrayOf(PermissionRequest.RESOURCE_VIDEO_CAPTURE))
        } else {
            pendingPermissionRequest = request
            requestPermissions(arrayOf(Manifest.permission.CAMERA), cameraPermissionRequest)
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray,
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        val pendingRequest = pendingPermissionRequest
        if (requestCode != cameraPermissionRequest || pendingRequest == null) return

        if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            pendingRequest.grant(arrayOf(PermissionRequest.RESOURCE_VIDEO_CAPTURE))
        } else {
            pendingRequest.deny()
        }
        pendingPermissionRequest = null
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        if (intent.getBooleanExtra("trigger_update_check", false)) {
            appUpdater?.checkForUpdates(true)
        }
    }

    override fun onDestroy() {
        pendingPermissionRequest?.deny()
        pendingPermissionRequest = null
        nativeKycBridge?.shutdown()
        appUpdater?.shutdown()
        if (::webView.isInitialized) webView.destroy()
        super.onDestroy()
    }
}
