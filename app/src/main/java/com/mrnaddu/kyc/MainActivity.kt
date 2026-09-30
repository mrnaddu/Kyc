package com.mrnaddu.kyc

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.mrnaddu.kyc.ui.NannaSevaApp
import com.mrnaddu.kyc.ui.theme.KycTheme

class MainActivity : ComponentActivity() {
    private val notificationPermissionRequest = 1002
    private var appUpdater: AppUpdater? = null
    private var updateAvailableVersion by mutableStateOf<String?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.parseColor("#F8FAFC")

        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true
        insetsController.isAppearanceLightNavigationBars = true

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), notificationPermissionRequest)
            }
        }

        appUpdater = AppUpdater(this) { version, _ ->
            updateAvailableVersion = version
        }
        appUpdater?.checkForUpdates(false)

        setContent {
            KycTheme {
                NannaSevaApp(
                    onCheckForUpdates = { appUpdater?.checkForUpdates(true) },
                    updateAvailableVersion = updateAvailableVersion
                )
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        appUpdater?.shutdown()
    }
}
