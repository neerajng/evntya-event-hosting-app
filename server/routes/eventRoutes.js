const express = require('express');
const router = express.Router();
const { parser } = require('../config/imageUpload');
const {checkBlocked} = require('../middlewares/checkBlocked')

const {createEvent,myEvents,profile, updateEvent, uploadImage,
    singleEvent,adminProfile, allEvents } = require('../controllers/eventCtrl');

router.post('/create-event',checkBlocked,createEvent )
router.post('/upload-image', checkBlocked,parser.single('image'),uploadImage)
router.post('/update-event',checkBlocked,updateEvent )
router.get('/my-events',checkBlocked, myEvents)
router.get('/event/:eventId', checkBlocked,singleEvent)
router.get('/all-events',checkBlocked,allEvents)
router.get('/profile',checkBlocked,profile)
router.get('/admin-profile',checkBlocked,adminProfile)


module.exports = router;