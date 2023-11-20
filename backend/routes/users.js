const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// User routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/', auth, multer, userCtrl.updateUser);
router.put('/image', auth, multer, userCtrl.updateImage)
router.delete('/:id', auth, userCtrl.deleteUser);
router.get('/', auth, userCtrl.getAllUsers);
router.get('/:id', auth, userCtrl.getUser);

module.exports = router