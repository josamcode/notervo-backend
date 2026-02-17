// utils/emailTemplates.js
require('dotenv').config();

const SECOND_BASE_URL = process.env.SECOND_BASE_URL;

/* ─────────────────────────────────────────────────────────
   Shared design tokens — single source of truth
   ───────────────────────────────────────────────────────── */
const brand = {
  primary: '#222222',
  primaryDark: '#111111',
  surface: '#FAFAFA',
  border: '#E8E8E8',
  textDark: '#1A1A1A',
  textMid: '#555555',
  textLight: '#888888',
  success: '#16A34A',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  white: '#FFFFFF',
  radius: '16px',
  radiusSm: '12px',
  year: new Date().getFullYear(),
};

/* ─────────────────────────────────────────────────────────
   Base layout wrapper — used by every template
   ───────────────────────────────────────────────────────── */
const baseLayout = (title, body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${brand.surface};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.surface};">
    <tr>
      <td align="center" style="padding:40px 5px;">

        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:${brand.white};border-radius:${brand.radius};border:1px solid ${brand.border};overflow:hidden;">

          <!-- Logo header -->
          <tr>
            <td style="background-color:${brand.primary};padding:28px 32px;text-align:center;">
              <a href="${SECOND_BASE_URL}" style="text-decoration:none;">
                <span style="font-size:22px;font-weight:800;color:${brand.white};letter-spacing:1px;">NOTERVO</span>
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid ${brand.border};padding-top:20px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:${brand.textLight};line-height:1.6;">
                      &copy; ${brand.year} Notervo. All rights reserved.<br>
                      Minimal notebooks for focused work and clear thinking.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
</body>
</html>`;

/* ─────────────────────────────────────────────────────────
   Reusable button component
   ───────────────────────────────────────────────────────── */
const buttonHTML = (text, href, bgColor = brand.primary) => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 0;">
  <tr>
    <td align="center" style="background-color:${bgColor};border-radius:${brand.radiusSm};">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 36px;color:${brand.white};font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
        ${text}
      </a>
    </td>
  </tr>
</table>`;

/* ─────────────────────────────────────────────────────────
   Status icon (checkmark / X / warning)
   ───────────────────────────────────────────────────────── */
