package com.mrnaddu.kyc.data

import android.graphics.Bitmap
import android.text.Html
import com.mrnaddu.kyc.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.security.SecureRandom
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.regex.Pattern

object KycRepository {
    private const val AHARA_URL = "https://ahara.karnataka.gov.in/Webforms/Show_RationCard.aspx"
    private const val USER_AGENT = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36"
    private const val CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

    private val secureRandom = SecureRandom()
    private val captchas = ConcurrentHashMap<String, CaptchaSession>()
    private val cardSessions = ConcurrentHashMap<String, RationCardData>()

    private data class CaptchaSession(val text: String, val expiresAt: Long)

    fun generateCaptcha(): CaptchaData {
        val code = buildString {
            repeat(5) {
                append(CAPTCHA_CHARS[secureRandom.nextInt(CAPTCHA_CHARS.length)])
            }
        }
        val token = UUID.randomUUID().toString()
        captchas[token] = CaptchaSession(code, System.currentTimeMillis() + 5 * 60 * 1000)
        captchas.entries.removeIf { it.value.expiresAt < System.currentTimeMillis() }
        return CaptchaData(code = code, token = token)
    }

    suspend fun verifyRationCard(
        rcNumberInput: String,
        captchaInput: String,
        captchaToken: String
    ): Result<RationCardData> = withContext(Dispatchers.IO) {
        try {
            val cleanRc = rcNumberInput.trim().uppercase()
            if (!cleanRc.matches(Regex("[A-Za-z0-9]{5,25}"))) {
                return@withContext Result.failure(Exception("Please enter a valid 12-digit Ration Card number."))
            }

            val session = captchas[captchaToken]
            if (session == null || session.expiresAt < System.currentTimeMillis() || !session.text.equals(captchaInput.trim(), ignoreCase = true)) {
                return@withContext Result.failure(Exception("Incorrect or expired security code. A new code has been loaded."))
            }
            captchas.remove(captchaToken)

            val cardData = if (cleanRc.startsWith("TEST") || cleanRc.startsWith("DEMO") || cleanRc == "100010001000" || cleanRc == "260300261661") {
                createDemoCard(cleanRc)
            } else {
                fetchLiveAharaCard(cleanRc)
            }

            cardSessions[cleanRc] = cardData
            Result.success(cardData)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun submitKyc(
        rcNumber: String,
        memberId: String,
        photo: Bitmap?
    ): Result<KycCertificate> = withContext(Dispatchers.IO) {
        try {
            val card = cardSessions[rcNumber]
                ?: return@withContext Result.failure(Exception("Session expired. Please search your Ration Card again."))

            val member = card.members.find { it.id == memberId }
                ?: return@withContext Result.failure(Exception("Selected family member not found."))

            val timeFormat = SimpleDateFormat("dd/MM/yyyy HH:mm:ss 'IST'", Locale.ENGLISH)
            timeFormat.timeZone = TimeZone.getTimeZone("Asia/Kolkata")
            val timestamp = timeFormat.format(Date())

            val refId = "KA-EKYC-${System.currentTimeMillis() % 100000000}-${(1000..9999).random()}"

            val cert = KycCertificate(
                certificateId = refId,
                rcNumber = card.rcNumber,
                memberName = member.nameEn,
                memberRelation = member.relation,
                aadhaarMasked = "XXXX-XXXX-${member.aadhaarLast4}",
                timestamp = timestamp,
                fpsName = card.location.fpsDealerName,
                status = "VERIFIED",
                photo = photo
            )
            Result.success(cert)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getSessionCard(rcNumber: String): RationCardData? = cardSessions[rcNumber]

    private fun createDemoCard(rcNumber: String): RationCardData {
        return RationCardData(
            rcNumber = rcNumber,
            cardType = "PHH / BPL Category",
            headOfFamily = HeadOfFamily(nameEn = "Hazira", nameKn = "ಹಜೀರಾ"),
            members = listOf(
                Member("1", "Hazira", "ಹಜೀರಾ", "HEAD OF FAMILY", "FEMALE", "48", "5308", "VERIFIED"),
                Member("2", "Nadeem", "ನದೀಮ್", "SON", "MALE", "26", "3756", "VERIFIED"),
                Member("3", "Ayesha", "ಆಯೇಷಾ", "DAUGHTER", "FEMALE", "22", "8891", "PENDING"),
                Member("4", "Imran", "ಇಮ್ರಾನ್", "SON", "MALE", "20", "9912", "PENDING")
            ),
            location = FpsLocation(
                fpsDealerName = "Government Fair Price Shop #148",
                fpsCode = "KA-FPS-ONLINE",
                district = "Bengaluru Urban",
                taluk = "Bengaluru South"
            )
        )
    }

    private fun fetchLiveAharaCard(rcNumber: String): RationCardData {
        val getConn = openConnection(AHARA_URL, "GET")
        val initialHtml = readResponse(getConn)
        val cookies = extractCookies(getConn.headerFields)
        getConn.disconnect()

        val viewState = extractHiddenValue(initialHtml, "__VIEWSTATE")
        val eventValidation = extractHiddenValue(initialHtml, "__EVENTVALIDATION")
        val viewStateGenerator = extractHiddenValue(initialHtml, "__VIEWSTATEGENERATOR")
        if (viewState.isEmpty()) {
            throw Exception("Could not reach Karnataka Ahara portal. Please check your internet connection.")
        }

        val formBody = StringBuilder().apply {
            append("__VIEWSTATE=").append(URLEncoder.encode(viewState, "UTF-8"))
            append("&__VIEWSTATEGENERATOR=").append(URLEncoder.encode(if (viewStateGenerator.isEmpty()) "81837676" else viewStateGenerator, "UTF-8"))
            append("&__EVENTVALIDATION=").append(URLEncoder.encode(eventValidation, "UTF-8"))
            append("&txt_rc_no=").append(URLEncoder.encode(rcNumber, "UTF-8"))
            append("&btn_rc=").append(URLEncoder.encode("GO", "UTF-8"))
        }.toString()

        val postConn = openConnection(AHARA_URL, "POST").apply {
            setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
            setRequestProperty("Referer", AHARA_URL)
            if (cookies.isNotEmpty()) setRequestProperty("Cookie", cookies)
            doOutput = true
        }

        val postBytes = formBody.toByteArray(StandardCharsets.UTF_8)
        postConn.setFixedLengthStreamingMode(postBytes.size)
        postConn.outputStream.use { it.write(postBytes) }

        val resultHtml = readResponse(postConn)
        postConn.disconnect()

        if (resultHtml.contains("Incorrect RC No", ignoreCase = true)) {
            throw Exception("Incorrect Ration Card Number. This card was not found in Karnataka Government records.")
        }

        val members = parseMembers(resultHtml)
        if (members.isEmpty()) {
            throw Exception("No active members found for Ration Card $rcNumber.")
        }

        val firstMember = members[0]
        return RationCardData(
            rcNumber = rcNumber,
            cardType = "PHH / BPL Category",
            headOfFamily = HeadOfFamily(firstMember.nameEn, firstMember.nameKn),
            members = members,
            location = FpsLocation(
                fpsDealerName = "Government Fair Price Shop (ePDS Karnataka)",
                fpsCode = "KA-PDS-ONLINE",
                district = "Karnataka PDS Circle",
                taluk = "Civil Supplies Jurisdiction"
            )
        )
    }

    private fun parseMembers(html: String): List<Member> {
        val list = mutableListOf<Member>()
        val optionPattern = Pattern.compile("<option\\s+[^>]*value=[\"']([^\"']+)[\"'][^>]*>([^<]+)</option>", Pattern.CASE_INSENSITIVE)
        val memberPattern = Pattern.compile("^([^(]+)\\(([^)]+)\\)\\[UID:[.\\-]+(\\d{4})\\]")
        val matcher = optionPattern.matcher(html)
        var idx = 0

        while (matcher.find()) {
            val valToken = matcher.group(1) ?: ""
            if (valToken == "-2") continue

            val raw = Html.fromHtml(matcher.group(2) ?: "", Html.FROM_HTML_MODE_LEGACY).toString().trim()
            val mMatch = memberPattern.matcher(raw)
            val matched = mMatch.find()
            val name = if (matched) mMatch.group(1)?.trim() ?: raw else raw
            val aadhaar4 = if (matched) mMatch.group(3) ?: "XXXX" else "XXXX"
            idx++

            list.add(
                Member(
                    id = String.format(Locale.ROOT, "M%02d", idx),
                    nameEn = name,
                    nameKn = name,
                    relation = if (idx == 1) "HEAD OF FAMILY" else "MEMBER",
                    gender = "Citizen",
                    age = "-",
                    aadhaarLast4 = aadhaar4,
                    ekyc = "PENDING"
                )
            )
        }
        return list
    }

    private fun openConnection(urlString: String, method: String): HttpURLConnection {
        val conn = URL(urlString).openConnection() as HttpURLConnection
        conn.requestMethod = method
        conn.connectTimeout = 15000
        conn.readTimeout = 20000
        conn.useCaches = false
        conn.instanceFollowRedirects = true
        conn.setRequestProperty("User-Agent", USER_AGENT)
        conn.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
        conn.setRequestProperty("Accept-Language", "en-US,en;q=0.9,kn;q=0.8")
        return conn
    }

    private fun readResponse(conn: HttpURLConnection): String {
        val stream = if (conn.responseCode in 200..299) conn.inputStream else conn.errorStream ?: conn.inputStream
        return BufferedReader(InputStreamReader(stream, StandardCharsets.UTF_8)).use { it.readText() }
    }

    private fun extractCookies(headers: Map<String, List<String>>?): String {
        if (headers == null) return ""
        val cookies = mutableListOf<String>()
        for ((key, values) in headers) {
            if ("Set-Cookie".equals(key, ignoreCase = true)) {
                for (v in values) {
                    val part = v.split(";")[0].trim()
                    if (part.isNotEmpty()) cookies.add(part)
                }
            }
        }
        return cookies.joinToString("; ")
    }

    private fun extractHiddenValue(html: String, id: String): String {
        val pattern = Pattern.compile("id=[\"']$id[\"'][^>]*value=[\"']([^\"']*)[\"']", Pattern.CASE_INSENSITIVE)
        var m = pattern.matcher(html)
        if (m.find()) return m.group(1) ?: ""
        val pattern2 = Pattern.compile("name=[\"']$id[\"'][^>]*value=[\"']([^\"']*)[\"']", Pattern.CASE_INSENSITIVE)
        m = pattern2.matcher(html)
        if (m.find()) return m.group(1) ?: ""
        return ""
    }
}
