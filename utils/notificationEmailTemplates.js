// utils/notificationEmailTemplates.js

/* ─────────────────────────────────────────────────────────
   Design tokens — matches emailTemplates.js
   ───────────────────────────────────────────────────────── */
const brand = {
  primary: '#222222',
  primaryDark: '#111111',
  surface: '#FAFAFA',
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  textDark: '#1A1A1A',
  textMid: '#555555',
  textLight: '#888888',
  white: '#FFFFFF',
  radius: '16px',
  radiusSm: '12px',
  year: new Date().getFullYear(),
};

/* ═══════════════════════════════════════════════════════════
   PROMOTIONAL / NOTIFICATION EMAIL
   ═══════════════════════════════════════════════════════════ */
const getPromotionalEmailHTML = (
  username,
  subject,
  message,
  imageUrl = null,
  buttonText = null,
  buttonLink = null
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
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
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;font-size:1px;color:${brand.surface};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${message.replace(/<[^>]*>/g, '').substring(0, 120)}&hellip;
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.surface};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${brand.white};border-radius:${brand.radius};border:1px solid ${brand.border};overflow:hidden;">

          <!-- ── Header band ── -->
          <tr>
            <td style="background-color:${brand.primary};padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="#" style="text-decoration:none;">
                      <span style="font-size:20px;font-weight:800;color:${brand.white};letter-spacing:1px;">NOTERVO</span>
                    </a>
                  </td>
                  <td style="text-align:right;">
                    <span style="font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;">Newsletter</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Hero image (optional) ── -->
          ${imageUrl ? `
          <tr>
            <td style="padding:0;line-height:0;">
              <a href="${buttonLink || '#'}" style="text-decoration:none;">
                <img
                  src="${imageUrl}"
                  alt="${subject}"
                  width="560"
                  style="display:block;width:100%;max-width:560px;height:auto;border:0;"
                />
              </a>
            </td>
          </tr>
          ` : ''}

          <!-- ── Content ── -->
          <tr>
            <td style="padding:${imageUrl ? '28px' : '36px'} 32px 16px;">
              <!-- Subject heading -->
              <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:${brand.textDark};letter-spacing:-0.3px;line-height:1.3;">
                ${subject}
              </h1>

              <!-- Greeting -->
              <p style="margin:0 0 20px;font-size:13px;color:${brand.textLight};">
                Hi <strong style="color:${brand.textMid};">${username}</strong>
              </p>

              <!-- Separator -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid ${brand.borderLight};padding-top:20px;">
                  </td>
                </tr>
              </table>

              <!-- Message body -->
              <div style="font-size:14px;color:${brand.textMid};line-height:1.7;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </td>
          </tr>

          <!-- ── CTA button (optional) ── -->
          ${buttonText && buttonLink ? `
          <tr>
            <td style="padding:8px 32px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:${brand.primary};border-radius:${brand.radiusSm};">
                    <a href="${buttonLink}" target="_blank" style="display:inline-block;padding:14px 40px;color:${brand.white};font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
                      ${buttonText} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : `
          <tr>
            <td style="padding:0 32px 32px;"></td>
          </tr>
          `}

          <!-- ── Footer ── -->
          <tr>
            <td style="background-color:${brand.surface};padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <!-- Divider message -->
                <tr>
                  <td style="text-align:center;padding-bottom:16px;">
                    <p style="margin:0;font-size:11px;color:${brand.textLight};line-height:1.6;">
                      You received this email because you subscribed to Notervo updates.
                    </p>
                  </td>
                </tr>

                <!-- Brand + copyright -->
                <tr>
                  <td style="text-align:center;border-top:1px solid ${brand.border};padding-top:16px;">
                    <span style="font-size:14px;font-weight:800;color:${brand.textLight};letter-spacing:1px;">NOTERVO</span>
                    <p style="margin:6px 0 0;font-size:10px;color:${brand.textLight};">
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

module.exports = {
  getPromotionalEmailHTML,
};