const express = require('express');
const router = express.Router();
const { getUsers , blockUser} = require('../controllers/adminCtrl');

router.get('/users', getUsers);
router.post('/users/:userId/block', blockUser);

module.exports = router;
