const express = require("express");
const router = express.Router();
const { messagesController } = require("../controllers/messagesController");
const { auth, authAdmin } = require("../middlewares/auth")


//shows that the router works
router.get("/", messagesController.routGet)

// Get messages for event
router.get("/byEventId/:eventId", messagesController.byEventId)

router.post('/sedMessage/:eventId',auth, messagesController.sedMessage)

module.exports = router;