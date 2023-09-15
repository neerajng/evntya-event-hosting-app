const express = require('express');
const router = express.Router();
const {profile, updateProfile } = require('../controllers/profileCtrl');

router.get('/profile',profile)
router.put('/update-profile',updateProfile)

module.exports = router;
