const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  let token;

  // 1. Check Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Fallback: check cookies
  if (!token && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // 3. If no token found → reject
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch {
    return res
      .status(403)
      .json({ success: false, message: 'Invalid or expired token' });
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions',
      });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
