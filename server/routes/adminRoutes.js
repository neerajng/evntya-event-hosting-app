const express = require('express');
const router = express.Router();
const { getUsers , blockUser, adminProfile} = require('../controllers/adminCtrl');
 
router.get('/users', getUsers);
router.post('/users/:userId/block', blockUser);
router.get('/admin-profile',adminProfile)

module.exports = router;
