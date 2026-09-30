package com.mrnaddu.kyc.ui

import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.mrnaddu.kyc.data.KycRepository
import com.mrnaddu.kyc.model.*
import kotlinx.coroutines.launch

// Color Palette for Karnataka GovTech
val BrandNavy = Color(0xFF0F172A)
val BrandSlate = Color(0xFFF8FAFC)
val BrandAmber = Color(0xFFB45309)
val BrandEmerald = Color(0xFF059669)
val BrandRose = Color(0xFFE11D48)
val CardBorder = Color(0xFFE2E8F0)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NannaSevaApp(
    onCheckForUpdates: () -> Unit = {},
    updateAvailableVersion: String? = null
) {
    var currentLang by remember { mutableStateOf("KN") } // Default to authentic Kannada
    val isKn = currentLang == "KN"

    var currentStep by remember { mutableIntStateOf(0) } // 0: Search, 1: Roster, 2: Camera, 3: Certificate
    var rcNumberInput by remember { mutableStateOf("") }
    var captchaInput by remember { mutableStateOf("") }
    var captchaData by remember { mutableStateOf(KycRepository.generateCaptcha()) }
    var consentAgreed by remember { mutableStateOf(true) }

    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    var cardData by remember { mutableStateOf<RationCardData?>(null) }
    var selectedMember by remember { mutableStateOf<Member?>(null) }
    var capturedPhoto by remember { mutableStateOf<Bitmap?>(null) }
    var issuedCertificate by remember { mutableStateOf<KycCertificate?>(null) }

    // Dialog States
    var showFacilitiesDialog by remember { mutableStateOf(false) }
    var showUpdateHubDialog by remember { mutableStateOf(false) }
    var updateHubDefaultTab by remember { mutableStateOf("aadhaar") }

    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current

    // Helper translation string
    fun t(en: String, kn: String): String = if (isKn) kn else en

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = BrandNavy,
                            modifier = Modifier.size(32.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = Icons.Default.AccountBox,
                                    contentDescription = "Emblem",
                                    tint = Color(0xFFFBBF24),
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = t("Nanna Seva", "ನನ್ನ ಸೇವೆ"),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = BrandNavy
                            )
                            Text(
                                text = t("Govt of Karnataka • Aadhaar & Ration", "ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಆಧಾರ್ & ಪಡಿತರ ಸೇವೆಗಳು"),
                                fontSize = 9.sp,
                                color = Color.Gray,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                },
                navigationIcon = {
                    if (currentStep > 0) {
                        IconButton(onClick = {
                            errorMessage = null
                            if (currentStep == 3) {
                                currentStep = 0
                                rcNumberInput = ""
                                captchaInput = ""
                                captchaData = KycRepository.generateCaptcha()
                            } else {
                                currentStep -= 1
                            }
                        }) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = BrandNavy)
                        }
                    }
                },
                actions = {
                    // Home button
                    if (currentStep > 0) {
                        IconButton(onClick = {
                            errorMessage = null
                            currentStep = 0
                            rcNumberInput = ""
                            captchaInput = ""
                            captchaData = KycRepository.generateCaptcha()
                        }) {
                            Icon(Icons.Default.Home, contentDescription = "Home", tint = BrandNavy)
                        }
                    }

                    // Language toggle pill
                    Button(
                        onClick = { currentLang = if (isKn) "EN" else "KN" },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFFFEF3C7),
                            contentColor = Color(0xFF78350F)
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        Text(
                            text = if (isKn) "English" else "ಕನ್ನಡ",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White
                )
            )
        },
        containerColor = BrandSlate
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Update Banner if available
                if (updateAvailableVersion != null) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = t("New update $updateAvailableVersion is available!", "ಹೊಸ ಆವೃತ್ತಿಯ ಅಪ್‌ಡೇಟ್ $updateAvailableVersion ಲಭ್ಯವಿದೆ!"),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF78350F)
                            )
                            Button(
                                onClick = onCheckForUpdates,
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB45309)),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text(t("Update", "ಅಪ್‌ಡೇಟ್"), fontSize = 11.sp, color = Color.White)
                            }
                        }
                    }
                }

                // Error Message Card
                if (errorMessage != null) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFFFE4E6)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Info, contentDescription = null, tint = BrandRose, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = errorMessage ?: "",
                                fontSize = 11.sp,
                                color = Color(0xFF881337),
                                modifier = Modifier.weight(1f)
                            )
                            IconButton(onClick = { errorMessage = null }, modifier = Modifier.size(24.dp)) {
                                Icon(Icons.Default.Close, contentDescription = "Dismiss", tint = Color.Gray, modifier = Modifier.size(14.dp))
                            }
                        }
                    }
                }

                // Screen Router
                when (currentStep) {
                    0 -> StepLookupScreen(
                        isKn = isKn,
                        rcNumber = rcNumberInput,
                        onRcChange = { if (it.length <= 12) rcNumberInput = it.filter { ch -> ch.isLetterOrDigit() }.uppercase() },
                        captcha = captchaInput,
                        onCaptchaChange = { if (it.length <= 5) captchaInput = it.uppercase() },
                        captchaCode = captchaData.code,
                        onRefreshCaptcha = { captchaData = KycRepository.generateCaptcha(); captchaInput = "" },
                        consent = consentAgreed,
                        onConsentChange = { consentAgreed = it },
                        isLoading = isLoading,
                        onSearch = {
                            if (rcNumberInput.length < 5) {
                                errorMessage = t("Please enter a valid Ration Card number.", "ದಯವಿಟ್ಟು ಸರಿಯಾದ ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.")
                                return@StepLookupScreen
                            }
                            if (captchaInput.length < 5) {
                                errorMessage = t("Please enter the 5-character security code.", "ದಯವಿಟ್ಟು 5 ಅಕ್ಷರಗಳ ಸೆಕ್ಯುರಿಟಿ ಕೋಡ್ ನಮೂದಿಸಿ.")
                                return@StepLookupScreen
                            }
                            if (!consentAgreed) {
                                errorMessage = t("Please accept the e-KYC consent.", "ದಯವಿಟ್ಟು ಇ-ಕೆವೈಸಿ ಸಮ್ಮತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.")
                                return@StepLookupScreen
                            }

                            isLoading = true
                            errorMessage = null
                            coroutineScope.launch {
                                val result = KycRepository.verifyRationCard(rcNumberInput, captchaInput, captchaData.token)
                                isLoading = false
                                result.onSuccess { data ->
                                    cardData = data
                                    selectedMember = data.members.firstOrNull { it.ekyc != "VERIFIED" } ?: data.members.firstOrNull()
                                    currentStep = 1
                                }.onFailure { err ->
                                    errorMessage = err.message ?: t("Verification failed.", "ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ.")
                                    captchaData = KycRepository.generateCaptcha()
                                    captchaInput = ""
                                }
                            }
                        },
                        onOpenFacilities = { showFacilitiesDialog = true },
                        onOpenUpdateHub = { tab -> updateHubDefaultTab = tab; showUpdateHubDialog = true }
                    )

                    1 -> cardData?.let { card ->
                        StepRosterScreen(
                            isKn = isKn,
                            card = card,
                            selectedMember = selectedMember,
                            onSelectMember = { selectedMember = it },
                            onOpenUpdateHub = { tab -> updateHubDefaultTab = tab; showUpdateHubDialog = true },
                            onProceedToPhoto = {
                                if (selectedMember != null) {
                                    currentStep = 2
                                } else {
                                    errorMessage = t("Please select a family member.", "ದಯವಿಟ್ಟು ಕುಟುಂಬದ ಸದಸ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ.")
                                }
                            }
                        )
                    }

                    2 -> StepBiometricScreen(
                        isKn = isKn,
                        selectedMember = selectedMember,
                        photo = capturedPhoto,
                        onPhotoCaptured = { capturedPhoto = it },
                        isLoading = isLoading,
                        onSubmitKyc = {
                            val member = selectedMember
                            val card = cardData
                            if (member != null && card != null) {
                                isLoading = true
                                errorMessage = null
                                coroutineScope.launch {
                                    val res = KycRepository.submitKyc(card.rcNumber, member.id, capturedPhoto)
                                    isLoading = false
                                    res.onSuccess { cert ->
                                        issuedCertificate = cert
                                        currentStep = 3
                                    }.onFailure { err ->
                                        errorMessage = err.message ?: t("e-KYC submission failed.", "ಇ-ಕೆವೈಸಿ ಸಲ್ಲಿಕೆ ವಿಫಲವಾಗಿದೆ.")
                                    }
                                }
                            }
                        }
                    )

                    3 -> issuedCertificate?.let { cert ->
                        StepCertificateScreen(
                            isKn = isKn,
                            cert = cert,
                            onStartNew = {
                                currentStep = 0
                                rcNumberInput = ""
                                captchaInput = ""
                                captchaData = KycRepository.generateCaptcha()
                                cardData = null
                                selectedMember = null
                                capturedPhoto = null
                                issuedCertificate = null
                            }
                        )
                    }
                }
            }
        }
    }

    // Facilities Guide Dialog
    if (showFacilitiesDialog) {
        FacilitiesGuideDialog(isKn = isKn, onDismiss = { showFacilitiesDialog = false })
    }

    // Update & Transfer Hub Dialog
    if (showUpdateHubDialog) {
        UpdateHubDialog(
            isKn = isKn,
            initialTab = updateHubDefaultTab,
            onDismiss = { showUpdateHubDialog = false }
        )
    }
}

