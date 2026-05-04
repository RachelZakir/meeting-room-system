const express = require('express');
const {
  register,
  update,
  list,
  remove,
  getUserById,
} = require('../controllers/userController');

const {
  authMiddleware,
  requireRole,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/users', register);

router.put('/users/:id', authMiddleware, update);
router.get('/users/:id', authMiddleware, getUserById);
router.get('/users', authMiddleware, requireRole(['ADMIN']), list);

router.delete('/users/:id', authMiddleware, requireRole(['ADMIN']), remove);

module.exports = router;
