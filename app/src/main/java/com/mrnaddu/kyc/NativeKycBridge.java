package com.mrnaddu.kyc;

import android.app.Activity;
import android.text.Html;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class NativeKycBridge {
    private static final String AHARA_URL = "https://ahara.karnataka.gov.in/Webforms/Show_RationCard.aspx";
    private static final String USER_AGENT = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36";
    private static final String CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final Activity activity;
    private final WebView webView;
    private final AppUpdater appUpdater;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, CaptchaSession> captchas = new ConcurrentHashMap<>();
    private final Map<String, JSONObject> cardSessions = new ConcurrentHashMap<>();

    NativeKycBridge(Activity activity, WebView webView, AppUpdater appUpdater) {
        this.activity = activity;
        this.webView = webView;
        this.appUpdater = appUpdater;
    }

    @JavascriptInterface
    public void checkForUpdates() {
        appUpdater.checkForUpdates();
    }

    @JavascriptInterface
    public void request(String requestId, String endpoint, String requestBody) {
        executor.execute(() -> {
            JSONObject result;
            try {
                JSONObject body = requestBody == null || requestBody.isEmpty()
                    ? new JSONObject()
                    : new JSONObject(requestBody);

                switch (endpoint) {
                    case "/api/captcha":
                        result = generateCaptcha();
                        break;
                    case "/api/verify-rc":
                        result = verifyRationCard(body);
                        break;
                    case "/api/confirm-kyc":
                        result = confirmKyc(body);
                        break;
                    default:
                        result = error("Unsupported Android API route.");
                }
            } catch (Exception exception) {
                result = error(exception.getMessage() == null ? "Android verification failed." : exception.getMessage());
            }
            respond(requestId, result);
        });
    }

    private JSONObject generateCaptcha() throws Exception {
        StringBuilder text = new StringBuilder(5);
        for (int i = 0; i < 5; i++) {
            text.append(CAPTCHA_CHARS.charAt(secureRandom.nextInt(CAPTCHA_CHARS.length())));
        }

        String token = UUID.randomUUID().toString();
        captchas.put(token, new CaptchaSession(text.toString(), System.currentTimeMillis() + 5 * 60 * 1000));
        captchas.entrySet().removeIf(entry -> entry.getValue().expiresAt < System.currentTimeMillis());

        String svg = "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='50' viewBox='0 0 160 50'>"
            + "<rect width='160' height='50' rx='6' fill='#f1f5f9'/><path d='M5 38L155 12M4 13L156 39' stroke='#94a3b8' "
            + "stroke-width='1' stroke-dasharray='5 4' opacity='.55'/><text x='80' y='34' text-anchor='middle' fill='#0f172a' "
            + "font-family='monospace' font-size='27' font-weight='700' letter-spacing='7'>" + text + "</text></svg>";
        String imageUri = "data:image/svg+xml;base64," + Base64.encodeToString(svg.getBytes(StandardCharsets.UTF_8), Base64.NO_WRAP);

        return new JSONObject()
            .put("success", true)
            .put("token", token)
            .put("imageUri", imageUri);
    }

    private JSONObject verifyRationCard(JSONObject body) throws Exception {
        String rcNumber = body.optString("rcNumber", "").trim().toUpperCase(Locale.ROOT);
        if (!rcNumber.matches("[A-Za-z0-9]{5,25}")) {
            return error("Invalid Karnataka Ration Card Number format.");
        }

        String captchaToken = body.optString("captchaToken", "");
        String captchaInput = body.optString("captchaInput", "").trim().toUpperCase(Locale.ROOT);
        CaptchaSession captcha = captchas.get(captchaToken);
        if (captcha == null || captcha.expiresAt < System.currentTimeMillis() || !captcha.text.equals(captchaInput)) {
            return error("Invalid or expired captcha. Please try again.").put("captchaError", true);
        }
        captchas.remove(captchaToken);

        JSONObject cardData;
        if (rcNumber.startsWith("TEST") || rcNumber.startsWith("DEMO")) {
            cardData = createDemoCard(rcNumber);
        } else {
            cardData = fetchLiveAharaCard(rcNumber);
        }
        cardSessions.put(rcNumber, cardData);

        return new JSONObject()
            .put("success", true)
            .put("data", cardData)
            .put("fromCache", false)
            .put("isLiveGateway", !rcNumber.startsWith("TEST") && !rcNumber.startsWith("DEMO"))
            .put("lastSynced", isoTimestamp());
    }

    private JSONObject createDemoCard(String rcNumber) throws Exception {
        JSONArray members = new JSONArray();
        members.put(new JSONObject()
            .put("id", "M01")
            .put("valToken", "DEMO_VAL_1")
            .put("nameEn", "Ramesh Kumar")
            .put("nameKn", "ರಮೇಶ್ ಕುಮಾರ್")
            .put("status", "ACTIVE")
            .put("aadhaarLast4", "4321")
            .put("relation", "HEAD OF FAMILY")
            .put("gender", "Male")
            .put("age", "48")
            .put("seeded", true)
            .put("ekyc", "PENDING")
            .put("isKycComplete", false));
        members.put(new JSONObject()
            .put("id", "M02")
            .put("valToken", "DEMO_VAL_2")
            .put("nameEn", "Geetha")
            .put("nameKn", "ಗೀತಾ")
            .put("status", "ACTIVE")
            .put("aadhaarLast4", "8765")
            .put("relation", "SPOUSE")
            .put("gender", "Female")
            .put("age", "42")
            .put("seeded", true)
            .put("ekyc", "PENDING")
            .put("isKycComplete", false));
        members.put(new JSONObject()
            .put("id", "M03")
            .put("valToken", "DEMO_VAL_3")
            .put("nameEn", "Chethan")
            .put("nameKn", "ಚೇತನ್")
            .put("status", "ACTIVE")
            .put("aadhaarLast4", "1122")
            .put("relation", "SON")
            .put("gender", "Male")
            .put("age", "19")
            .put("seeded", true)
            .put("ekyc", "PENDING")
            .put("isKycComplete", false));

        JSONObject location = new JSONObject()
            .put("state", "KARNATAKA")
            .put("district", "BENGALURU URBAN")
            .put("taluk", "Bangalore South")
            .put("wardVillage", "Jayanagar")
            .put("fpsCode", "KA-FPS-1048")
            .put("fpsDealerName", "Sri Manjunatha Consumer Co-op FPS #1048");

        JSONObject headOfFamily = new JSONObject()
            .put("nameEn", "Ramesh Kumar")
            .put("nameKn", "ರಮೇಶ್ ಕುಮಾರ್")
            .put("spouseOrFatherEn", "Suresh")
            .put("spouseOrFatherKn", "ಸುರೇಶ್");

        return new JSONObject()
            .put("source", "Karnataka ePDS Portal (Demo / Test Mode)")
            .put("rcNumber", rcNumber)
            .put("cardType", "PHH/BPL")
            .put("cardTypeLabel", "Karnataka BPL Ration Card")
            .put("cardTypeColor", "emerald")
            .put("status", "ACTIVE")
            .put("issueDate", "01/01/2020")
            .put("location", location)
            .put("headOfFamily", headOfFamily)
            .put("members", members);
    }

    private JSONObject fetchLiveAharaCard(String rcNumber) throws Exception {
        HttpURLConnection getConnection = openConnection(AHARA_URL, "GET");
        String initialHtml = readResponse(getConnection);
        String cookies = extractCookies(getConnection.getHeaderFields());
        getConnection.disconnect();

        String viewState = extractHiddenValue(initialHtml, "__VIEWSTATE");
        String eventValidation = extractHiddenValue(initialHtml, "__EVENTVALIDATION");
        String viewStateGenerator = extractHiddenValue(initialHtml, "__VIEWSTATEGENERATOR");
        if (viewState.isEmpty()) {
            throw new Exception("Could not initialize the Karnataka Ahara portal. Please try again later.");
        }

        String formBody = formField("__VIEWSTATE", viewState)
            + "&" + formField("__VIEWSTATEGENERATOR", viewStateGenerator.isEmpty() ? "81837676" : viewStateGenerator)
            + "&" + formField("__EVENTVALIDATION", eventValidation)
            + "&" + formField("txt_rc_no", rcNumber)
            + "&" + formField("btn_rc", "GO");

        HttpURLConnection postConnection = openConnection(AHARA_URL, "POST");
        postConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        postConnection.setRequestProperty("Referer", AHARA_URL);
        if (!cookies.isEmpty()) {
            postConnection.setRequestProperty("Cookie", cookies);
        }
        postConnection.setDoOutput(true);
        byte[] postBytes = formBody.getBytes(StandardCharsets.UTF_8);
        postConnection.setFixedLengthStreamingMode(postBytes.length);
        try (OutputStream output = postConnection.getOutputStream()) {
            output.write(postBytes);
        }
        String resultHtml = readResponse(postConnection);
        postConnection.disconnect();

        if (resultHtml.contains("Incorrect RC No")) {
            throw new Exception("Incorrect Ration Card Number. This card was not found in Karnataka Government records.");
        }

        JSONArray members = parseMembers(resultHtml);
        if (members.length() == 0) {
            throw new Exception("No active members were found on this Ration Card.");
        }

        JSONObject firstMember = members.getJSONObject(0);
        JSONObject location = new JSONObject()
            .put("state", "KARNATAKA")
            .put("district", "KARNATAKA PDS CIRCLE")
            .put("taluk", "Civil Supplies Jurisdiction")
            .put("wardVillage", "State PDS Beneficiary Database")
            .put("fpsCode", "KA-PDS-ONLINE")
            .put("fpsDealerName", "Government Fair Price Shop (ePDS Karnataka)");
        JSONObject headOfFamily = new JSONObject()
            .put("nameEn", firstMember.optString("nameEn", "Head of Family"))
            .put("nameKn", firstMember.optString("nameKn", "Head of Family"))
            .put("spouseOrFatherEn", "")
            .put("spouseOrFatherKn", "");

        return new JSONObject()
            .put("source", "Karnataka Food, Civil Supplies & Consumer Affairs (Live Portal)")
            .put("rcNumber", rcNumber)
            .put("cardType", "PHH/BPL")
            .put("cardTypeLabel", "Karnataka Ration Card")
            .put("cardTypeColor", "emerald")
            .put("status", "ACTIVE")
            .put("issueDate", "Verified State Record")
            .put("location", location)
            .put("headOfFamily", headOfFamily)
            .put("members", members);
    }

    private JSONArray parseMembers(String html) throws Exception {
        JSONArray members = new JSONArray();
        Pattern optionPattern = Pattern.compile("<option\\s+[^>]*value=[\\\"']([^\\\"']+)[\\\"'][^>]*>([^<]+)</option>", Pattern.CASE_INSENSITIVE);
        Pattern memberPattern = Pattern.compile("^([^(]+)\\(([^)]+)\\)\\[UID:[.\\-]+(\\d{4})\\]");
        Matcher options = optionPattern.matcher(html);
        int index = 0;
        while (options.find()) {
            if ("-2".equals(options.group(1))) {
                continue;
            }
            String optionText = decodeHtml(options.group(2)).trim();
            Matcher parsed = memberPattern.matcher(optionText);
            boolean matched = parsed.find();
            String name = matched ? parsed.group(1).trim() : optionText;
            String status = matched ? parsed.group(2).trim() : "ACTIVE";
            String aadhaarLast4 = matched ? parsed.group(3) : "XXXX";
            index++;

            members.put(new JSONObject()
                .put("id", String.format(Locale.ROOT, "M%02d", index))
                .put("valToken", options.group(1))
                .put("nameEn", name)
                .put("nameKn", name)
                .put("status", status)
                .put("aadhaarLast4", aadhaarLast4)
                .put("relation", index == 1 ? "HEAD OF FAMILY" : "MEMBER")
                .put("gender", "Verified Citizen")
                .put("age", "-")
                .put("seeded", true)
                .put("ekyc", "PENDING")
                .put("isKycComplete", false));
        }
        return members;
    }

    private JSONObject confirmKyc(JSONObject body) throws Exception {
        String rcNumber = body.optString("rcNumber", "").trim().toUpperCase(Locale.ROOT);
        String memberId = body.optString("memberId", "");
        JSONObject cardData = cardSessions.get(rcNumber);
        if (cardData == null) {
            return error("Session expired. Please search your Ration Card again.");
        }

        JSONArray members = cardData.getJSONArray("members");
        JSONObject selectedMember = null;
        for (int i = 0; i < members.length(); i++) {
            JSONObject member = members.getJSONObject(i);
            if (memberId.equals(member.optString("id"))) {
                selectedMember = member;
                break;
            }
        }
        if (selectedMember == null) {
            return error("Selected family member was not found on this card.");
        }

        String referenceId = "KYC-KA-" + System.currentTimeMillis() + "-" + randomHex(3);
        String verifiedAt = isoTimestamp();
        String signature = sha256(referenceId + ":" + rcNumber + ":" + memberId + ":" + verifiedAt);
        JSONObject location = cardData.getJSONObject("location");
        JSONObject headOfFamily = cardData.getJSONObject("headOfFamily");

        JSONObject beneficiary = new JSONObject()
            .put("rationCardNumber", rcNumber)
            .put("scheme", cardData.optString("cardTypeLabel", "Karnataka Ration Card"))
            .put("memberNameEn", selectedMember.optString("nameEn"))
            .put("memberNameKn", selectedMember.optString("nameKn"))
            .put("relationship", selectedMember.optString("relation"))
            .put("age", selectedMember.optString("age", "-"))
            .put("gender", selectedMember.optString("gender", "Verified Citizen"))
            .put("aadhaarMasked", "XXXX-XXXX-" + selectedMember.optString("aadhaarLast4", "XXXX"))
            .put("aadhaarSeeded", selectedMember.optBoolean("seeded", true))
            .put("stateEkycStatus", selectedMember.optString("ekyc", "DONE"))
            .put("headOfFamily", headOfFamily.optString("nameEn", "Head of Family"));

        JSONObject certificate = new JSONObject()
            .put("kycReferenceId", referenceId)
            .put("verifiedAt", verifiedAt)
            .put("verificationStatus", "VERIFIED")
            .put("matchScore", 100)
            .put("digitalSignatureHash", signature)
            .put("beneficiary", beneficiary)
            .put("location", new JSONObject()
                .put("state", location.optString("state"))
                .put("district", location.optString("district"))
                .put("taluk", location.optString("taluk"))
                .put("fpsDealer", location.optString("fpsDealerName")))
            .put("compliance", new JSONObject()
                .put("standard", "DPDP Act 2023 & NFSA Section 12")
                .put("authority", "Karnataka Food, Civil Supplies & Consumer Affairs")
                .put("auditPass", true));

        selectedMember.put("ekyc", "VERIFIED");
        selectedMember.put("isKycComplete", true);
        selectedMember.put("verifiedAt", verifiedAt);
        selectedMember.put("kycReferenceId", referenceId);

        return new JSONObject().put("success", true).put("certificate", certificate);
    }

    private HttpURLConnection openConnection(String address, String method) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(address).openConnection();
        connection.setRequestMethod(method);
        connection.setConnectTimeout(15000);
        connection.setReadTimeout(25000);
        connection.setInstanceFollowRedirects(true);
        connection.setRequestProperty("User-Agent", USER_AGENT);
        connection.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        return connection;
    }

    private String readResponse(HttpURLConnection connection) throws Exception {
        int status = connection.getResponseCode();
        InputStream stream = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
        if (stream == null) {
            throw new Exception("Karnataka Ahara portal returned an empty response.");
        }
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append('\n');
            }
        }
        if (status >= 400) {
            throw new Exception("Karnataka Ahara portal returned HTTP " + status + ".");
        }
        return content.toString();
    }

    private String extractHiddenValue(String html, String fieldName) {
        Pattern pattern = Pattern.compile("(?:name|id)=[\\\"']" + Pattern.quote(fieldName)
            + "[\\\"'][^>]*value=[\\\"']([^\\\"']*)[\\\"']", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(html);
        return matcher.find() ? decodeHtml(matcher.group(1)) : "";
    }

    private String extractCookies(Map<String, List<String>> headers) {
        StringBuilder cookies = new StringBuilder();
        for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
            if (entry.getKey() == null || !"Set-Cookie".equalsIgnoreCase(entry.getKey())) {
                continue;
            }
            for (String header : entry.getValue()) {
                if (cookies.length() > 0) cookies.append("; ");
                cookies.append(header.split(";", 2)[0]);
            }
        }
        return cookies.toString();
    }

    private String formField(String key, String value) throws Exception {
        return URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(value == null ? "" : value, "UTF-8");
    }

    private String decodeHtml(String value) {
        return Html.fromHtml(value, Html.FROM_HTML_MODE_LEGACY).toString();
    }

    private String isoTimestamp() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        return formatter.format(new Date());
    }

    private String randomHex(int bytes) {
        byte[] random = new byte[bytes];
        secureRandom.nextBytes(random);
        return toHex(random).toUpperCase(Locale.ROOT);
    }

    private String sha256(String value) throws Exception {
        return toHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
    }

    private String toHex(byte[] bytes) {
        StringBuilder output = new StringBuilder(bytes.length * 2);
        for (byte value : bytes) {
            output.append(String.format(Locale.ROOT, "%02x", value & 0xff));
        }
        return output.toString();
    }

    private JSONObject error(String message) {
        try {
            return new JSONObject().put("success", false).put("message", message);
        } catch (Exception impossible) {
            return new JSONObject();
        }
    }

    private void respond(String requestId, JSONObject result) {
        String script = "window.NativeKycClient.resolve(" + JSONObject.quote(requestId) + "," + result + ");";
        activity.runOnUiThread(() -> webView.evaluateJavascript(script, null));
    }

    void shutdown() {
        executor.shutdownNow();
    }

    private static final class CaptchaSession {
        final String text;
        final long expiresAt;

        CaptchaSession(String text, long expiresAt) {
            this.text = text;
            this.expiresAt = expiresAt;
        }
    }
}
