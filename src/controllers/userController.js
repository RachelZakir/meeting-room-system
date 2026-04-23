const { registerUser } = require('../services/userService');
const { userSchema } = require('../validators/userValidator');

const register = async (req, res) => {
  try {
    // Validate request body (including role if provided)
    const validatedData = userSchema.parse(req.body);

    // If no role is provided, default to USER
    const role = validatedData.role || 'USER';

    // Pass role along with other validated data
    const user = await registerUser({
      ...validatedData,
      role,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { register };
