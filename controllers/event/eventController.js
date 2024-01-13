
const { EventModel } = require("../../models/eventModel");
const { UserModel } = require("../../models/userModel");
const { eventValid } = require("../../validations/eventValidations")
const { sendEmailInvite } = require("../../utility/transporter")
const createICalEvent = require('../../helpers/eventHelpers')

exports.eventController = {
    routGet: (req, res) => {
        res.json({ msg: "Events rout work - trips project" })
    },


    addEvent: async (req, res) => {
        try {
            const validBody = eventValid(req.body);
            if (validBody.error) {
                return res.status(400).json(validBody.error.details);
            }

            const event = new EventModel(req.body);

            const userId = req.tokenData._id;
            event.user_id = userId;
            event.participants.push(userId);
            await event.save();
            const eventId = event._id;

            await UserModel.findByIdAndUpdate(
                userId,
                { $push: { my_created_events: eventId } },
                { new: true }
            );

            res.json(event);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Error", err });
        }
    },


    setInactive: async (req, res) => {
        try {
            let eventId = req.params.eventId
            let userId = req.tokenData._id;
            if (!(req.tokenData.role === "admin" || (await belongsToUser(userId, eventId)))) {
                return res.status(403).json({ msg: "Permission denied" });
            }
            console.log(eventId)
            const event = await EventModel.findByIdAndUpdate(eventId, { $set: { active: false } }, { new: true });
            res.json({ msg: "Event successfully updated", event });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    setActive: async (req, res) => {
        try {
            let eventId = req.params.eventId
            let userId = req.tokenData._id;

            if (!(req.tokenData.role === "admin" || (await belongsToUser(userId, eventId)))) {
                return res.status(403).json({ msg: "Permission denied" });
            }
            const event = await EventModel.findByIdAndUpdate(eventId, { $set: { active: true } }, { new: true });
            res.json({ msg: "Event successfully updated", event });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },
    addOrRemoveLike: async (req, res) => {
        try {
            let eventId = req.params.eventId
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const userLikedEvent = event.like_list.includes(userId);

            if (userLikedEvent) {
                // return res.status(400).json({ msg: 'Cannot add like twice' });
                event.like_list = event.like_list.filter(id => id.toString() !== userId);
                await event.save();
                await event.populate({ path: "user_id", model: "users" })
                res.json({ msg: 'Like removed successfully', event });
            }
            else {
                event.like_list.push(userId);
                await event.save();
                await event.populate({ path: "user_id", model: "users" })

                res.json({ msg: 'Like added successfully', event });
            }


        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    addLike: async (req, res) => {
        try {
            let eventId = req.params.eventId
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const userLikedEvent = event.like_list.includes(userId);

            if (userLikedEvent) {
                return res.status(400).json({ msg: 'Cannot add like twice' });
            }

            event.like_list.push(userId);
            await event.save();

            res.json({ msg: 'Like added successfully' });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },

    removeLike: async (req, res) => {
        try {
            let eventId = req.params.eventId
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const userLikedEvent = event.like_list.includes(userId);

            if (!userLikedEvent) {
                return res.status(400).json({ msg: 'User has not liked this event' });
            }

            event.like_list = event.like_list.filter(id => id.toString() !== userId);
            await event.save();
            res.json({ msg: 'Like removed successfully' });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },

    editEvent: async (req, res) => {
        const validBody = eventValid(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }
        try {
            const eventId = req.params.eventId;
            const userId = req.tokenData._id;

            if (!(req.tokenData.role == "admin" || (await belongsToUser(userId, eventId)))) {
                return res.status(403).json({ msg: "Permission denied" });
            }

            const updatedEvent = await EventModel.findByIdAndUpdate(
                eventId,
                { $set: req.body },
                { new: true }
            );

            // Send the updeted event to all participants
            const cal = createICalEvent
            const participants = updatedEvent.participants
            let user
            participants.forEach(async userId => {
                user = await UserModel.findOne({ _id: userId });
                sendEmailInvite(user.email, `Update for ${updatedEvent.event_name}`, cal, updatedEvent, user.name)
            });


            res.json({ msg: "Event successfully updated", updatedEvent });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "There was an error, please try again later", err });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const userId = req.tokenData._id;
            if (!(req.tokenData.role === "admin" || (await belongsToUser(userId, eventId)))) {
                return res.status(403).json({ msg: "Permission denied" });
            }

            await EventModel.findByIdAndDelete(eventId);
            await UserModel.findByIdAndUpdate(
                userId,
                { $pull: { my_created_events: eventId } },
                { new: true }
            );

            res.json({ msg: "Event deleted successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "There was an error, please try again later", err });
        }
    }
}


const belongsToUser = async (userId, eventId) => {
    try {
        const user = await UserModel.findById(userId).exec();

        if (!user) {
            return false;
        }

        return user.my_created_events.includes(eventId);

    } catch (error) {
        console.error(error);
        return false;
    }
}