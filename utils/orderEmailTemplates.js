// utils/orderEmailTemplates.js

/* ─────────────────────────────────────────────────────────
   Design tokens — matches emailTemplates.js
   ───────────────────────────────────────────────────────── */
const brand = {
  primary: '#222222',
  surface: '#FAFAFA',
  surfaceAlt: '#F5F5F5',
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  textDark: '#1A1A1A',
  textMid: '#555555',
  textLight: '#888888',
  textFaint: '#AAAAAA',
  white: '#FFFFFF',
  success: '#16A34A',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',
  radius: '16px',
  radiusSm: '12px',
  radiusXs: '8px',
  year: new Date().getFullYear(),
};

/* ─────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────── */
const getOrderDisplayId = (order) => {
  if (order?.orderNumber) return order.orderNumber;
  const rawId = order?._id?.toString?.() || '';
  if (!rawId) return 'N/A';
  return `NTV-${rawId.slice(-6).toUpperCase()}`;
};

const capitalizeState = (value) => {
  if (!value || typeof value !== 'string') return 'N/A';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
};

const formatPrice = (num) => {
  if (typeof num !== 'number') return '0.00';
  return num.toFixed(2);
};

/* ─────────────────────────────────────────────────────────
   Base layout — shared by all order emails
   ───────────────────────────────────────────────────────── */
