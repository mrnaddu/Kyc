package com.mrnaddu.kyc.model

import android.graphics.Bitmap

data class Member(
    val id: String,
    val nameEn: String,
    val nameKn: String,
    val relation: String,
    val gender: String,
    val age: String,
    val aadhaarLast4: String,
    val ekyc: String // "VERIFIED" or "PENDING"
)

data class HeadOfFamily(
    val nameEn: String,
    val nameKn: String
)

data class FpsLocation(
    val fpsDealerName: String,
    val fpsCode: String,
    val district: String,
    val taluk: String
)

data class RationCardData(
    val rcNumber: String,
    val cardType: String,
    val headOfFamily: HeadOfFamily,
    val members: List<Member>,
    val location: FpsLocation
)

data class KycCertificate(
    val certificateId: String,
    val rcNumber: String,
    val memberName: String,
    val memberRelation: String,
    val aadhaarMasked: String,
    val timestamp: String,
    val fpsName: String,
    val status: String = "VERIFIED",
    val photo: Bitmap? = null
)

data class CaptchaData(
    val code: String,
    val token: String
)
