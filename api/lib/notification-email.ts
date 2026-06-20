type NotificationField = {
  label: string;
  value: unknown;
};

type SubmissionNotification = {
  type: "B2B Partner Request" | "Quote Request" | "Contact Request";
  replyTo?: string;
  fields: NotificationField[];
};

type NotificationResult = {
  sent: boolean;
  reason?: string;
};

function hasValue(value: unknown) {
  return value !== null && value !== undefined && value !== "";
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
  return String(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendSubmissionNotification(notification: SubmissionNotification): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.CONTACT_NOTIFICATION_EMAIL;
  const from = process.env.NOTIFICATION_FROM_EMAIL;

  if (!apiKey || !recipient || !from) {
    const missing = [
      !apiKey && "RESEND_API_KEY",
      !recipient && "ADMIN_NOTIFICATION_EMAIL (or CONTACT_NOTIFICATION_EMAIL)",
      !from && "NOTIFICATION_FROM_EMAIL",
    ].filter(Boolean).join(", ");
    const reason = `Missing email configuration: ${missing}`;
    console.warn(`[email] notification skipped: type="${notification.type}" recipient="${recipient || "not configured"}" reason="${reason}"`);
    return { sent: false, reason };
  }

  const adminUrl = process.env.ADMIN_DASHBOARD_URL || "https://www.morocco-incoming.com/admin";
  const fields = notification.fields.filter((field) => hasValue(field.value));
  const text = [
    `New ${notification.type}`,
    "",
    ...fields.map((field) => `${field.label}: ${formatValue(field.value)}`),
    "",
    `Check the admin dashboard: ${adminUrl}`,
  ].join("\n");
  const rows = fields
    .map((field) => `<tr><th style="padding:8px;text-align:left;vertical-align:top;border-bottom:1px solid #e5e7eb">${escapeHtml(field.label)}</th><td style="padding:8px;white-space:pre-wrap;border-bottom:1px solid #e5e7eb">${escapeHtml(formatValue(field.value))}</td></tr>`)
    .join("");
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;max-width:720px">
      <h1 style="font-size:22px">New ${escapeHtml(notification.type)}</h1>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="margin-top:24px"><a href="${escapeHtml(adminUrl)}">Check the admin dashboard</a></p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: notification.replyTo,
        subject: `New ${notification.type} - Morocco Incoming`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const providerMessage = await response.text();
      console.warn(`[email] notification failed: type="${notification.type}" recipient="${recipient}" provider="Resend" status=${response.status} response=${providerMessage}`);
      return { sent: false, reason: `Resend returned ${response.status}` };
    }

    console.info(`[email] notification sent: type="${notification.type}" recipient="${recipient}" provider="Resend"`);
    return { sent: true };
  } catch (error) {
    console.warn(`[email] notification failed: type="${notification.type}" recipient="${recipient}" provider="Resend"`, error);
    return { sent: false, reason: error instanceof Error ? error.message : "Unknown email error" };
  }
}
