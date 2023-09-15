const express = require('express');
const router = express.Router();
const { parser } = require('../config/imageUpload');
const checkBlocked = require('../middlewares/checkBlocked')
const jwtVerify = require ('../middlewares/jwtVerify')    

const {createEvent,myEvents, updateEvent, uploadImage,
    singleEvent,cancelEvent,editEvent,editEventTwo,
    searchEvents, allEvents } = require('../controllers/eventCtrl');

router.get('/all-events',allEvents)
router.get('/search-events',searchEvents)
router.use(jwtVerify)
router.use(checkBlocked)
router.post('/create-event',createEvent )
router.post('/upload-image', parser.single('image'),uploadImage)
router.post('/update-event',updateEvent )
router.get('/my-events', myEvents)
router.get('/event/:eventId', singleEvent)
router.post('/cancel-event/:id',cancelEvent)
router.put('/edit-event/:id',editEvent)
router.put('/edit-event-two/:id',editEventTwo)

module.exports = router;