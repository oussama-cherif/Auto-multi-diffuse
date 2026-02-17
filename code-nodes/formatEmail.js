// n8n Code Node: Format Email
// Mode: Run Once for All Items
// Purpose: Creates a responsive HTML email with category-specific accent colors,
//          job details bar, requirements list, and CTA button.
//          This is a REAL integration — the email is actually sent via Gmail.

const items = $input.all();

return items.map(item => {
  const d = item.json;
  const t = d.template;

  const requirementsHtml = d.requirements
    .split('\n')
    .filter(r => r.trim())
    .map(r => `<li style="margin-bottom:6px;">${r.trim()}</li>`)
    .join('');

  const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <tr>
      <td style="background:${t.emailAccent};padding:32px 24px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:24px;">Nouvelle opportunité d'emploi</h1>
      </td>
    </tr>
    <!-- Title -->
    <tr>
      <td style="padding:24px;">
        <h2 style="color:#1a1a2e;margin:0 0 8px;">${d.title}</h2>
        <p style="color:#6b7280;margin:0;font-size:16px;">${d.company} &bull; ${d.location}</p>
      </td>
    </tr>
    <!-- Details Bar -->
    <tr>
      <td style="padding:0 24px;">
        <table width="100%" cellpadding="8" style="background:#f9fafb;border-radius:8px;">
          <tr>
            <td style="text-align:center;border-right:1px solid #e5e7eb;">
              <strong style="color:#374151;font-size:13px;">Contrat</strong><br>
              <span style="color:#6b7280;font-size:13px;">${d.jobType}</span>
            </td>
            <td style="text-align:center;border-right:1px solid #e5e7eb;">
              <strong style="color:#374151;font-size:13px;">Salaire</strong><br>
              <span style="color:#6b7280;font-size:13px;">${d.salary}</span>
            </td>
            <td style="text-align:center;">
              <strong style="color:#374151;font-size:13px;">Lieu</strong><br>
              <span style="color:#6b7280;font-size:13px;">${d.location}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Description -->
    <tr>
      <td style="padding:24px;">
        <h3 style="color:#1a1a2e;margin:0 0 12px;">À propos du poste</h3>
        <p style="color:#4b5563;line-height:1.6;margin:0;">${d.description}</p>
      </td>
    </tr>
    <!-- Requirements -->
    <tr>
      <td style="padding:0 24px 24px;">
        <h3 style="color:#1a1a2e;margin:0 0 12px;">Prérequis</h3>
        <ul style="color:#4b5563;line-height:1.8;margin:0;padding-left:20px;">
          ${requirementsHtml}
        </ul>
      </td>
    </tr>
    <!-- CTA Button -->
    <tr>
      <td style="padding:0 24px 32px;text-align:center;">
        <a href="${d.applyUrl}" style="display:inline-block;background:${t.emailAccent};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:16px;">Postuler maintenant</a>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding:16px 24px;background:#f9fafb;text-align:center;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          Notification automatique du système de distribution d'offres d'emploi<br>
          Propulsé par n8n Workflow Automation
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const emailSubject = `Nouvelle opportunité : ${d.title} chez ${d.company} (${d.location})`;

  return {
    json: {
      ...d,
      emailHtml,
      emailSubject
    }
  };
});
