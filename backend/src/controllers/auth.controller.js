const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');
const { generateToken, hashToken } = require('../utils/token');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const EMAIL_VERIFY_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_PASSWORD_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
});

// POST /api/v1/auth/register
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const { rawToken, tokenHash } = generateToken();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      emailVerifyTokenHash: tokenHash,
      emailVerifyExpires: new Date(Date.now() + EMAIL_VERIFY_EXPIRY_MS),
    },
  });

  // Fire-and-forget: don't block registration on email delivery issues
  sendVerificationEmail(user.email, user.name, `${FRONTEND_URL}/verify-email/${rawToken}`).catch((err) =>
    console.error('Failed to send verification email:', err.message)
  );

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.status(201).json({ success: true, accessToken, user: publicUser(user) });
};

// POST /api/v1/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.json({ success: true, accessToken, user: publicUser(user) });
};

// POST /api/v1/auth/refresh — reads refreshToken cookie, issues new access token
const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: 'No refresh token' });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Refresh token invalid or expired' });
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user || user.refreshToken !== token) {
    return res.status(403).json({ success: false, message: 'Refresh token does not match' });
  }

  const accessToken = generateAccessToken(user);
  res.json({ success: true, accessToken });
};

// POST /api/v1/auth/logout
const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const user = await prisma.user.findFirst({ where: { refreshToken: token } });
    if (user) {
      await prisma.user.update({ where: { id: user.id }, data: { refreshToken: null } });
    }
  }
  res.clearCookie('refreshToken', cookieOptions);
  res.json({ success: true, message: 'Logged out' });
};

// GET /api/v1/auth/me
const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, phone: true, role: true, isEmailVerified: true, createdAt: true },
  });
  res.json({ success: true, user });
};

// POST /api/v1/auth/verify-email  { token }
const verifyEmail = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Verification token is required' });
  }

  const tokenHash = hashToken(token);
  const user = await prisma.user.findFirst({
    where: { emailVerifyTokenHash: tokenHash, emailVerifyExpires: { gt: new Date() } },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Verification link is invalid or has expired' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailVerifyTokenHash: null, emailVerifyExpires: null },
  });

  res.json({ success: true, message: 'Email verified successfully' });
};

// POST /api/v1/auth/resend-verification (logged in)
const resendVerification = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.isEmailVerified) {
    return res.status(400).json({ success: false, message: 'Email is already verified' });
  }

  const { rawToken, tokenHash } = generateToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifyTokenHash: tokenHash, emailVerifyExpires: new Date(Date.now() + EMAIL_VERIFY_EXPIRY_MS) },
  });

  await sendVerificationEmail(user.email, user.name, `${FRONTEND_URL}/verify-email/${rawToken}`);
  res.json({ success: true, message: 'Verification email sent' });
};

// POST /api/v1/auth/forgot-password  { email }
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return a generic success message, whether or not the email exists —
  // this prevents attackers from using this endpoint to discover which emails
  // are registered (an "email enumeration" vulnerability).
  const genericResponse = {
    success: true,
    message: 'If an account exists for that email, a password reset link has been sent.',
  };

  if (!user) return res.json(genericResponse);

  const { rawToken, tokenHash } = generateToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { resetPasswordTokenHash: tokenHash, resetPasswordExpires: new Date(Date.now() + RESET_PASSWORD_EXPIRY_MS) },
  });

  await sendPasswordResetEmail(user.email, user.name, `${FRONTEND_URL}/reset-password/${rawToken}`);
  res.json(genericResponse);
};

// POST /api/v1/auth/reset-password  { token, password }
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Token and new password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const tokenHash = hashToken(token);
  const user = await prisma.user.findFirst({
    where: { resetPasswordTokenHash: tokenHash, resetPasswordExpires: { gt: new Date() } },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordTokenHash: null,
      resetPasswordExpires: null,
      refreshToken: null, // force logout everywhere — any existing session is invalidated
    },
  });

  res.json({ success: true, message: 'Password reset successfully. Please log in with your new password.' });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
