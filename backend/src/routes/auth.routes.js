const router = require('express').Router();
const {
  register, login, refresh, logout, getMe,
  verifyEmail, resendVerification, forgotPassword, resetPassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201: { description: User registered }
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns access token }
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Get a new access token using refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       200: { description: New access token issued }
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user, clears refresh token
 *     tags: [Auth]
 *     responses:
 *       200: { description: Logged out }
 */
router.post('/logout', logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current user profile }
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify a user's email using the token emailed to them at registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *     responses:
 *       200: { description: Email verified }
 *       400: { description: Invalid or expired token }
 */
router.post('/verify-email', verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend the verification email to the logged-in user
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Verification email resent }
 */
router.post('/resend-verification', protect, resendVerification);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link by email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { description: Generic success message (doesn't reveal if the email exists) }
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Set a new password using a valid reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Password reset }
 *       400: { description: Invalid or expired token }
 */
router.post('/reset-password', resetPassword);

module.exports = router;
