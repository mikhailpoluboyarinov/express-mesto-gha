const router = require('express').Router();

const {
  getUsers, getUser, editUser, createUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.patch('/users/me', editUser);
router.post('/users', createUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
