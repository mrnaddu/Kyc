/*
 * Adapted from Echo Music's ui/theme/Theme.kt.
 * Copyright (C) Echo Music contributors.
 * SPDX-License-Identifier: GPL-3.0-only
 *
 * Music preferences and bitmap palette extraction were removed for the
 * Karnataka Ration Card e-KYC application on 2026-09-28.
 */
package com.mrnaddu.kyc.ui.theme

import android.os.Build
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

val DefaultThemeColor = Color(0xFFB45309)

@Composable
fun KycTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit,
) {
    val context = LocalContext.current
    val colorScheme = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
    } else {
        lightColorScheme(
            primary = DefaultThemeColor,
            secondary = Color(0xFF881337),
            surface = Color(0xFFFFFFFF),
            background = Color(0xFFF8FAFC),
        )
    }

    MaterialTheme(
        colorScheme = colorScheme,
        shapes = MaterialTheme.shapes.copy(
            extraSmall = RoundedCornerShape(24.dp),
        ),
        content = content,
    )
}
