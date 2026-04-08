// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByEmail } = require('../repositories/userRepository');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY }
    );

    // tell z browser to store tokens as cookies and send them automatically with every request
    res.cookie('accessToken', accessToken, {
      httpOnly: true, //Prevents JS from accessing the cookie Protects against XSS (Cross-Site Scripting) attacks
      secure: false, // use true in production HTTPS not on http
      sameSite: 'strict', // prevents CSRF Cross-Site Request Forgery
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};

// Refresh function
const refresh = (req, res) => {
  // my refresh func inco res and res objects
  const refreshToken = req.cookies.refreshToken; //read the refr token cookies
  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, message: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );

    // update the access token cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true, message: 'Token refreshed' });
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

module.exports = { login, refresh };
