const nodemailer = require('nodemailer');

// One shared transporter. Works with any SMTP provider (Gmail app password,
// SendGrid, Mailtrap, Resend, Amazon SES, etc.) — just fill in .env.
// In development, if EMAIL_HOST isn't set, we fall back to logging the
// email content to the console instead of failing, so registration/reset
// flows still work locally without SMTP configured.
const isConfigured = !!process.env.EMAIL_HOST;

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: Number(process.env.EMAIL_PORT) === 465, // true for port 465, false for others
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

const sendEmail = async ({ to, subject, html }) => {
  if (!isConfigured) {
    console.log('\n📧 [DEV MODE — no EMAIL_HOST set] Email not actually sent. Content below:');
    console.log(`To: ${to}\nSubject: ${subject}\n${html}\n`);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"ShopSphere" <no-reply@shopsphere.com>`,
    to,
    subject,
    html,
  });
};

const baseWrapper = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #17181C; letter-spacing: -0.02em;">ShopSphere</h2>
    <h3 style="color: #2F4B7C;">${title}</h3>
    ${bodyHtml}
    <p style="color: #999; font-size: 12px; margin-top: 32px;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>
`;

const sendVerificationEmail = async (to, name, verifyUrl) => {
  await sendEmail({
    to,
    subject: 'Verify your ShopSphere email',
    html: baseWrapper(
      'Confirm your email address',
      `
        <p>Hi ${name},</p>
        <p>Thanks for creating a ShopSphere account. Please confirm your email address to activate it:</p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" style="background:#2F4B7C;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;">
            Verify Email
          </a>
        </p>
        <p style="font-size: 13px; color: #666;">This link expires in 24 hours.</p>
      `
    ),
  });
};

const sendPasswordResetEmail = async (to, name, resetUrl) => {
  await sendEmail({
    to,
    subject: 'Reset your ShopSphere password',
    html: baseWrapper(
      'Reset your password',
      `
        <p>Hi ${name},</p>
        <p>We received a request to reset your ShopSphere password. Click below to choose a new one:</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#B23A2E;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;">
            Reset Password
          </a>
        </p>
        <p style="font-size: 13px; color: #666;">This link expires in 1 hour.</p>
      `
    ),
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
