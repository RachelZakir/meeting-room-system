const {
  registerUser,
  editUser,
  getUsers,
  deleteUser,
  findUserById, // ← ADD THIS
} = require('../services/userService');
const { userSchema } = require('../validators/userValidator');

const register = async (req, res) => {
  try {
    // valid my reqs body
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

const update = async (req, res) => {
  try {
    const validatedData = userSchema.partial().parse(req.body); // allow partial updates

    // 🔒 Restrict: only self-update unless ADMIN
    if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: cannot edit other users',
      });
    }

    const user = await editUser(req.params.id, validatedData);
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const list = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { users, total } = await getUsers(Number(page), Number(limit));
    res.json({
      success: true,
      data: users,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted (soft)', data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Add this function to your existing userController.js
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization: allow if ADMIN or requesting own data
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: cannot view other users',
      });
    }

    const user = await findUserById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { register, update, list, remove, getUserById };
