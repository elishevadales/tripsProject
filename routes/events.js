const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth")
const { eventController } = require("../controllers/eventController");


//shows that the router works
router.get("/", eventController.routGet)

// Get active event list
router.get("/activeEventList", eventController.activeEventList)

// Get all the event list
router.get("/eventList", eventController.eventList)

// Get all the free events 
router.get("/eventFree", eventController.eventFree)

// Search event by category
router.get("/searchByCategory", eventController.searchByCategory)

// Search event by name
router.get("/searchByName", eventController.searchByName)

// Search events by multiple districts separated by a comma
router.get("/searchByDistricts", eventController.searchByDistricts)

// Search events by multiple sub_category separated by a comma
router.get("/searchBySubCategory", eventController.searchBySubCategory)

// Search event by min and  max price (adult)
router.get("/serchByPrice", eventController.serchByPrice)

// Post an event
router.post("/", auth, eventController.addEvent)

module.exports = router;