const { verifyAccessToken } = require('../utils/jwt');

// Verifies the Bearer access token and attaches req.user
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// Restricts route to ADMIN role only. Use after protect().
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
};

module.exports = { protect, adminOnly };
