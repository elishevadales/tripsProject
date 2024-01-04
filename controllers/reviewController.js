const { EventModel } = require("../models/eventModel");
const { ReviewModel } = require("../models/reviewModel");
const { reviewValid } = require("../validations/reviewValidation")


exports.reviewController = {

    addReview: async (req, res) => {
        try {
            const validBody = reviewValid(req.body);
            let eventId = req.params.eventId
            let userId = req.tokenData._id;

            if (validBody.error) {
                return res.status(400).json(validBody.error.details);
            }

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            // only participants can rate the event
            const participants = event.participants.includes(userId);

            if (!participants) {
                return res.status(400).json({ msg: 'User is not a participant' });
            }

            const existingReview = await ReviewModel.findOne({ event_id: eventId, user_id: userId });

            if (existingReview) {
                return res.status(400).json({ msg: 'Cannot rate event twice' });
            }

            const review = new ReviewModel(req.body);
            review.event_id = eventId
            review.user_id = userId

            await review.save();
            res.json(review);

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "There was an error, please try again later", err });
        }
    },

    checkReview: async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const userId = req.tokenData._id;

            // Check if the user has already written a review for the event
            const existingReview = await ReviewModel.findOne({ event_id: eventId, user_id: userId });

            if (existingReview) {
                res.json({ hasReview: true, review: existingReview });
            } else {
                res.json({ hasReview: false });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error', err });
        }
    },

    eventReviews: async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const eventReviews = await ReviewModel.find({ event_id: eventId })
            .populate({ path: "user_id", model: "users", select: { _id: 1, nick_name: 1, profile_image: 1 } })

            res.json(eventReviews);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error', err });
        }
    },

    deleteReview: async (req, res) => {
        try {
            const userId = req.tokenData._id;
            const reviewId = req.params.reviewId;
        
            const reviewToDelete = await ReviewModel.findById(reviewId);
        
            if (!reviewToDelete) {
              return res.status(404).json({ msg: 'Review not found' });
            }
        
            if (reviewToDelete.user_id.toString() !== userId && req.tokenData.role !== "admin") {
              return res.status(403).json({ msg: 'Unauthorized: You do not have permission to delete this review' });
            }
        
            const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);
        
            res.json({ msg: 'Review deleted successfully', deletedReview });
          } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error', err });
          }
    },

    editReview: async (req, res) => {
        try {
            const userId = req.tokenData._id;
            const reviewId = req.params.reviewId;
        
            // Find the review by ID
            const reviewToUpdate = await ReviewModel.findById(reviewId);
        
            // Check if the review exists
            if (!reviewToUpdate) {
              return res.status(404).json({ msg: 'Review not found' });
            }
        
            if (reviewToUpdate.user_id.toString() !== userId && req.tokenData.role !== "admin") {
              return res.status(403).json({ msg: 'Unauthorized: You do not have permission to edit this review' });
            }
        
            const updatedReview = await ReviewModel.findByIdAndUpdate(
              reviewId,
              req.body,
              { new: true }
            );
        
            res.json({ msg: 'Review updated successfully', updatedReview });
          } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error', err });
          }
    }

}