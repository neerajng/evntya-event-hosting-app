const express = require('express');
const router = express.Router();
const { parser } = require('../config/imageUpload');
const {checkBlocked} = require('../middlewares/checkBlocked')

const {createEvent,myEvents,profile, updateEvent, uploadImage,
    singleEvent,cancelEvent,editEvent,editEventTwo,
    searchEvents,
    adminProfile, allEvents, updateProfile } = require('../controllers/eventCtrl');

router.post('/create-event',checkBlocked,createEvent )
router.post('/upload-image', checkBlocked,parser.single('image'),uploadImage)
router.post('/update-event',checkBlocked,updateEvent )
router.get('/my-events',checkBlocked, myEvents)
router.get('/event/:eventId', checkBlocked,singleEvent)
router.get('/all-events',checkBlocked,allEvents)
router.post('/cancel-event/:id',checkBlocked,cancelEvent)
router.put('/edit-event/:id',checkBlocked,editEvent)
router.put('/edit-event-two/:id',checkBlocked,editEventTwo)

router.get('/search-events',checkBlocked,searchEvents)

router.get('/profile',checkBlocked,profile)
router.get('/admin-profile',checkBlocked,adminProfile)
router.put('/update-profile',checkBlocked,updateProfile)



module.exports = router;