const baseLayout = (title, headerTitle, headerSubtitle, body, footerNote) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${brand.surface};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <div style="display:none;font-size:1px;color:${brand.surface};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${headerSubtitle.replace(/<[^>]*>/g, '')}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.surface};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background-color:${brand.white};border-radius:${brand.radius};border:1px solid ${brand.border};overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:${brand.primary};padding:28px 32px;text-align:center;">
              <a href="#" style="text-decoration:none;">
                <span style="font-size:20px;font-weight:800;color:${brand.white};letter-spacing:1px;">NOTERVO</span>
              </a>
              <h1 style="margin:16px 0 4px;font-size:24px;font-weight:800;color:${brand.white};letter-spacing:-0.3px;">
                ${headerTitle}
              </h1>
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.65);">
                ${headerSubtitle}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${brand.surfaceAlt};padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${footerNote ? `
                <tr>
                  <td style="text-align:center;padding-bottom:14px;">
                    <p style="margin:0;font-size:12px;color:${brand.textMid};line-height:1.5;">
                      ${footerNote}
                    </p>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="text-align:center;${footerNote ? `border-top:1px solid ${brand.border};padding-top:14px;` : ''}">
                    <span style="font-size:13px;font-weight:800;color:${brand.textLight};letter-spacing:1px;">NOTERVO</span>
                    <p style="margin:4px 0 0;font-size:10px;color:${brand.textFaint};">
                      &copy; ${brand.year} Notervo. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

/* ─────────────────────────────────────────────────────────
   Section heading
   ───────────────────────────────────────────────────────── */
const sectionHeading = (text, icon = '') => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
  <tr>
    <td style="font-size:14px;font-weight:700;color:${brand.textDark};letter-spacing:-0.2px;border-bottom:2px solid ${brand.borderLight};padding-bottom:8px;">
      ${icon ? `<span style="margin-right:6px;">${icon}</span>` : ''}${text}
    </td>
  </tr>
</table>`;

/* ─────────────────────────────────────────────────────────
   Info row
   ───────────────────────────────────────────────────────── */
const infoRow = (label, value) => `
<tr>
  <td style="padding:6px 0;font-size:13px;color:${brand.textLight};width:140px;vertical-align:top;">
    ${label}
  </td>
  <td style="padding:6px 0;font-size:13px;color:${brand.textDark};font-weight:600;">
    ${value}
  </td>
</tr>`;

/* ─────────────────────────────────────────────────────────
   Items table
   ───────────────────────────────────────────────────────── */
const itemsTable = (items) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0;">
  <!-- Table header -->
  <tr>
    <td style="padding:10px 12px;font-size:11px;font-weight:700;color:${brand.textLight};text-transform:uppercase;letter-spacing:0.5px;background-color:${brand.surfaceAlt};border-radius:${brand.radiusXs} 0 0 0;">Product</td>
    <td style="padding:10px 12px;font-size:11px;font-weight:700;color:${brand.textLight};text-transform:uppercase;letter-spacing:0.5px;background-color:${brand.surfaceAlt};text-align:center;width:50px;">Qty</td>
    <td style="padding:10px 12px;font-size:11px;font-weight:700;color:${brand.textLight};text-transform:uppercase;letter-spacing:0.5px;background-color:${brand.surfaceAlt};text-align:right;width:80px;">Price</td>
    <td style="padding:10px 12px;font-size:11px;font-weight:700;color:${brand.textLight};text-transform:uppercase;letter-spacing:0.5px;background-color:${brand.surfaceAlt};text-align:right;border-radius:0 ${brand.radiusXs} 0 0;width:90px;">Total</td>
  </tr>

  ${items
    .map((item, i) => {
      const originalPrice = Number(item.originalPrice);
      const finalPrice = Number(item.price);
      const showOriginal = Number.isFinite(originalPrice) && originalPrice > finalPrice;

      const priceCell = showOriginal
        ? `
          <div style="font-size:10px;color:${brand.textLight};text-decoration:line-through;">
            ${formatPrice(originalPrice)}
          </div>
          <div style="font-size:13px;color:${brand.textDark};font-weight:700;">
            ${formatPrice(finalPrice)}
          </div>
        `
        : formatPrice(finalPrice);

      const totalCell = showOriginal
        ? `
          <div style="font-size:10px;color:${brand.textLight};text-decoration:line-through;">
            ${formatPrice(originalPrice * item.quantity)}
          </div>
          <div style="font-size:13px;color:${brand.textDark};font-weight:700;">
            ${formatPrice(finalPrice * item.quantity)}
          </div>
        `
        : formatPrice(finalPrice * item.quantity);

      return `
        <tr>
          <td style="padding:12px;font-size:13px;color:${brand.textDark};border-bottom:1px solid ${brand.borderLight};${i === 0 ? 'border-top:none;' : ''}">
            <strong>${item.name}</strong>
            ${item.color || item.size
          ? `<br><span style="font-size:11px;color:${brand.textLight};">${item.color ? item.color : ''}${item.color && item.size ? ' &middot; ' : ''}${item.size ? item.size : ''}</span>`
          : ''
        }
          </td>
          <td style="padding:12px;font-size:13px;color:${brand.textMid};border-bottom:1px solid ${brand.borderLight};text-align:center;">
            &times;${item.quantity}
          </td>
          <td style="padding:12px;font-size:13px;color:${brand.textMid};border-bottom:1px solid ${brand.borderLight};text-align:right;">
            ${priceCell}
          </td>
          <td style="padding:12px;font-size:13px;color:${brand.textDark};font-weight:600;border-bottom:1px solid ${brand.borderLight};text-align:right;">
            ${totalCell}
          </td>
        </tr>
      `;
    })
    .join('')}
</table>`;

/* ─────────────────────────────────────────────────────────
   Totals block
   ───────────────────────────────────────────────────────── */
const totalsBlock = (savedOrder, finalCoupon, discountValue) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
  ${finalCoupon ? `
  <tr>
    <td style="padding:8px 12px;font-size:13px;color:${brand.textMid};text-align:right;">
      Discount <span style="background-color:${brand.surfaceAlt};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;color:${brand.textDark};margin-left:4px;">${finalCoupon}</span>
    </td>
    <td style="padding:8px 12px;font-size:13px;color:#DC2626;font-weight:600;text-align:right;width:100px;">
      -${formatPrice(discountValue)} EGP
    </td>
  </tr>` : ''}
  <tr>
    <td style="padding:8px 12px;font-size:13px;color:${brand.textLight};text-align:right;">
      Shipping
    </td>
    <td style="padding:8px 12px;font-size:13px;color:${brand.success};font-weight:600;text-align:right;width:100px;">
      Free
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding:0 12px;">
      <div style="border-top:2px dashed ${brand.border};margin:6px 0;"></div>
    </td>
  </tr>
  <tr>
    <td style="padding:10px 12px;font-size:16px;font-weight:800;color:${brand.textDark};text-align:right;">
      Total
    </td>
    <td style="padding:10px 12px;font-size:18px;font-weight:800;color:${brand.textDark};text-align:right;width:100px;">
      ${formatPrice(savedOrder.total)} <span style="font-size:12px;font-weight:600;color:${brand.textLight};">EGP</span>
    </td>
  </tr>
</table>`;

/* ═══════════════════════════════════════════════════════════
   1. ORDER CONFIRMATION — sent to customer
   ═══════════════════════════════════════════════════════════ */
const getOrderConfirmationHTML = (user, savedOrder, finalCoupon, discountValue) => {
  const orderId = getOrderDisplayId(savedOrder);
  const address = savedOrder.shippingAddress || {};

  const body = `
    <!-- Success badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
      <tr>
        <td style="width:52px;height:52px;border-radius:50%;background-color:${brand.successBg};border:2px solid ${brand.successBorder};text-align:center;vertical-align:middle;font-size:22px;color:${brand.success};line-height:48px;">
          &#10003;
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px;text-align:center;font-size:14px;color:${brand.textMid};line-height:1.6;">
      Thank you, <strong style="color:${brand.textDark};">${user.username}</strong>! Your order has been placed successfully.
    </p>

    <!-- Order meta card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.surfaceAlt};border-radius:${brand.radiusSm};margin-bottom:24px;">
      <tr>
        <td style="padding:18px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${infoRow('Order ID', `<span style="font-family:monospace;letter-spacing:0.5px;">${orderId}</span>`)}
            ${infoRow('Date', formatDate(savedOrder.createdAt))}
            ${infoRow('Payment', 'Cash on delivery')}
            ${infoRow('Ship to', `${address.street || ''}${address.city ? `, ${address.city}` : ''}${address.country ? `, ${address.country}` : ''}`)}
          </table>
        </td>
      </tr>
    </table>

    <!-- Items -->
    ${sectionHeading('Order Items', '&#128230;')}
    ${itemsTable(savedOrder.items)}
    ${totalsBlock(savedOrder, finalCoupon, discountValue)}

    <!-- What's next -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
      <tr>
        <td style="background-color:#EFF6FF;border-radius:${brand.radiusSm};padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1D4ED8;">
            &#128337; What happens next?
          </p>
          <p style="margin:0;font-size:12px;color:#3B82F6;line-height:1.6;">
            We'll review and process your order shortly. You'll receive email updates as your order progresses through each stage.
          </p>
        </td>
      </tr>
    </table>
  `;

  return baseLayout(
    'Order Confirmed — Notervo',
    'Order Confirmed',
    `Order #${orderId}`,
    body,
    'If you have any questions about your order, reply to this email and we will help.'
  );
};

/* ═══════════════════════════════════════════════════════════
   2. NEW ORDER NOTIFICATION — sent to admin
   ═══════════════════════════════════════════════════════════ */
const getNewOrderNotificationHTML = (user, savedOrder, finalCoupon, discountValue) => {
  const orderId = getOrderDisplayId(savedOrder);
  const address = savedOrder.shippingAddress || {};

  const body = `
    <!-- Urgency badge -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#FEF3C7;border:1px solid #FDE68A;border-radius:${brand.radiusSm};padding:14px 18px;text-align:center;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#92400E;">
            &#128276; New order requires processing
          </p>
        </td>
      </tr>
    </table>

    <!-- Customer info -->
    ${sectionHeading('Customer Information', '&#128100;')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.surfaceAlt};border-radius:${brand.radiusSm};margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${infoRow('Name', user.username)}
            ${infoRow('Email', user.email || 'Not provided')}
            ${infoRow('Phone', user.phone || 'Not provided')}
          </table>
        </td>
      </tr>
    </table>

    <!-- Order info -->
    ${sectionHeading('Order Details', '&#128203;')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.surfaceAlt};border-radius:${brand.radiusSm};margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${infoRow('Order ID', `<span style="font-family:monospace;letter-spacing:0.5px;">${orderId}</span>`)}
            ${infoRow('Date', formatDate(savedOrder.createdAt))}
            ${infoRow('Payment', 'Cash on delivery')}
            ${infoRow('Address', `${address.street || ''}${address.city ? `, ${address.city}` : ''}${address.country ? `, ${address.country}` : ''}`)}
          </table>
        </td>
      </tr>
    </table>

    <!-- Items -->
    ${sectionHeading('Items Ordered', '&#128230;')}
    ${itemsTable(savedOrder.items)}
    ${totalsBlock(savedOrder, finalCoupon, discountValue)}
  `;

  return baseLayout(
    'New Order — Notervo Admin',
    'New Order Received',
    `Order #${orderId} &middot; ${user.username}`,
    body,
    'Please process this order as soon as possible.'
  );
};

/* ═══════════════════════════════════════════════════════════
   3. ORDER STATUS UPDATE — sent to customer
   ═══════════════════════════════════════════════════════════ */
const stateConfig = {
  pending: { heading: 'Order Received', icon: '&#128230;', accent: '#4F46E5', accentBg: '#EEF2FF', accentBorder: '#C7D2FE', intro: 'We have received your order and it is waiting for processing.', message: 'Our team will review your order shortly and move it to processing as soon as possible.', step: 1 },
  processing: { heading: 'Order In Processing', icon: '&#9881;', accent: '#D97706', accentBg: '#FFFBEB', accentBorder: '#FDE68A', intro: 'Your order is now being prepared.', message: 'We are currently picking and packing your items. We will notify you once it ships.', step: 2 },
  shipped: { heading: 'Order Shipped', icon: '&#128666;', accent: '#0284C7', accentBg: '#F0F9FF', accentBorder: '#BAE6FD', intro: 'Great news — your order is on the way!', message: 'Your package has left our facility and is heading to your shipping address.', step: 3 },
  delivered: { heading: 'Order Delivered', icon: '&#10003;', accent: '#16A34A', accentBg: '#F0FDF4', accentBorder: '#BBF7D0', intro: 'Your order has been delivered.', message: 'We hope you enjoy your purchase! If anything is wrong, contact us and we will help.', step: 4 },
  cancelled: { heading: 'Order Cancelled', icon: '&#10007;', accent: '#DC2626', accentBg: '#FEF2F2', accentBorder: '#FECACA', intro: 'Your order has been cancelled.', message: 'If this cancellation was unexpected or you need help placing a new order, contact us.', step: 0 },
};

const buildProgressTracker = (currentStep) => {
  if (currentStep === 0) return ''; // cancelled — no tracker

  const steps = [
    { label: 'Received', num: 1 },
    { label: 'Processing', num: 2 },
    { label: 'Shipped', num: 3 },
    { label: 'Delivered', num: 4 },
  ];

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      ${steps.map((s, i) => {
    const done = s.num <= currentStep;
    const active = s.num === currentStep;
    const dotColor = done ? brand.success : brand.border;
    const labelColor = active ? brand.success : done ? brand.textMid : brand.textFaint;
    const labelWeight = active ? '700' : '400';

    return `
        <td style="text-align:center;width:25%;vertical-align:top;">
          <!-- Dot -->
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="width:28px;height:28px;border-radius:50%;background-color:${done ? brand.successBg : brand.surfaceAlt};border:2px solid ${dotColor};text-align:center;vertical-align:middle;font-size:12px;color:${dotColor};line-height:24px;font-weight:700;">
                ${done ? '&#10003;' : s.num}
              </td>
            </tr>
          </table>
          <p style="margin:6px 0 0;font-size:10px;color:${labelColor};font-weight:${labelWeight};letter-spacing:0.3px;">
            ${s.label}
          </p>
        </td>
        ${i < steps.length - 1 ? `
        <td style="vertical-align:top;padding-top:14px;width:0;">
          <div style="height:2px;background-color:${s.num < currentStep ? brand.success : brand.border};margin:0 -8px;"></div>
        </td>` : ''}`;
  }).join('')}
    </tr>
  </table>`;
};

const buildStatusBriefing = (cfg, readableCurr, readablePrev, state) => {
  const professionalCopy = {
    pending: {
      title: "Order received and queued",
      body: "Your order has been created successfully and is waiting for confirmation by our operations team.",
      next: "Next step: We will start preparation and send another update once processing begins.",
    },
    processing: {
      title: "Preparation is in progress",
      body: "Your items are currently being picked, quality-checked, and packed for shipment.",
      next: "Next step: We will notify you immediately when your order is handed to the courier.",
    },
    shipped: {
      title: "Shipment is in transit",
      body: "Your package has left our facility and is currently moving through the courier network.",
      next: "Next step: Delivery is the final stage. Keep your phone available for courier contact.",
    },
    delivered: {
      title: "Delivery completed",
      body: "The courier marked this order as delivered. We hope everything arrived in excellent condition.",
      next: "Next step: If anything is missing or damaged, contact support and we will resolve it quickly.",
    },
    cancelled: {
      title: "Order cancellation confirmed",
      body: "This order is now closed and no further processing will take place.",
      next: "Next step: If cancellation was unintended, contact support to place a replacement order.",
    },
  };

  const copy = professionalCopy[state] || {
    title: "Order status updated",
    body: "We have recorded a new status update for your order.",
    next: "Next step: We will send additional updates if anything changes.",
  };

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="background-color:${cfg.accentBg};border:1px solid ${cfg.accentBorder};border-radius:${brand.radiusSm};padding:18px 20px;">
          <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${brand.textLight};">Status Briefing</p>
          <p style="margin:0 0 10px;font-size:18px;font-weight:800;color:${cfg.accent};letter-spacing:-0.2px;">${copy.title}</p>
          <p style="margin:0 0 10px;font-size:13px;color:${brand.textMid};line-height:1.7;">${copy.body}</p>
          <p style="margin:0;font-size:12px;color:${brand.textLight};line-height:1.7;"><strong style="color:${brand.textDark};">Current:</strong> ${readableCurr} &nbsp;|&nbsp; <strong style="color:${brand.textDark};">Previous:</strong> ${readablePrev}</p>
          <p style="margin:10px 0 0;font-size:12px;color:${brand.textMid};line-height:1.7;">${copy.next}</p>
        </td>
      </tr>
    </table>
  `;
};

const buildStatusCta = (displayOrderId, state, cfg) => {
  const clientUrl =
    process.env.SECOND_BASE_URL ||
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    process.env.APP_URL ||
    "";
  const orderPath = clientUrl ? `${clientUrl.replace(/\/$/, "")}/orders` : "#";
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_USER || "";
  const supportHref = supportEmail ? `mailto:${supportEmail}?subject=Support%20for%20Order%20${displayOrderId}` : "#";

  const primaryLabel = state === "cancelled" ? "Create New Order" : "View My Orders";
  const secondaryLabel = "Contact Support";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 20px;">
      <tr>
        <td>
          <p style="margin:0 0 12px;font-size:13px;color:${brand.textMid};line-height:1.6;">
            Need help with this update? Use one of the actions below.
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:8px;padding-bottom:8px;">
                <a href="${orderPath}" style="display:inline-block;background-color:${cfg.accent};color:${brand.white};text-decoration:none;font-size:13px;font-weight:700;padding:11px 16px;border-radius:10px;">
                  ${primaryLabel}
                </a>
              </td>
              <td style="padding-bottom:8px;">
                <a href="${supportHref}" style="display:inline-block;background-color:${brand.surfaceAlt};border:1px solid ${brand.border};color:${brand.textDark};text-decoration:none;font-size:13px;font-weight:700;padding:11px 16px;border-radius:10px;">
                  ${secondaryLabel}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

const getOrderStatusEmailTemplate = (user, order, previousState, state) => {
  const fallback = { heading: 'Order Status Updated', icon: '&#128196;', accent: brand.primary, accentBg: brand.surfaceAlt, accentBorder: brand.border, intro: 'Your order status has changed.', message: 'We will keep you updated on further changes.', step: 0 };
  const cfg = stateConfig[state] || fallback;
  const displayOrderId = getOrderDisplayId(order);
  const readablePrev = capitalizeState(previousState);
  const readableCurr = capitalizeState(state);

  const body = `
    <!-- Status icon -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
      <tr>
        <td style="width:56px;height:56px;border-radius:50%;background-color:${cfg.accentBg};border:2px solid ${cfg.accentBorder};text-align:center;vertical-align:middle;font-size:24px;color:${cfg.accent};line-height:52px;">
          ${cfg.icon}
        </td>
      </tr>
    </table>

    <p style="margin:0 0 20px;text-align:center;font-size:14px;color:${brand.textMid};line-height:1.6;">
      Hi <strong style="color:${brand.textDark};">${user.username}</strong>, ${cfg.intro}
    </p>

    <!-- Progress tracker -->
    ${buildProgressTracker(cfg.step)}

    <!-- Professional status briefing -->
    ${buildStatusBriefing(cfg, readableCurr, readablePrev, state)}

    <!-- Order info -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.surfaceAlt};border-radius:${brand.radiusSm};margin-bottom:20px;">
      <tr>
        <td style="padding:16px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${infoRow('Order ID', `<span style="font-family:monospace;letter-spacing:0.5px;">${displayOrderId}</span>`)}
          </table>
        </td>
      </tr>
    </table>

    <!-- Call to action -->
    ${buildStatusCta(displayOrderId, state, cfg)}

    <!-- Message -->
    <p style="margin:0;font-size:14px;color:${brand.textMid};line-height:1.7;">
      ${cfg.message}
    </p>
  `;

  return {
    subject: `Order #${displayOrderId} — ${cfg.heading}`,
    html: baseLayout(
      `${cfg.heading} — Notervo`,
      cfg.heading,
      `Order #${displayOrderId}`,
      body,
      state === 'delivered'
        ? 'Thank you for choosing Notervo! We hope you love your notebooks.'
        : 'If you have any questions, reply to this email and we will help.'
    ),
  };
};

module.exports = {
  getOrderConfirmationHTML,
  getNewOrderNotificationHTML,
  getOrderStatusEmailTemplate,
};
