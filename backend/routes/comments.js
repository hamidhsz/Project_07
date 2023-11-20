const express = require('express');
const router = express.Router();

const commentsCtrl = require('../controllers/comments')
const auth = require('../middleware/auth');

// Comment routes
router.post('', auth, commentsCtrl.createComment);
router.delete('/:id', auth, commentsCtrl.deleteComment);

module.exports = router;