const statusBadge = (type) => {
  const configs = {
    success: { bg: brand.successBg, border: brand.successBorder, color: brand.success, icon: '&#10003;' },
    error: { bg: brand.errorBg, border: brand.errorBorder, color: brand.error, icon: '&#10007;' },
    warning: { bg: '#FFFBEB', border: '#FDE68A', color: '#D97706', icon: '&#9888;' },
  };
  const c = configs[type] || configs.warning;
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
    <tr>
      <td style="width:56px;height:56px;border-radius:50%;background-color:${c.bg};border:2px solid ${c.border};text-align:center;vertical-align:middle;font-size:24px;color:${c.color};line-height:52px;">
        ${c.icon}
      </td>
    </tr>
  </table>`;
};

/* ═══════════════════════════════════════════════════════════
   1. VERIFICATION EMAIL (sent to inbox)
   ═══════════════════════════════════════════════════════════ */
const getVerificationEmailHTML = (username, verificationUrl) =>
  baseLayout('Verify Your Email — Notervo', `
    <!-- Icon -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
      <tr>
        <td style="width:56px;height:56px;border-radius:50%;background-color:#EFF6FF;border:2px solid #BFDBFE;text-align:center;vertical-align:middle;font-size:24px;color:#2563EB;line-height:52px;">
          &#9993;
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${brand.textDark};text-align:center;letter-spacing:-0.3px;">
      Verify your email
    </h1>
    <p style="margin:0 0 20px;font-size:14px;color:${brand.textMid};text-align:center;line-height:1.6;">
      Hi <strong>${username}</strong>, thanks for signing up! Please confirm your email address to activate your account.
    </p>

    ${buttonHTML('Verify Email Address', verificationUrl)}

    <!-- Fallback link -->
    <p style="margin:24px 0 0;font-size:12px;color:${brand.textLight};text-align:center;line-height:1.6;">
      If the button doesn't work, copy and paste this link:<br>
      <a href="${verificationUrl}" style="color:${brand.textMid};word-break:break-all;font-size:11px;">${verificationUrl}</a>
    </p>

    <!-- Expiry notice -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td style="background-color:${brand.surface};border-radius:${brand.radiusSm};padding:14px 16px;text-align:center;">
          <p style="margin:0;font-size:12px;color:${brand.textLight};">
            &#9202; This link will expire in <strong style="color:${brand.textMid};">24 hours</strong>
          </p>
        </td>
      </tr>
    </table>
  `);


/* ═══════════════════════════════════════════════════════════
   2. EMAIL VERIFIED SUCCESS (browser page)
   ═══════════════════════════════════════════════════════════ */
const getEmailVerificationSuccessHTML = (username) =>
  baseLayout('Email Verified — Notervo', `
    ${statusBadge('success')}

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${brand.textDark};text-align:center;letter-spacing:-0.3px;">
      Email verified!
    </h1>
    <p style="margin:0 0 6px;font-size:14px;color:${brand.success};text-align:center;font-weight:600;">
      Thank you, ${username}.
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:${brand.textMid};text-align:center;line-height:1.6;">
      Your email address has been confirmed. You can now log in using your email or phone number.
    </p>

    ${buttonHTML('Go to Login', `${SECOND_BASE_URL}/login`)}

    <!-- Auto-redirect notice -->
    <p style="margin:20px 0 0;font-size:12px;color:${brand.textLight};text-align:center;">
      Redirecting to login in 5 seconds&hellip;
    </p>

    <script>
      setTimeout(function() {
        window.location.href = '${SECOND_BASE_URL}/login';
      }, 5000);
    </script>
  `);


/* ═══════════════════════════════════════════════════════════
   3. INVALID / EXPIRED TOKEN (browser page)
   ═══════════════════════════════════════════════════════════ */
const getInvalidTokenHTML = () =>
  baseLayout('Verification Failed — Notervo', `
    ${statusBadge('error')}

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${brand.textDark};text-align:center;letter-spacing:-0.3px;">
      Verification failed
    </h1>
    <p style="margin:0 0 20px;font-size:14px;color:${brand.textMid};text-align:center;line-height:1.6;">
      This verification link is <strong style="color:${brand.error};">invalid or expired</strong>. Please check the link in your email or register for a new account.
    </p>

    ${buttonHTML('Register Again', `${SECOND_BASE_URL}/register`)}

    <p style="margin:16px 0 0;font-size:13px;text-align:center;">
      <a href="${SECOND_BASE_URL}/login" style="color:${brand.textMid};text-decoration:underline;">Go to Login</a>
    </p>
  `);


/* ═══════════════════════════════════════════════════════════
   4. MISSING TOKEN (browser page)
   ═══════════════════════════════════════════════════════════ */
const getMissingTokenHTML = () =>
  baseLayout('Verification Error — Notervo', `
    ${statusBadge('warning')}

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${brand.textDark};text-align:center;letter-spacing:-0.3px;">
      Missing verification token
    </h1>
    <p style="margin:0 0 20px;font-size:14px;color:${brand.textMid};text-align:center;line-height:1.6;">
      No verification token was provided. Make sure you're using the complete link from your email.
    </p>

    ${buttonHTML('Go to Login', `${SECOND_BASE_URL}/login`)}
  `);


/* ═══════════════════════════════════════════════════════════
   5. GENERIC ERROR (browser page)
   ═══════════════════════════════════════════════════════════ */
const getGenericVerificationErrorHTML = () =>
  baseLayout('Verification Error — Notervo', `
    ${statusBadge('error')}

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${brand.textDark};text-align:center;letter-spacing:-0.3px;">
      Something went wrong
    </h1>
    <p style="margin:0 0 20px;font-size:14px;color:${brand.textMid};text-align:center;line-height:1.6;">
      An error occurred during email verification. Please try again later or contact our support team.
    </p>

    ${buttonHTML('Go to Login', `${SECOND_BASE_URL}/login`)}

    <p style="margin:16px 0 0;font-size:13px;text-align:center;">
      <a href="${SECOND_BASE_URL}/register" style="color:${brand.textMid};text-decoration:underline;">Register again</a>
    </p>
  `);


module.exports = {
  getVerificationEmailHTML,
  getEmailVerificationSuccessHTML,
  getInvalidTokenHTML,
  getMissingTokenHTML,
  getGenericVerificationErrorHTML,
};