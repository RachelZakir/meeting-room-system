//Imports the service function that handles registration business logic, 
// and the Zod schema for validation.
const { registerUser } = require('../services/userService');
const { userSchema } = require('../validators/userValidator');

//is an async function that Express will call with req, res, next.
const register = async (req, res, next) => {
  try {
    // validates the request body against the schema. If it fails, Zod throws a ZodError.
    const validatedData = userSchema.parse(req.body);

    //If validation passes call registerUser (service layer) which returns the created user 
    const user = await registerUser(validatedData);
    //On success, send a 201 Created response with a standard JSON format.
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });

    //we pass errors to the next middleware (next(error)), 
    // which will be caught by the global error handler.
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