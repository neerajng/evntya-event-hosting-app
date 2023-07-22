const express = require('express');
const router = express.Router();
const { signupCtrl, verifyOtpCtrl, signinCtrl, getUserProfile, 
    forgetCtrl, resetCtrl} = require('../controllers/authCtrl');

router.post('/signup', signupCtrl);
router.post('/otp', verifyOtpCtrl);
router.post('/signin', signinCtrl);
router.post('/forget-password',forgetCtrl )
router.post('/reset-password',resetCtrl )

router.get('/', getUserProfile);


module.exports = router;
