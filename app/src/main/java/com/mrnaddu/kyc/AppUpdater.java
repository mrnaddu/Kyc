package com.mrnaddu.kyc;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.FileProvider;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

final class AppUpdater {
    private static final String LATEST_RELEASE_API = "https://api.github.com/repos/mrnaddu/Kyc/releases/latest";
    private static final String APK_FILE_NAME = "Karnataka-eKYC-update.apk";
    private static final String NOTIFICATION_CHANNEL_ID = "app_updates_channel";
    private static final int NOTIFICATION_ID = 2001;

    public interface UpdateCallback {
        void onUpdateAvailable(String version, String downloadUrl);
    }

    private final Activity activity;
    private UpdateCallback updateCallback;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final DownloadManager downloadManager;
    private long activeDownloadId = -1;

    private final BroadcastReceiver downloadReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            long completedId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            if (completedId != activeDownloadId) return;
            if (downloadSucceeded(completedId)) {
                installDownloadedApk();
            } else {
                showMessage("Update failed", "The APK download did not complete. Please try again.");
            }
            activeDownloadId = -1;
        }
    };

    AppUpdater(Activity activity) {
        this(activity, null);
    }

    AppUpdater(Activity activity, UpdateCallback callback) {
        this.activity = activity;
        this.updateCallback = callback;
        this.downloadManager = (DownloadManager) activity.getSystemService(Context.DOWNLOAD_SERVICE);
        createNotificationChannel();
        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            activity.registerReceiver(downloadReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            activity.registerReceiver(downloadReceiver, filter);
        }
    }

    void setUpdateCallback(UpdateCallback callback) {
        this.updateCallback = callback;
    }

    void checkForUpdates() {
        checkForUpdates(true);
    }

    void checkForUpdates(boolean isManual) {
        if (isManual) {
            Toast.makeText(activity, "Checking for updates…", Toast.LENGTH_SHORT).show();
        }
        executor.execute(() -> {
            try {
                JSONObject release = fetchLatestRelease();
                String latestVersion = release.optString("tag_name", "").replaceFirst("^[vV]", "");
                String apkUrl = findApkUrl(release.optJSONArray("assets"));
                String releaseBody = release.optString("body", "");
                if (latestVersion.isEmpty() || apkUrl == null) {
                    if (isManual) {
                        throw new Exception("The latest release does not contain an APK file.");
                    }
                    return;
                }

                if (compareVersions(latestVersion, BuildConfig.VERSION_NAME) <= 0) {
                    if (isManual) {
                        activity.runOnUiThread(() -> showMessage(
                            "App is up to date",
                            "You already have the latest version (" + BuildConfig.VERSION_NAME + ")."
                        ));
                    }
                    return;
                }

                activity.runOnUiThread(() -> {
                    showUpdateDialog(latestVersion, apkUrl, releaseBody);
                    showSystemNotification(latestVersion);
                    notifyWebBanner(latestVersion);
                });
            } catch (Exception exception) {
                if (isManual) {
                    String message = exception.getMessage() == null ? "Could not check GitHub Releases." : exception.getMessage();
                    activity.runOnUiThread(() -> showMessage("Update check failed", message));
                }
            }
        });
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "App Updates",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Notifications about new versions of Karnataka e-KYC");
            NotificationManager notificationManager = activity.getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    private void showSystemNotification(String latestVersion) {
        try {
            Intent intent = new Intent(activity, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            intent.putExtra("trigger_update_check", true);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                activity,
                0,
                intent,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                    ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                    : PendingIntent.FLAG_UPDATE_CURRENT
            );

            NotificationCompat.Builder builder = new NotificationCompat.Builder(activity, NOTIFICATION_CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_launcher)
                .setContentTitle("New Update Available (v" + latestVersion + ")")
                .setContentText("A new version of Karnataka e-KYC is ready to install.")
                .setStyle(new NotificationCompat.BigTextStyle()
                    .bigText("Karnataka e-KYC version " + latestVersion + " is available. Tap to open and install the update."))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(activity);
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU
                || activity.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) {
                notificationManager.notify(NOTIFICATION_ID, builder.build());
            }
        } catch (Exception ignored) {
            // Notification failed or permission denied, ignore silently.
        }
    }

    private void notifyWebBanner(String version) {
        if (updateCallback != null) {
            updateCallback.onUpdateAvailable(version, "");
        }
    }

    private JSONObject fetchLatestRelease() throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(LATEST_RELEASE_API).openConnection();
        connection.setConnectTimeout(12000);
        connection.setReadTimeout(15000);
        connection.setRequestProperty("Accept", "application/vnd.github+json");
        connection.setRequestProperty("User-Agent", "Karnataka-eKYC-Android/" + BuildConfig.VERSION_NAME);
        int status = connection.getResponseCode();
        InputStream stream = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
        if (stream == null) throw new Exception("GitHub returned an empty response.");

        StringBuilder body = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) body.append(line);
        } finally {
            connection.disconnect();
        }
        if (status >= 400) throw new Exception("GitHub update service returned HTTP " + status + ".");
        return new JSONObject(body.toString());
    }

    private String findApkUrl(JSONArray assets) {
        if (assets == null) return null;
        for (int i = 0; i < assets.length(); i++) {
            JSONObject asset = assets.optJSONObject(i);
            if (asset != null && asset.optString("name", "").toLowerCase().endsWith(".apk")) {
                return asset.optString("browser_download_url", null);
            }
        }
        return null;
    }

    private void showUpdateDialog(String latestVersion, String apkUrl, String releaseBody) {
        if (activity.isFinishing() || activity.isDestroyed()) return;

        StringBuilder message = new StringBuilder();
        message.append("A new version (v").append(latestVersion).append(") of Karnataka e-KYC is available.\n\n");
        if (releaseBody != null && !releaseBody.trim().isEmpty()) {
            String cleanBody = releaseBody.trim();
            if (cleanBody.length() > 250) {
                cleanBody = cleanBody.substring(0, 250) + "…";
            }
            message.append(cleanBody).append("\n\n");
        }
        message.append("Would you like to download and install it now?");

        new AlertDialog.Builder(activity)
            .setTitle("Update available")
            .setMessage(message.toString())
            .setNegativeButton("Later", null)
            .setPositiveButton("Update", (dialog, which) -> prepareDownload(apkUrl, latestVersion))
            .show();
    }

    private void prepareDownload(String apkUrl, String latestVersion) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            && !activity.getPackageManager().canRequestPackageInstalls()) {
            new AlertDialog.Builder(activity)
                .setTitle("Allow app updates")
                .setMessage("Android must allow this app to install its downloaded update. Enable ‘Allow from this source’, then tap Check for updates again.")
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Open settings", (dialog, which) -> {
                    Intent settingsIntent = new Intent(
                        Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + activity.getPackageName())
                    );
                    activity.startActivity(settingsIntent);
                })
                .show();
            return;
        }
        downloadApk(apkUrl, latestVersion);
    }

    private void downloadApk(String apkUrl, String latestVersion) {
        File updateFile = getUpdateFile();
        if (updateFile.exists()) updateFile.delete();

        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(apkUrl))
            .setTitle("Karnataka e-KYC " + latestVersion)
            .setDescription("Downloading application update")
            .setMimeType("application/vnd.android.package-archive")
            .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            .setDestinationInExternalFilesDir(activity, Environment.DIRECTORY_DOWNLOADS, APK_FILE_NAME);
        activeDownloadId = downloadManager.enqueue(request);
        Toast.makeText(activity, "Downloading update…", Toast.LENGTH_LONG).show();
    }

    private boolean downloadSucceeded(long downloadId) {
        try (Cursor cursor = downloadManager.query(new DownloadManager.Query().setFilterById(downloadId))) {
            return cursor.moveToFirst()
                && cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS)) == DownloadManager.STATUS_SUCCESSFUL;
        }
    }

    private void installDownloadedApk() {
        File apk = getUpdateFile();
        if (!apk.exists()) {
            showMessage("Update failed", "The downloaded APK file could not be found.");
            return;
        }
        Uri apkUri = FileProvider.getUriForFile(activity, activity.getPackageName() + ".fileprovider", apk);
        Intent installIntent = new Intent(Intent.ACTION_VIEW)
            .setDataAndType(apkUri, "application/vnd.android.package-archive")
            .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
        activity.startActivity(installIntent);
    }

    private File getUpdateFile() {
        return new File(activity.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), APK_FILE_NAME);
    }

    private int compareVersions(String left, String right) {
        String[] leftParts = left.split("\\.");
        String[] rightParts = right.split("\\.");
        int length = Math.max(leftParts.length, rightParts.length);
        for (int i = 0; i < length; i++) {
            int leftValue = i < leftParts.length ? numericPart(leftParts[i]) : 0;
            int rightValue = i < rightParts.length ? numericPart(rightParts[i]) : 0;
            if (leftValue != rightValue) return Integer.compare(leftValue, rightValue);
        }
        return 0;
    }

    private int numericPart(String value) {
        String digits = value.replaceAll("[^0-9].*$", "");
        if (digits.isEmpty()) return 0;
        try {
            return Integer.parseInt(digits);
        } catch (NumberFormatException ignored) {
            return 0;
        }
    }

    private void showMessage(String title, String message) {
        new AlertDialog.Builder(activity)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show();
    }

    void shutdown() {
        executor.shutdownNow();
        try {
            activity.unregisterReceiver(downloadReceiver);
        } catch (IllegalArgumentException ignored) {
            // Receiver was already unregistered.
        }
    }
}