// -------------------------------------------------------------
// STEP 0: LOOKUP SCREEN
// -------------------------------------------------------------
@Composable
fun StepLookupScreen(
    isKn: Boolean,
    rcNumber: String,
    onRcChange: (String) -> Unit,
    captcha: String,
    onCaptchaChange: (String) -> Unit,
    captchaCode: String,
    onRefreshCaptcha: () -> Unit,
    consent: Boolean,
    onConsentChange: (Boolean) -> Unit,
    isLoading: Boolean,
    onSearch: () -> Unit,
    onOpenFacilities: () -> Unit,
    onOpenUpdateHub: (String) -> Unit
) {
    fun t(en: String, kn: String): String = if (isKn) kn else en

    Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        // Department Pill Badge
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color(0xFFFEF3C7),
            border = BorderStroke(1.dp, Color(0xFFFDE68A)),
            modifier = Modifier.padding(bottom = 8.dp)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(6.dp)
                        .background(Color(0xFFD97706), CircleShape)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = t("Food & Civil Supplies Department • Government of Karnataka", "ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ • ಕರ್ನಾಟಕ ಸರ್ಕಾರ"),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF78350F)
                )
            }
        }

        Text(
            text = t("Nanna Seva e-KYC", "ನನ್ನ ಸೇವೆ ಇ-ಕೆವೈಸಿ"),
            fontSize = 22.sp,
            fontWeight = FontWeight.ExtraBold,
            color = BrandNavy
        )
        Text(
            text = t("Enter your ration card number to verify Aadhaar and family details.", "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ ಆಧಾರ್ ಮತ್ತು ಕುಟುಂಬದ ವಿವರಗಳನ್ನು ಪಡೆಯಿರಿ."),
            fontSize = 11.sp,
            color = Color.Gray,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 4.dp, bottom = 16.dp)
        )

        // Ration Card Input Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, CardBorder)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = t("RATION CARD NUMBER *", "ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ *"),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF334155)
                    )
                    Text(
                        text = "${rcNumber.length}/12",
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Color.Gray
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(
                    value = rcNumber,
                    onValueChange = onRcChange,
                    placeholder = { Text(t("Enter card number (e.g. 260300261661)", "ಕಾರ್ಡ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (ಉದಾ: 260300261661)"), fontSize = 12.sp) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Ascii, capitalization = KeyboardCapitalization.Characters),
                    leadingIcon = { Icon(Icons.Default.AccountBox, contentDescription = null, tint = BrandNavy) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Security Code (Captcha) Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, CardBorder)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Lock, contentDescription = null, tint = BrandEmerald, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = t("SECURITY CODE", "ಸೆಕ್ಯುರಿಟಿ ಕೋಡ್"),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF334155)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Stylized Compose Canvas Captcha
                    Box(
                        modifier = Modifier
                            .weight(1.1f)
                            .height(48.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(0xFFF1F5F9))
                            .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
                            .clickable { onRefreshCaptcha() },
                        contentAlignment = Alignment.Center
                    ) {
                        Canvas(modifier = Modifier.fillMaxSize()) {
                            // Noise lines
                            drawLine(
                                color = Color(0xFF94A3B8).copy(alpha = 0.5f),
                                start = Offset(10f, size.height * 0.8f),
                                end = Offset(size.width - 10f, size.height * 0.2f),
                                strokeWidth = 2f
                            )
                            drawLine(
                                color = Color(0xFF94A3B8).copy(alpha = 0.5f),
                                start = Offset(10f, size.height * 0.3f),
                                end = Offset(size.width - 10f, size.height * 0.7f),
                                strokeWidth = 2f
                            )
                        }
                        Row(
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = captchaCode,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.ExtraBold,
                                fontFamily = FontFamily.Monospace,
                                letterSpacing = 6.sp,
                                color = Color(0xFF1E293B)
                            )
                        }
                        // tap to refresh badge
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = Color(0xFF0F172A).copy(alpha = 0.8f),
                            modifier = Modifier
                                .align(Alignment.BottomEnd)
                                .padding(3.dp)
                        ) {
                            Text(
                                text = t("tap ↻", "ಬದಲಿಸಿ ↻"),
                                fontSize = 8.sp,
                                color = Color.White,
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    // Code Input
                    OutlinedTextField(
                        value = captcha,
                        onValueChange = onCaptchaChange,
                        placeholder = { Text(t("CODE", "ಕೋಡ್"), fontSize = 12.sp, color = Color.LightGray) },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Ascii, capitalization = KeyboardCapitalization.Characters),
                        modifier = Modifier
                            .weight(1f)
                            .height(52.dp),
                        shape = RoundedCornerShape(12.dp),
                        textStyle = LocalTextStyle.current.copy(
                            textAlign = TextAlign.Center,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )
                    )
                }

                Text(
                    text = t("Type 5 characters shown on left", "ಎಡಭಾಗದಲ್ಲಿರುವ 5 ಅಕ್ಷರಗಳನ್ನು ನಮೂದಿಸಿ"),
                    fontSize = 10.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Consent Checkbox
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onConsentChange(!consent) },
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = consent,
                onCheckedChange = onConsentChange,
                colors = CheckboxDefaults.colors(checkedColor = BrandNavy)
            )
            Text(
                text = t("I agree to verify my ration card details for e-KYC.", "ಇ-ಕೆವೈಸಿಗಾಗಿ ನನ್ನ ಪಡಿತರ ಚೀಟಿ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ."),
                fontSize = 11.sp,
                color = Color(0xFF334155)
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Primary Find Button
        Button(
            onClick = onSearch,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = BrandNavy),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                Spacer(modifier = Modifier.width(8.dp))
                Text(t("Verifying State Records...", "ಸರ್ಕಾರಿ ದಾಖಲೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ..."), fontSize = 13.sp, color = Color.White)
            } else {
                Text(t("Find My Ration Card ➔", "ನನ್ನ ಪಡಿತರ ಚೀಟಿ ಹುಡುಕಿ ➔"), fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Quick Service Cards
        // Card 1: Facilities Guide
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onOpenFacilities() },
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFFFFBEB)),
            border = BorderStroke(1.dp, Color(0xFFFDE68A))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFFD97706), modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = t("Ration Benefits & Shop Info", "ಪಡಿತರ ಸೌಲಭ್ಯಗಳು ಮತ್ತು ಅಂಗಡಿ ಮಾಹಿತಿ"),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF78350F)
                        )
                        Text(
                            text = t("View >", "ನೋಡಿ >"),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFB45309)
                        )
                    }
                    Text(
                        text = t("Check monthly 10kg rice quota, Anna Bhagya ₹170 DBT, and Fair Price Shop.", "ಮಾಸಿಕ 10 ಕೆಜಿ ಅಕ್ಕಿ ಕೋಟಾ, ಅನ್ನಭಾಗ್ಯ ₹170 ನಗದು ಮತ್ತು ರೇಷನ್ ಅಂಗಡಿ ಮಾಹಿತಿ."),
                        fontSize = 10.sp,
                        color = Color(0xFF92400E),
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Card 2: Aadhaar & Ration Card Updates Hub
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onOpenUpdateHub("aadhaar") },
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF)),
            border = BorderStroke(1.dp, Color(0xFFBFDBFE))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.AccountBox, contentDescription = null, tint = Color(0xFF2563EB), modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = t("Aadhaar & Card Updates", "ಆಧಾರ್ & ಪಡಿತರ ತಿದ್ದುಪಡಿ"),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF1E3A8A)
                        )
                        Text(
                            text = t("Services >", "ಸೇವೆಗಳು >"),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF2563EB)
                        )
                    }
                    Text(
                        text = t("Aadhaar address update, Karnataka card transfer, add member, & NPCI check.", "ಆಧಾರ್ ವಿಳಾಸ ತಿದ್ದುಪಡಿ, ಕರ್ನಾಟಕದೊಳಗೆ ರೇಷನ್ ವರ್ಗಾವಣೆ, ಸದಸ್ಯರ ಸೇರ್ಪಡೆ."),
                        fontSize = 10.sp,
                        color = Color(0xFF1E40AF),
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = t("Department of Food, Civil Supplies & Consumer Affairs • Government of Karnataka", "ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ • ಕರ್ನಾಟಕ ಸರ್ಕಾರ"),
            fontSize = 9.sp,
            color = Color.LightGray,
            textAlign = TextAlign.Center
        )
    }
}

