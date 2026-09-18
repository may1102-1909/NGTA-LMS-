# NGTA LMS — Requirements from Client (`want.md`)
> **Document Purpose:** This document lists all third-party services, API credentials, infrastructure inputs, and brand assets required from you (the client/admin) to enable live capabilities in **NGTA LMS**.
> 
> *Note: In accordance with BRD Section 50, whenever an external integration is missing, the system will mark the integration as `CAPABILITY_REQUIRED` with a mockable fallback for autonomous local development until live credentials are provided.*

---

## Priority 1: High Priority (Core Commerce & User Delivery)

### 1. Payment Gateway (India Rails: UPI, NetBanking, Cards, Wallets)
The BRD specifies native Indian payment options (UPI, Rupay/Cards, NetBanking). 
*Recommended Provider: **Razorpay** or **Cashfree***
- [ ] **Provider Selected:** (e.g., Razorpay / Cashfree / Stripe)
- [ ] **API Key ID / App ID:** `________________________________`
- [ ] **API Key Secret:** `________________________________`
- [ ] **Webhook Signing Secret:** `________________________________`
- [ ] **Currency Setting:** `INR` (Default)

### 2. Transactional Email Service (Auth & Notifications)
For welcome emails, OTP/password resets, purchase invoices, live class links, and certificate issuance notifications.
*Recommended Provider: **Resend**, **SendGrid**, or **AWS SES***
- [ ] **Provider Selected:** (e.g., Resend / SendGrid / Custom SMTP)
- [ ] **API Key / SMTP Password:** `________________________________`
- [ ] **From Email Address:** (e.g., `learn@ngta.in` or `notifications@nextgentestingacademy.com`)
- [ ] **Sender Name:** `NextGen Testing Academy`

### 3. Video Hosting & Content Delivery
For course video storage, fast adaptive bitrate playback, playback resume, and download prevention.
*Recommended Provider: **Cloudflare Stream**, **Mux**, or **AWS S3 + CloudFront***
- [ ] **Provider Selected:** (e.g., Cloudflare Stream / Mux / AWS S3 / Bunny.net)
- [ ] **API Key / Token:** `________________________________`
- [ ] **Account / Organization ID:** `________________________________`
- [ ] **Storage Bucket / CDN URL:** `________________________________`

---

## Priority 2: Engagement & Communication

### 4. WhatsApp Cloud API / Provider
*BRD Section 26 specifies: "WhatsApp integration must use an approved API provider. If unavailable, classify as CAPABILITY_REQUIRED. Do not fake the integration."*
*Options: **Meta WhatsApp Cloud API**, **Twilio**, or **Gupshup***
- [ ] **Provider Selected:** `________________________________`
- [ ] **WhatsApp Business Account ID (WABA ID):** `________________________________`
- [ ] **Phone Number ID:** `________________________________`
- [ ] **Permanent Access Token:** `________________________________`
- [ ] **Approved Message Template Names:** (e.g., `course_welcome`, `live_class_reminder`, `payment_success`)

### 5. Live Classes & 1-on-1 Consultation Provider
For webinars, workshops, cohort sessions, and 1-on-1 consultations (BRD Sections 24 & 25).
*Options: **Zoom API**, **Google Meet**, or **Dyte / 100ms** (for embedded in-app video)*
- [ ] **Provider Selected:** (e.g., Zoom Server-to-Server OAuth / Google Calendar / Dyte)
- [ ] **Client ID / App Key:** `________________________________`
- [ ] **Client Secret:** `________________________________`
- [ ] **Account ID / Webhook Secret:** `________________________________`

---

## Priority 3: Authentication & Identity

### 6. Social Logins (Future-Ready OAuth)
- [ ] **Google OAuth Client ID:** `________________________________`
- [ ] **Google OAuth Client Secret:** `________________________________`
- [ ] **(Optional) Microsoft OAuth Client ID / Secret:** `________________________________`

---

## Priority 4: Branding & Business Metadata

### 7. Brand Assets (Swiss Style Theming)
- [ ] **Official Logo:** (Vector SVG preferred, or transparent high-res PNG)
- [ ] **Favicon:** (.ico or .png)
- [ ] **Primary Brand Hex Color:** (Default Swiss Accent: International Klein Blue `#0038FF` or Vermillion `#FF3B30`)
- [ ] **Academy Contact Email:** (e.g., `support@ngta.in`)
- [ ] **Company Legal Name & GSTIN:** (For automated invoices and checkout tax calculation)
- [ ] **Default Certificate Signatory Name & Signature Image:** (For automatic PDF certificate generation)

---

## Summary of Initial Capability Status

| Capability | Status | Fallback Strategy During Development |
| :--- | :--- | :--- |
| **Database** | Ready | Local SQLite / PostgreSQL dev instance |
| **Authentication** | Ready | Secure JWT + Argon2/Bcrypt email-password & RBAC session engine |
| **Payments (Razorpay/UPI)** | `CAPABILITY_REQUIRED` | Test sandbox mode / Mock gateway flow until keys provided |
| **WhatsApp Notifications** | `CAPABILITY_REQUIRED` | Queued in notification event log without faking network layer |
| **Email Delivery** | `CAPABILITY_REQUIRED` | Console logger / Local test preview mailer |
| **Video Storage** | `CAPABILITY_REQUIRED` | Local media server / direct stream preview |
| **Live Classes (Zoom/Dyte)**| `CAPABILITY_REQUIRED` | Direct calendar & meeting link generation engine |
