const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth")
const { eventController } = require("../controllers/event/eventController");
const { getEventController } = require("../controllers/event/getEventController")
const { searchEventController } = require("../controllers/event/searchEventController")
const { filterEventController } = require("../controllers/event/filterEventController")
const { joinRequestController } = require("../controllers/event/joinRequestController")
const { participantController } = require("../controllers/event/participantController")


//shows that the router works
router.get("/", eventController.routGet)

// Get active event list
router.get("/activeEventList", getEventController.activeEventList)

// Get all the event list
router.get("/eventList", getEventController.eventList)

//get event by ID
router.get("/getEventById/:eventId", getEventController.eventById)

// Get all the free events 
router.get("/eventFree", getEventController.eventFree)

// Search event by category (active events only)
router.get("/searchByCategory", searchEventController.searchByCategory)

// Search event by name
router.get("/searchByName", searchEventController.searchByName)

// Search events by multiple districts separated by a comma
router.get("/searchByDistricts", searchEventController.searchByDistricts)

// Search events by multiple sub_category separated by a comma (active events only)
router.get("/searchBySubCategory", searchEventController.searchBySubCategory)

// Search event by min and  max price according to adults price  (maxPrice, minPrice optional) (active events only)
router.get("/serchByPrice", searchEventController.serchByPrice)

// Search event by start and  end date (endDate, startDate optional) (active events only)
router.get("/searchByDates", searchEventController.searchByDates)

// Search by free text
router.get("/search", searchEventController.search)

// Get all the events with free parking place (active events only)
router.get("/parkingFree", filterEventController.parkingFree)

// Get all the events with accessibility (active events only)
router.get("/accessibility", filterEventController.accessibility)


//get events by Multiple parameters
router.get("/searchMultiple", filterEventController.searchMultiple);
  

// Post an event
router.post("/", auth, eventController.addEvent)

// Close an event (set active to false)
router.patch("/setInactive/:eventId", auth, eventController.setInactive)

// Open a closed event (set active to true)
router.patch("/setActive/:eventId", auth, eventController.setActive)

// Add or remove like
router.patch("/addOrRemoveLike/:eventId", auth, eventController.addOrRemoveLike)

// Add like
router.patch("/addLike/:eventId", auth, eventController.addLike)

// Remove  like
router.patch("/removeLike/:eventId", auth, eventController.removeLike)

// Add join request
router.patch("/addJoinRequest/:eventId", auth, joinRequestController.addJoinRequest)

// Remove join request
router.patch("/removeJoinRequest/:eventId", auth, joinRequestController.removeJoinRequest)

// Add participant
router.patch("/addParticipant/:eventId", auth, participantController.addParticipant)

// Remove participant
router.patch("/removeParticipant/:eventId", auth, participantController.removeParticipant)

// Edit an event
router.put("/:eventId",auth, eventController.editEvent)

// Delete an event
router.delete("/:eventId",auth, eventController.deleteEvent)



module.exports = router;