// -------------------------------------------------------------
// STEP 1: ROSTER SCREEN
// -------------------------------------------------------------
@Composable
fun StepRosterScreen(
    isKn: Boolean,
    card: RationCardData,
    selectedMember: Member?,
    onSelectMember: (Member) -> Unit,
    onOpenUpdateHub: (String) -> Unit,
    onProceedToPhoto: () -> Unit
) {
    fun t(en: String, kn: String): String = if (isKn) kn else en
    var selectedTab by remember { mutableIntStateOf(0) } // 0: Members, 1: Shop, 2: Schemes

    Column(modifier = Modifier.fillMaxWidth()) {
        // Smart PVC Ration Card Display
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.Transparent)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.linearGradient(
                            listOf(Color(0xFF065F46), Color(0xFF047857), Color(0xFF0F766E))
                        )
                    )
                    .padding(16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = t("Government of Karnataka", "ಕರ್ನಾಟಕ ಸರ್ಕಾರ"),
                            color = Color(0xFFFEF3C7),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Color(0xFF10B981).copy(alpha = 0.3f),
                            border = BorderStroke(1.dp, Color(0xFF6EE7B7))
                        ) {
                            Text(
                                text = t("ACTIVE", "ಸಕ್ರಿಯ"),
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = card.rcNumber,
                        color = Color.White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.ExtraBold,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 2.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(t("Head of Family", "ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರು"), fontSize = 9.sp, color = Color(0xFFA7F3D0))
                            Text(if (isKn) card.headOfFamily.nameKn else card.headOfFamily.nameEn, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text(t("Card Type", "ಕಾರ್ಡ್ ವಿಧ"), fontSize = 9.sp, color = Color(0xFFA7F3D0))
                            Text(card.cardType, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Tabs
        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = Color.White,
            contentColor = BrandNavy,
            modifier = Modifier.clip(RoundedCornerShape(12.dp))
        ) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text(t("Family e-KYC (${card.members.size})", "ಕುಟುಂಬದ ಸದಸ್ಯರು (${card.members.size})"), fontSize = 11.sp, fontWeight = FontWeight.Bold) }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text(t("Ration & Shop", "ಅಂಗಡಿ ವಿವರ"), fontSize = 11.sp, fontWeight = FontWeight.Bold) }
            )
            Tab(
                selected = selectedTab == 2,
                onClick = { selectedTab = 2 },
                text = { Text(t("Benefits", "ಸೌಲಭ್ಯಗಳು"), fontSize = 11.sp, fontWeight = FontWeight.Bold) }
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        when (selectedTab) {
            0 -> {
                // Family Members List
                Text(
                    text = t("Select member for biometric photo verification:", "ಫೋಟೋ ಪರಿಶೀಲನೆಗೆ ಸದಸ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ:"),
                    fontSize = 11.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(bottom = 6.dp)
                )

                card.members.forEach { member ->
                    val isSelected = selectedMember?.id == member.id
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clickable { onSelectMember(member) },
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = if (isSelected) Color(0xFFEFF6FF) else Color.White),
                        border = BorderStroke(if (isSelected) 2.dp else 1.dp, if (isSelected) Color(0xFF3B82F6) else CardBorder)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = isSelected,
                                onClick = { onSelectMember(member) },
                                colors = RadioButtonDefaults.colors(selectedColor = Color(0xFF2563EB))
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = if (isKn) member.nameKn else member.nameEn,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = BrandNavy
                                    )
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = if (member.ekyc == "VERIFIED") Color(0xFFD1FAE5) else Color(0xFFFEF3C7)
                                    ) {
                                        Text(
                                            text = if (member.ekyc == "VERIFIED") t("VERIFIED", "ಪೂರ್ಣಗೊಂಡಿದೆ") else t("PENDING", "ಬಾಕಿ ಇದೆ"),
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (member.ekyc == "VERIFIED") Color(0xFF065F46) else Color(0xFF92400E),
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                                Text(
                                    text = "${member.relation} • ${member.gender} • ${member.age} yrs",
                                    fontSize = 10.sp,
                                    color = Color.Gray
                                )
                                Text(
                                    text = "Aadhaar: XXXX-XXXX-${member.aadhaarLast4}",
                                    fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = Color(0xFF475569)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Roster Update Notice Banner
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF)),
                    border = BorderStroke(1.dp, Color(0xFFBFDBFE))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = t("Need to correct name, age, or link unseeded Aadhaar?", "ಹೆಸರು, ವಯಸ್ಸು ತಿದ್ದುಪಡಿ ಅಥವಾ ಆಧಾರ್ ಲಿಂಕ್ ಮಾಡಬೇಕೆ?"),
                            fontSize = 10.sp,
                            color = Color(0xFF1E40AF),
                            modifier = Modifier.weight(1f)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Button(
                            onClick = { onOpenUpdateHub("ration") },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Color(0xFF1D4ED8)),
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, Color(0xFF93C5FD)),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            modifier = Modifier.height(30.dp)
                        ) {
                            Text(t("Update Services ↗", "ತಿದ್ದುಪಡಿ ಸೇವೆಗಳು ↗"), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Proceed Button
                Button(
                    onClick = onProceedToPhoto,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BrandNavy)
                ) {
                    Text(t("Proceed to Biometric Photo ➔", "ಮುಖದ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ ➔"), fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
            }

            1 -> {
                // Fair Price Shop Details
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, CardBorder)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(t("Fair Price Shop (FPS) Details", "ನ್ಯಾಯ ಬೆಲೆ ಅಂಗಡಿ ವಿವರ"), fontSize = 13.sp, fontWeight = FontWeight.Bold, color = BrandNavy)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(t("Shop Name:", "ಅಂಗಡಿ ಹೆಸರು:"), fontSize = 10.sp, color = Color.Gray)
                        Text(card.location.fpsDealerName, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = BrandNavy)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(t("FPS Code:", "ಅಂಗಡಿ ಕೋಡ್:"), fontSize = 10.sp, color = Color.Gray)
                        Text(card.location.fpsCode, fontSize = 12.sp, fontFamily = FontFamily.Monospace, color = BrandNavy)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(t("District & Taluk:", "ಜಿಲ್ಲೆ ಮತ್ತು ತಾಲೂಕು:"), fontSize = 10.sp, color = Color.Gray)
                        Text("${card.location.district}, ${card.location.taluk}", fontSize = 12.sp, color = BrandNavy)
                    }
                }
            }

            2 -> {
                // Welfare Benefits
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, CardBorder)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(t("Government Welfare Entitlements", "ಸರ್ಕಾರಿ ಪಡಿತರ ಸೌಲಭ್ಯಗಳು"), fontSize = 13.sp, fontWeight = FontWeight.Bold, color = BrandNavy)
                        Spacer(modifier = Modifier.height(10.dp))
                        BenefitItem(
                            icon = Icons.Default.CheckCircle,
                            title = t("Anna Bhagya 10kg Free Rice", "ಅನ್ನಭಾಗ್ಯ 10 ಕೆಜಿ ಉಚಿತ ಅಕ್ಕಿ"),
                            desc = t("5kg Central NFSA + 5kg Karnataka State quota per person free.", "ಪ್ರತಿ ಸದಸ್ಯರಿಗೆ ತಿಂಗಳಿಗೆ ಒಟ್ಟು 10 ಕೆಜಿ ಉಚಿತ ಅಕ್ಕಿ.")
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        BenefitItem(
                            icon = Icons.Default.AccountBox,
                            title = t("Anna Bhagya Cash Transfer (DBT)", "ಅನ್ನಭಾಗ್ಯ ನಗದು ವರ್ಗಾವಣೆ (DBT)"),
                            desc = t("₹170 per person credited directly to seeded Aadhaar bank account.", "ಪ್ರತಿ ಸದಸ್ಯರಿಗೆ ₹170 ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರ ನಗದು ವರ್ಗಾವಣೆ.")
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        BenefitItem(
                            icon = Icons.Default.Person,
                            title = t("Gruha Lakshmi ₹2,000 / month", "ಗೃಹಲಕ್ಷ್ಮಿ ₹2,000 ಮಾಸಿಕ ಧನಸಹಾಯ"),
                            desc = t("Direct financial assistance to the female Head of Family.", "ಕುಟುಂಬದ ಮಹಿಳಾ ಯಜಮಾನಿಗೆ ತಿಂಗಳಿಗೆ ₹2,000 ನೇರ ಜಮೆ.")
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun BenefitItem(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, desc: String) {
    Row(verticalAlignment = Alignment.Top) {
        Icon(icon, contentDescription = null, tint = BrandEmerald, modifier = Modifier.size(18.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Column {
            Text(text = title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = BrandNavy)
            Text(text = desc, fontSize = 10.sp, color = Color.Gray, modifier = Modifier.padding(top = 1.dp))
        }
    }
}

// -------------------------------------------------------------
// STEP 2: BIOMETRIC PHOTO SCREEN
// -------------------------------------------------------------
@Composable
fun StepBiometricScreen(
    isKn: Boolean,
    selectedMember: Member?,
    photo: Bitmap?,
    onPhotoCaptured: (Bitmap) -> Unit,
    isLoading: Boolean,
    onSubmitKyc: () -> Unit
) {
    fun t(en: String, kn: String): String = if (isKn) kn else en

    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap ->
        if (bitmap != null) {
            onPhotoCaptured(bitmap)
        }
    }

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = t("Live Face Biometric Capture", "ಮುಖದ ಬಯೋಮೆಟ್ರಿಕ್ ಫೋಟೋ"),
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = BrandNavy
        )
        Text(
            text = "${selectedMember?.nameEn ?: ""} (${selectedMember?.relation ?: ""})",
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = BrandEmerald,
            modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
        )

        // Viewfinder Frame
        Box(
            modifier = Modifier
                .size(240.dp, 280.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(Color(0xFF0F172A))
                .border(2.dp, if (photo != null) BrandEmerald else Color(0xFF38BDF8), RoundedCornerShape(20.dp)),
            contentAlignment = Alignment.Center
        ) {
            if (photo != null) {
                Image(
                    bitmap = photo.asImageBitmap(),
                    contentDescription = "Captured Photo",
                    modifier = Modifier.fillMaxSize()
                )
            } else {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(130.dp, 170.dp)
                            .border(2.dp, Color(0xFF38BDF8).copy(alpha = 0.7f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Person, contentDescription = null, tint = Color.LightGray, modifier = Modifier.size(60.dp))
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = t("Position face in oval", "ಮುಖವನ್ನು ಚೌಕಟ್ಟಿನಲ್ಲಿರಿಸಿ"),
                        fontSize = 10.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Buttons
        Row(horizontalArrangement = Arrangement.Center) {
            Button(
                onClick = { cameraLauncher.launch(null) },
                colors = ButtonDefaults.buttonColors(containerColor = if (photo == null) BrandEmerald else Color(0xFF334155)),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(if (photo == null) t("Capture Photo", "ಫೋಟೋ ತೆಗೆಯಿರಿ") else t("Retake Photo", "ಮತ್ತೆ ತೆಗೆಯಿರಿ"), fontSize = 12.sp)
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Demo sample photo generator for emulators
            OutlinedButton(
                onClick = {
                    val bmp = Bitmap.createBitmap(200, 200, Bitmap.Config.ARGB_8888)
                    android.graphics.Canvas(bmp).drawColor(android.graphics.Color.DKGRAY)
                    onPhotoCaptured(bmp)
                },
                shape = RoundedCornerShape(10.dp)
            ) {
                Text(t("Demo Photo", "ಮಾದರಿ ಫೋಟೋ"), fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = t("Keep face within oval frame, look directly into camera and blink naturally.", "ಮುಖವನ್ನು ಚೌಕಟ್ಟಿನಲ್ಲಿರಿಸಿ, ಬೆಳಕಿರುವ ಸ್ಥಳದಲ್ಲಿ ಕ್ಯಾಮೆರಾವನ್ನು ನೇರವಾಗಿ ನೋಡಿ."),
            fontSize = 10.sp,
            color = Color.Gray,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = onSubmitKyc,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = BrandNavy),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                Spacer(modifier = Modifier.width(8.dp))
                Text(t("Submitting e-KYC...", "ಇ-ಕೆವೈಸಿ ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ..."), fontSize = 13.sp, color = Color.White)
            } else {
                Text(t("Submit e-KYC ➔", "ಇ-ಕೆವೈಸಿ ದೃಢೀಕರಿಸಿ ➔"), fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
    }
}

// -------------------------------------------------------------
// STEP 3: CERTIFICATE SCREEN
// -------------------------------------------------------------
@Composable
fun StepCertificateScreen(
    isKn: Boolean,
    cert: KycCertificate,
    onStartNew: () -> Unit
) {
    fun t(en: String, kn: String): String = if (isKn) kn else en
    val context = LocalContext.current

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Certificate Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(2.dp, Color(0xFF10B981))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header
                Text(
                    text = t("GOVERNMENT OF KARNATAKA", "ಕರ್ನಾಟಕ ಸರ್ಕಾರ"),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = BrandNavy,
                    letterSpacing = 1.sp
                )
                Text(
                    text = t("Food, Civil Supplies & Consumer Affairs Department", "ಆಹಾರ, ನಾಗರಿಕ ಸರಬರಾಜು ಮತ್ತು ಗ್ರಾಹಕರ ವ್ಯವಹಾರಗಳ ಇಲಾಖೆ"),
                    fontSize = 9.sp,
                    color = Color.Gray,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Green Verified Seal
                Surface(
                    shape = CircleShape,
                    color = Color(0xFFD1FAE5),
                    modifier = Modifier.size(54.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = BrandEmerald, modifier = Modifier.size(36.dp))
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = t("e-KYC VERIFIED SUCCESSFULLY", "ಇ-ಕೆವೈಸಿ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ"),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = BrandEmerald
                )

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = Color(0xFFE2E8F0))
                Spacer(modifier = Modifier.height(14.dp))

                // Certificate Attributes
                CertRow(t("Beneficiary Name:", "ಫಲಾನುಭವಿಯ ಹೆಸರು:"), cert.memberName)
                CertRow(t("Relation:", "ಸಂಬಂಧ:"), cert.memberRelation)
                CertRow(t("Ration Card No:", "ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ:"), cert.rcNumber)
                CertRow(t("Aadhaar Number:", "ಆಧಾರ್ ಸಂಖ್ಯೆ:"), cert.aadhaarMasked)
                CertRow(t("Verification Date:", "ದೃಢೀಕರಣ ದಿನಾಂಕ:"), cert.timestamp)
                CertRow(t("Fair Price Shop:", "ನ್ಯಾಯ ಬೆಲೆ ಅಂಗಡಿ:"), cert.fpsName)
                CertRow(t("Certificate Ref ID:", "ಪ್ರಮಾಣಪತ್ರ ಸಂಖ್ಯೆ:"), cert.certificateId)

                Spacer(modifier = Modifier.height(14.dp))
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFF1F5F9),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = t("Digitally signed & authenticated via Karnataka ePDS State Portal.", "ಕರ್ನಾಟಕ ರಾಜ್ಯ ePDS ಪೋರ್ಟಲ್ ಮೂಲಕ ಡಿಜಿಟಲ್ ಸಹಿ ಮಾಡಲಾಗಿದೆ."),
                        fontSize = 9.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(8.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Action Buttons
        Button(
            onClick = {
                val sendIntent = Intent().apply {
                    action = Intent.ACTION_SEND
                    putExtra(
                        Intent.EXTRA_TEXT,
                        "Karnataka e-KYC Verified!\nName: ${cert.memberName}\nRC: ${cert.rcNumber}\nRef: ${cert.certificateId}\nDate: ${cert.timestamp}"
                    )
                    type = "text/plain"
                }
                context.startActivity(Intent.createChooser(sendIntent, "Share e-KYC Certificate"))
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = BrandEmerald)
        ) {
            Icon(Icons.Default.Share, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text(t("Share Certificate", "ಪ್ರಮಾಣಪತ್ರ ಹಂಚಿಕೊಳ್ಳಿ"), fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }

        Spacer(modifier = Modifier.height(10.dp))

        OutlinedButton(
            onClick = onStartNew,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, BrandNavy)
        ) {
            Text(t("Start New Verification", "ಹೊಸ ಪರಿಶೀಲನೆ ಪ್ರಾರಂಭಿಸಿ"), fontSize = 13.sp, fontWeight = FontWeight.Bold, color = BrandNavy)
        }
    }
}

@Composable
fun CertRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, fontSize = 10.sp, color = Color.Gray)
        Text(text = value, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = BrandNavy)
    }
}

// -------------------------------------------------------------
// DIALOG 1: FACILITIES & BENEFIT GUIDE
// -------------------------------------------------------------
@Composable
fun FacilitiesGuideDialog(
    isKn: Boolean,
    onDismiss: () -> Unit
) {
    fun t(en: String, kn: String): String = if (isKn) kn else en
    val context = LocalContext.current

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .fillMaxHeight(0.85f),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = t("Ration Facilities & Quota Guide", "ಪಡಿತರ ಸೌಲಭ್ಯಗಳು & ಮಾರ್ಗದರ್ಶಿ"),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = BrandNavy
                        )
                        Text(
                            text = t("Karnataka Food & Civil Supplies", "ಕರ್ನಾಟಕ ಆಹಾರ & ನಾಗರಿಕ ಸರಬರಾಜು"),
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp))

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState())
                ) {
                    // Scheme 1: 10kg Rice
                    GuideCard(
                        title = t("10 kg Monthly Rice (Anna Bhagya)", "ಮಾಸಿಕ 10 ಕೆಜಿ ಉಚಿತ ಅಕ್ಕಿ (ಅನ್ನಭಾಗ್ಯ)"),
                        badge = t("FREE / ಉಚಿತ", "ಉಚಿತ"),
                        desc = t(
                            "Every PHH/BPL cardholder gets 5kg Central NFSA + 5kg Karnataka State quota per member every month completely free.",
                            "ಪ್ರತಿ ಬಿಪಿಎಲ್ ಕಾರ್ಡ್ ಸದಸ್ಯರಿಗೆ ತಿಂಗಳಿಗೆ 5 ಕೆಜಿ ಕೇಂದ್ರ ಸರ್ಕಾರದ ಕೋಟಾ + 5 ಕೆಜಿ ರಾಜ್ಯ ಸರ್ಕಾರದ ಕೋಟಾ ಸೇರಿದಂತೆ ಒಟ್ಟು 10 ಕೆಜಿ ಅಕ್ಕಿ ಉಚಿತವಾಗಿ ದೊರೆಯುತ್ತದೆ."
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Scheme 2: Cash DBT
                    GuideCard(
                        title = t("Anna Bhagya Cash Transfer (DBT)", "ಅನ್ನಭಾಗ್ಯ ₹170 ನಗದು ವರ್ಗಾವಣೆ"),
                        badge = "DBT ₹170",
                        desc = t(
                            "In lieu of additional 5kg grains, ₹170 (at ₹34/kg) is credited directly to the Aadhaar-seeded bank account of the Head of Family.",
                            "ಹೆಚ್ಚುವರಿ 5 ಕೆಜಿ ಅಕ್ಕಿಯ ಬದಲಿಗೆ ಪ್ರತಿ ಸದಸ್ಯರಿಗೆ ₹170 ರಂತೆ ಕುಟುಂಬದ ಯಜಮಾನಿಯ ಆಧಾರ್ ಲಿಂಕ್ ಆದ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ಹಣ ಜಮೆಯಾಗುತ್ತದೆ."
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Scheme 3: Gruha Lakshmi
                    GuideCard(
                        title = t("Gruha Lakshmi Scheme", "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ"),
                        badge = "₹2,000 / mo",
                        desc = t(
                            "₹2,000 monthly financial assistance provided to the female Head of Family registered on the Ration Card.",
                            "ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ ನಮೂದಿಸಲಾದ ಕುಟುಂಬದ ಮಹಿಳಾ ಮುಖ್ಯಸ್ಥರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹2,000 ನೇರ ಆರ್ಥಿಕ ನೆರವು."
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Nearest Fair Price Shop Locator
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFF1F5F9))
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(
                                text = t("Locate Nearest Fair Price Shop (FPS)", "ಹತ್ತಿರದ ರೇಷನ್ ಅಂಗಡಿ ಹುಡುಕಿ"),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = BrandNavy
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = t("Find opening hours, stock allocation, and directions to your registered ration dealer.", "ನಿಮ್ಮ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಯ ತೆರೆಯುವ ಸಮಯ, ದಾಸ್ತಾನು ಮತ್ತು ನಕ್ಷೆಯನ್ನು ಪರಿಶೀಲಿಸಿ."),
                                fontSize = 10.sp,
                                color = Color.Gray
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Button(
                                onClick = {
                                    val mapIntent = Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=Fair+Price+Shop+Karnataka"))
                                    context.startActivity(mapIntent)
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = BrandNavy),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(Icons.Default.LocationOn, contentDescription = null, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(t("Open in Google Maps ↗", "ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ನೋಡಿ ↗"), fontSize = 11.sp)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BrandNavy)
                ) {
                    Text(t("Close Guide", "ಮುಚ್ಚಿ"), fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun GuideCard(title: String, badge: String, desc: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
        border = BorderStroke(1.dp, CardBorder)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = BrandNavy, modifier = Modifier.weight(1f))
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = Color(0xFFD1FAE5)
                ) {
                    Text(text = badge, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF065F46), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = desc, fontSize = 10.sp, color = Color(0xFF475569), lineHeight = 14.sp)
        }
    }
}

// -------------------------------------------------------------
// DIALOG 2: AADHAAR & RATION CARD UPDATES & TRANSFER HUB
// -------------------------------------------------------------
@Composable
fun UpdateHubDialog(
    isKn: Boolean,
    initialTab: String = "aadhaar",
    onDismiss: () -> Unit
) {
    fun t(en: String, kn: String): String = if (isKn) kn else en
    val context = LocalContext.current
    var subTab by remember { mutableStateOf(initialTab) } // "aadhaar" or "ration"

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .fillMaxHeight(0.9f),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(18.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = t("Aadhaar & Card Corrections", "ಆಧಾರ್ & ಪಡಿತರ ಚೀಟಿ ತಿದ್ದುಪಡಿ ಕೇಂದ್ರ"),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = BrandNavy
                        )
                        Text(
                            text = t("Official UIDAI & Karnataka Ahara Services", "ಅಧಿಕೃತ ಯುಐಡಿಎಐ & ಕರ್ನಾಟಕ ಆಹಾರ ಇಲಾಖೆ ಸೇವೆಗಳು"),
                            fontSize = 9.sp,
                            color = Color.Gray
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                // Sub-tabs
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 10.dp)
                        .background(Color(0xFFF1F5F9), RoundedCornerShape(10.dp))
                        .padding(3.dp)
                ) {
                    Button(
                        onClick = { subTab = "aadhaar" },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (subTab == "aadhaar") Color.White else Color.Transparent,
                            contentColor = if (subTab == "aadhaar") Color(0xFF2563EB) else Color.Gray
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(vertical = 6.dp)
                    ) {
                        Text(t("Aadhaar (UIDAI)", "ಆಧಾರ್ ಸೇವೆಗಳು"), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = { subTab = "ration" },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (subTab == "ration") Color.White else Color.Transparent,
                            contentColor = if (subTab == "ration") Color(0xFF2563EB) else Color.Gray
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(vertical = 6.dp)
                    ) {
                        Text(t("Ration Card (Ahara)", "ಪಡಿತರ ಚೀಟಿ (ಆಹಾರ)"), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState())
                ) {
                    if (subTab == "aadhaar") {
                        // UIDAI Security Note
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Color(0xFFFEF3C7),
                            border = BorderStroke(1.dp, Color(0xFFFDE68A)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.Top) {
                                Icon(Icons.Default.Lock, contentDescription = null, tint = Color(0xFFD97706), modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = t(
                                        "Government Security Note: UIDAI strictly prohibits 3rd-party apps from modifying Aadhaar records directly. All updates must be submitted via the official myAadhaar portal or at authorized government centres.",
                                        "ಸರ್ಕಾರಿ ಭದ್ರತಾ ನಿಯಮ: ಯಾವುದೇ ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಆ್ಯಪ್‌ಗಳು ಆಧಾರ್ ಡೇಟಾವನ್ನು ನೇರವಾಗಿ ಬದಲಾಯಿಸಲು UIDAI ಅನುಮತಿಸುವುದಿಲ್ಲ. ಎಲ್ಲಾ ತಿದ್ದುಪಡಿಗಳನ್ನು ಅಧಿಕೃತ myAadhaar ಪೋರ್ಟಲ್ ಅಥವಾ ಸರ್ಕಾರಿ ನೋಂದಾಯಿತ ಕೇಂದ್ರಗಳಲ್ಲಿ ಮಾತ್ರ ಮಾಡಬೇಕು."
                                    ),
                                    fontSize = 10.sp,
                                    color = Color(0xFF78350F),
                                    lineHeight = 14.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Aadhaar 1: Update Address Online
                        UpdateItemCard(
                            title = t("Update Address Online", "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಆಧಾರ್ ವಿಳಾಸ ಬದಲಾವಣೆ"),
                            badge = t("ONLINE", "ಆನ್‌ಲೈನ್"),
                            desc = t("Update residential address directly online using valid address proof or Head of Family (HOF) consent.", "ಮಾನ್ಯ ವಿಳಾಸ ದಾಖಲೆ ಅಥವಾ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರ ಒಪ್ಪಿಗೆಯೊಂದಿಗೆ ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಆಧಾರ್ ವಿಳಾಸ ಬದಲಾಯಿಸಿ."),
                            btnLabel = t("Open Official myAadhaar Portal ↗", "ಅಧಿಕೃತ myAadhaar ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ ↗"),
                            btnColor = Color(0xFF2563EB),
                            onAction = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://myaadhaar.uidai.gov.in/"))) }
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        // Aadhaar 2: Link Mobile & Biometrics
                        UpdateItemCard(
                            title = t("Link Mobile Number & Biometrics", "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ & ಬಯೋಮೆಟ್ರಿಕ್ ಲಿಂಕ್"),
                            badge = t("IN-PERSON", "ನೇರ ಭೇಟಿ ಕಡ್ಡಾಯ"),
                            desc = t("To prevent fraud, UIDAI requires in-person biometric authentication at authorized ASK or Post Office centres.", "ವಂಚನೆ ತಡೆಯಲು, ಆಧಾರ್‌ಗೆ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ, ಫೋಟೋ ಮತ್ತು ಬಯೋಮೆಟ್ರಿಕ್ ಲಿಂಕ್ ಮಾಡಲು ಹತ್ತಿರದ ಆಧಾರ್ ಸೇವಾ ಕೇಂದ್ರ (ASK) ಅಥವಾ ಅಂಚೆ ಕಚೇರಿಗೆ ಭೇಟಿ ನೀಡಿ."),
                            btnLabel = t("Locate Nearest Aadhaar Kendra (ASK) ↗", "ಹತ್ತಿರದ ಆಧಾರ್ ಸೇವಾ ಕೇಂದ್ರ ಹುಡುಕಿ ↗"),
                            btnColor = BrandNavy,
                            onAction = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://bws.uidai.gov.in/"))) }
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        // Aadhaar 3: Bank Seeding NPCI
                        UpdateItemCard(
                            title = t("Check Bank Seeding (NPCI Direct Benefit)", "ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಆಧಾರ್ ಲಿಂಕ್ (NPCI ಪರಿಶೀಲನೆ)"),
                            badge = "DBT",
                            desc = t("Verify whether your bank account is active on NPCI mapper to receive Anna Bhagya and Gruha Lakshmi aid.", "ಅನ್ನಭಾಗ್ಯ ₹170 ಮತ್ತು ಗೃಹಲಕ್ಷ್ಮಿ ₹2,000 ಹಣ ಸರಿಯಾಗಿ ಜಮೆಯಾಗಲು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ NPCI ಮ್ಯಾಪಿಂಗ್ ಸಕ್ರಿಯವಾಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ."),
                            btnLabel = t("Check Bank Seeding on UIDAI ↗", "ಬ್ಯಾಂಕ್ ಸೀಡಿಂಗ್ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ ↗"),
                            btnColor = Color(0xFF0F766E),
                            onAction = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://myaadhaar.uidai.gov.in/check-aadhaar-banking-status"))) }
                        )
                    } else {
                        // RATION CARD SUB-TAB

                        // 1. Transfer Card (Within Karnataka)
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            border = BorderStroke(1.dp, Color(0xFF93C5FD))
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = t("Transfer Ration Card (Within Karnataka)", "ಪಡಿತರ ಚೀಟಿ ವರ್ಗಾವಣೆ (ಕರ್ನಾಟಕದೊಳಗೆ)"),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = BrandNavy,
                                        modifier = Modifier.weight(1f)
                                    )
                                    Surface(shape = RoundedCornerShape(6.dp), color = Color(0xFFDBEAFE)) {
                                        Text("SAKALA • ₹25–₹50", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1E40AF), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                    }
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = t("Shift your ration card between districts (e.g. Mysuru to Bengaluru) or change your Fair Price Shop within Karnataka.", "ಕರ್ನಾಟಕದೊಳಗೆ ಒಂದು ಜಿಲ್ಲೆಯಿಂದ ಮತ್ತೊಂದು ಜಿಲ್ಲೆಗೆ (ಉದಾ: ಮೈಸೂರಿನಿಂದ ಬೆಂಗಳೂರಿಗೆ) ವಿಳಾಸ ಬದಲಾವಣೆ ಅಥವಾ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ವರ್ಗಾವಣೆ."),
                                    fontSize = 10.sp,
                                    color = Color(0xFF334155)
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = Color(0xFFFEF3C7)
                                ) {
                                    Text(
                                        text = t("Rule (Aadhaar First): Update your residential address in Aadhaar before applying, as the Ahara ePDS system verifies your new address against UIDAI database.", "ನಿಯಮ (ಆಧಾರ್ ಮೊದಲು): ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮುನ್ನ ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್‌ನಲ್ಲಿ ಹೊಸ ವಿಳಾಸ ಬದಲಾಯಿಸಿರಬೇಕು. ಆಹಾರ ಇಲಾಖೆಯ ತಂತ್ರಾಂಶವು ಆಧಾರ್ ಡೇಟಾವನ್ನು ನೇರವಾಗಿ ಪರಿಶೀಲಿಸುತ್ತದೆ."),
                                        fontSize = 9.sp,
                                        color = Color(0xFF92400E),
                                        modifier = Modifier.padding(6.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = t("Required Proofs: Updated Aadhaar card, Electricity Bill / Rental Agreement / Gas Connection, Existing Ration Card Number, Head of Family Aadhaar OTP/Biometric.", "ಅಗತ್ಯ ದಾಖಲೆಗಳು: ಹೊಸ ವಿಳಾಸವಿರುವ ಆಧಾರ್ ಕಾರ್ಡ್, ವಿದ್ಯುತ್ ಬಿಲ್ / ಬಾಡಿಗೆ ಕರಾರು ಪತ್ರ / ಗ್ಯಾಸ್ ಬಿಲ್, ಪ್ರಸ್ತುತ ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ, ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರ ಆಧಾರ್ OTP / ಬಯೋಮೆಟ್ರಿಕ್."),
                                    fontSize = 10.sp,
                                    color = Color(0xFF475569)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Row {
                                    Button(
                                        onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://ahara.kar.nic.in/"))) },
                                        modifier = Modifier.weight(1f),
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1D4ED8)),
                                        shape = RoundedCornerShape(8.dp),
                                        contentPadding = PaddingValues(vertical = 4.dp)
                                    ) {
                                        Text(t("Apply on Ahara ↗", "ಆಹಾರ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅರ್ಜಿ ↗"), fontSize = 10.sp)
                                    }
                                    Spacer(modifier = Modifier.width(6.dp))
                                    OutlinedButton(
                                        onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://gramaone.karnataka.gov.in/"))) },
                                        modifier = Modifier.weight(1f),
                                        shape = RoundedCornerShape(8.dp),
                                        contentPadding = PaddingValues(vertical = 4.dp)
                                    ) {
                                        Text(t("Grama One ↗", "ಗ್ರಾಮ ಒನ್ ↗"), fontSize = 10.sp)
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // 2. Add Member
                        UpdateItemCard(
                            title = t("Add New Member (Child / Spouse)", "ಹೊಸ ಸದಸ್ಯರ ಸೇರ್ಪಡೆ (ಮಗು / ಸೊಸೆ)"),
                            badge = "SEVA SINDHU",
                            desc = t("Required Proofs: Child's Birth Certificate, Child's Aadhaar (if above 5 yrs), Spouse's Aadhaar & Marriage Certificate, Head of Family consent.", "ಅಗತ್ಯ ದಾಖಲೆಗಳು: ಮಗುವಿನ ಜನನ ಪ್ರಮಾಣಪತ್ರ, ಮಗುವಿನ ಆಧಾರ್, ಸೊಸೆಯ ಆಧಾರ್ & ವಿವಾಹ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ, ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರ ಒಪ್ಪಿಗೆ."),
                            btnLabel = t("Apply on Ahara e-Services ↗", "ಆಹಾರ ಇಲಾಖೆ ಇ-ಸೇವೆಗಳಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ↗"),
                            btnColor = Color(0xFF047857),
                            onAction = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://ahara.karnataka.gov.in/"))) }
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        // 3. Delete Member
                        UpdateItemCard(
                            title = t("Delete / Transfer Member", "ಸದಸ್ಯರ ಹೆಸರು ತೆಗೆದುಹಾಕುವುದು"),
                            badge = "FOOD DEPT",
                            desc = t("Required Proofs: Marriage certificate for daughter/sister moving to spouse's card, or Death certificate for deceased family members.", "ಅಗತ್ಯ ದಾಖಲೆಗಳು: ವಿವಾಹವಾಗಿ ಬೇರೆಡೆ ತೆರಳಿದವರಿಗೆ ಮದುವೆ ಪ್ರಮಾಣಪತ್ರ, ಅಥವಾ ಮರಣ ಹೊಂದಿದ ಸದಸ್ಯರಿಗೆ ಮರಣ ಪ್ರಮಾಣಪತ್ರ."),
                            btnLabel = t("Apply on Seva Sindhu ↗", "ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ↗"),
                            btnColor = BrandNavy,
                            onAction = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://sevasindhu.karnataka.gov.in/"))) }
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        // 4. Change HOF
                        UpdateItemCard(
                            title = t("Change Head of Family (HOF)", "ಕುಟುಂಬದ ಯಜಮಾನಿ ಬದಲಾವಣೆ"),
                            badge = "GRUHA LAKSHMI",
                            desc = t("Required to receive ₹2,000/month Gruha Lakshmi aid. Must designate the eldest adult female.", "ಗೃಹಲಕ್ಷ್ಮಿ ₹2,000 ಹಣ ಪಡೆಯಲು ಕುಟುಂಬದ ಹಿರಿಯ ಮಹಿಳೆಯನ್ನು ಯಜಮಾನಿ ಎಂದು ನಮೂದಿಸಬೇಕು. ಬದಲಾವಣೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."),
                            btnLabel = t("Apply for HOF Change ↗", "ಯಜಮಾನಿ ಬದಲಾವಣೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ↗"),
                            btnColor = Color(0xFFD97706),
                            onAction = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://ahara.karnataka.gov.in/"))) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "Helpline: 1967 • UIDAI: 1947", fontSize = 9.sp, color = Color.Gray)
                    Button(
                        onClick = onDismiss,
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = BrandNavy)
                    ) {
                        Text(t("Close Hub", "ಮುಚ್ಚಿ"), fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun UpdateItemCard(
    title: String,
    badge: String,
    desc: String,
    btnLabel: String,
    btnColor: Color,
    onAction: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, CardBorder)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = BrandNavy, modifier = Modifier.weight(1f))
                Surface(shape = RoundedCornerShape(6.dp), color = Color(0xFFF1F5F9)) {
                    Text(text = badge, fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color(0xFF334155), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = desc, fontSize = 10.sp, color = Color(0xFF475569), lineHeight = 14.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Button(
                onClick = onAction,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = btnColor),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(vertical = 4.dp)
            ) {
                Text(text = btnLabel, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
