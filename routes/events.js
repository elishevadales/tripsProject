const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth")
const { eventController } = require("../controllers/eventController");


//shows that the router works
router.get("/", eventController.routGet)


router.get("/getEventById/:eventId", auth, eventController.getEventById)

// Get active event list
router.get("/activeEventList", eventController.activeEventList)

// Get all the event list
router.get("/eventList", eventController.eventList)

// Get all the free events 
router.get("/eventFree", eventController.eventFree)

// Search event by category (active events only)
router.get("/searchByCategory", eventController.searchByCategory)

// Search event by name
router.get("/searchByName", eventController.searchByName)

// Search events by multiple districts separated by a comma
router.get("/searchByDistricts", eventController.searchByDistricts)

// Search events by multiple sub_category separated by a comma (active events only)
router.get("/searchBySubCategory", eventController.searchBySubCategory)

// Search event by min and  max price according to adults price  (maxPrice, minPrice optional) (active events only)
router.get("/serchByPrice", eventController.serchByPrice)

// Get all the events with free parking place (active events only)
router.get("/parkingFree", eventController.parkingFree)

// Get all the events with accessibility (active events only)
router.get("/accessibility", eventController.accessibility)

// Search event by start and  end date (endDate, startDate optional) (active events only)
router.get("/searchByDates", eventController.searchByDates)

// Search by free text
router.get("/search", eventController.search)

// Post an event
router.post("/", auth, eventController.addEvent)

// Close an event (set active to false)
router.patch("/setInactive/:eventId", auth, eventController.setInactive)

// Open a closed event (set active to true)
router.patch("/setActive/:eventId", auth, eventController.setActive)

// Add like
router.patch("/addLike/:eventId", auth, eventController.addLike)

// Remove  like
router.patch("/removeLike/:eventId", auth, eventController.removeLike)

// Add join request
router.patch("/addJoinRequest/:eventId", auth, eventController.addJoinRequest)

// Remove join request
router.patch("/removeJoinRequest/:eventId", auth, eventController.removeJoinRequest)

// Add participant
router.patch("/addParticipant/:eventId", auth, eventController.addParticipant)

// Remove participant
router.patch("/removeParticipant/:eventId", auth, eventController.removeParticipant)

// Rank
router.patch("/rank/:eventId", auth, eventController.rank)

// Edit an event
router.put("/:eventId",auth, eventController.editEvent)

// Delete an event
router.delete("/:eventId",auth, eventController.deleteEvent)












module.exports = router;