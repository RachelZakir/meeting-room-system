const { registerUser } = require('../services/userService');
const { userSchema } = require('../validators/userValidator');

const register = async (req, res, next) => {
  try {
    // Validate input
    const validatedData = userSchema.parse(req.body);
    
    // Create user
    const user = await registerUser(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    next(error);
  }
};

module.exports = { register };