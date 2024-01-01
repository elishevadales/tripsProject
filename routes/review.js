const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth")
const { reviewController } = require("../controllers/reviewController");


router.post("/addReview/:eventId",auth,  reviewController.addReview)

router.get('/checkReview/:eventId',auth , reviewController.checkReview)

router.get('/eventReviews/:eventId',  reviewController.eventReviews)

router.delete('/deleteReview/:reviewId', auth, reviewController.deleteReview)

router.put('/editReview/:reviewId',auth,  reviewController.editReview)



module.exports = router;