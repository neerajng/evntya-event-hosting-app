const express = require('express');
const router = express.Router();
const { signupCtrl, verifyOtpCtrl, signinCtrl, getUserProfile, 
    forgetCtrl, resetCtrl, googleSigninCtrl} = require('../controllers/authCtrl');

router.post('/signup', signupCtrl);
router.post('/otp', verifyOtpCtrl);
router.post('/signin', signinCtrl);
router.post('/forget-password',forgetCtrl )
router.post('/reset-password',resetCtrl )
router.post('/google-signin', googleSigninCtrl)

module.exports = router;
