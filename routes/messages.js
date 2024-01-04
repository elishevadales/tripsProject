const express = require("express");
const router = express.Router();
const { messagesController } = require("../controllers/messagesController");


//shows that the router works
router.get("/", messagesController.routGet)

// Get messages for event
router.get("/byEventId/:eventId", messagesController.byEventId)

router.post('/sedMessage/:eventId', messagesController.sedMessage)

module.exports = router;