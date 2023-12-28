
const { config } = require("../config/secret")
const { EventModel } = require("../models/eventModel");
const { UserModel } = require("../models/userModel");
const { eventValid } = require("../validations/eventValidations")
const mongoose = require("mongoose");

exports.eventController = {
    routGet: (req, res) => {
        res.json({ msg: "Events rout work - trips project" })
    },

    // Get all the active events 
    activeEventList: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "event_name";
        const reverse = req.query.reverse == "yes" ? -1 : 1;

        try {
            const data = await EventModel
                .find({ active: true })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },

    // Get all the events (active and inactive)
    eventList: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "event_name";
        const reverse = req.query.reverse == "yes" ? -1 : 1;

        try {
            const data = await EventModel
                .find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    eventFree: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "event_name";
        const reverse = req.query.reverse == "yes" ? -1 : 1;

        try {
            const data = await EventModel
                .find({ "price.free": true, active: true })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },

    searchByName: async (req, res) => {
        let perPage = req.query.perPage || 3;
        let page = req.query.page || 1;
        let sort = req.query.sort || "date_created";
        let reverse = req.query.reverse == "yes" ? 1 : -1;
        try {
            let queryS = req.query.search;
            let searchReg = new RegExp(queryS, "i")
            let eventSearch = await EventModel
                .find({ event_name: searchReg })
                .populate({ path: "user_id", model: "users" })
                .sort({ [sort]: reverse })
                .limit(perPage)
                .skip((page - 1) * perPage)

            res.json(eventSearch);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },

    searchByDistricts: async (req, res) => {
        let perPage = req.query.perPage || 3;
        let page = req.query.page || 1;
        let sort = req.query.sort || "date_created";
        let reverse = req.query.reverse == "yes" ? 1 : -1;
        try {
            let queryS = req.query.search;
            console.log(queryS)
            let districts = queryS.split(',');
            districts = districts.map(district => district.trim());
            let districtRegexArray = districts.map(district => new RegExp(district, "i"));
            let eventSearch = await EventModel
                .find({ district: { $in: districtRegexArray } })
                .populate({ path: "user_id", model: "users" })
                .sort({ [sort]: reverse })
                .limit(perPage)
                .skip((page - 1) * perPage);

            res.json(eventSearch);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err });
        }
    },

    serchByPrice: async (req, res) => {
        const perPage = req.query.perPage || 10;
        const page = req.query.page || 1;
        try {
            const minPrice = req.query.minPrice || 0;
            const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;

            const data = await EventModel.find({
                "price.adult": { $gte: minPrice, $lte: maxPrice }, active: true
            })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ price: 1 })
            res.json(data);

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "There was an error, please try again later", err });
        }
    },


    searchByCategory: async (req, res) => {
        let perPage = req.query.perPage || 3;
        let page = req.query.page || 1;
        let sort = req.query.sort || "date_created";
        let reverse = req.query.reverse == "yes" ? 1 : -1;
        try {
            let queryS = req.query.search;
            let searchReg = new RegExp(queryS, "i")
            let eventSearch = await EventModel
                .find({ category: searchReg, active: true })
                .populate({ path: "user_id", model: "users" })
                .sort({ [sort]: reverse })
                .limit(perPage)
                .skip((page - 1) * perPage)

            res.json(eventSearch);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    searchBySubCategory: async (req, res) => {
        let perPage = req.query.perPage || 3;
        let page = req.query.page || 1;
        let sort = req.query.sort || "date_created";
        let reverse = req.query.reverse == "yes" ? 1 : -1;
        try {
            let queryS = req.query.search;
            let categories = queryS.split(',');
            categories = categories.map(category => category.trim());
            let categoryRegexArray = categories.map(category => new RegExp(category, "i"));
            let eventSearch = await EventModel
                .find({ sub_category: { $in: categoryRegexArray }, active: true })
                .populate({ path: "user_id", model: "users" })
                .sort({ [sort]: reverse })
                .limit(perPage)
                .skip((page - 1) * perPage);

            res.json(eventSearch);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err });
        }
    },

    parkingFree: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "event_name";
        const reverse = req.query.reverse == "yes" ? -1 : 1;

        try {
            const data = await EventModel
                .find({ parking: true, active: true })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },

    accessibility: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "event_name";
        const reverse = req.query.reverse == "yes" ? -1 : 1;

        try {
            const data = await EventModel
                .find({ accessibility: true, active: true })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    searchByDates: async (req, res) => {
        const perPage = req.query.perPage || 10;
        const page = req.query.page || 1;

        try {
            const startDate = req.query.startDate || new Date();
            const endDate = req.query.endDate || new Date(Number.MAX_SAFE_INTEGER);

            const data = await EventModel.find({
                date_and_time: { $gte: startDate, $lte: endDate },
                active: true
            })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ date_and_time: 1 });

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "There was an error, please try again later", err });
        }
    },

    search: async (req, res) => {
        const perPage = req.query.perPage || 10;
        const page = req.query.page || 1;

        try {
            const queryS = req.query.search || "";
            const searchReg = new RegExp(queryS, "i");
            let textSearch = queryS.split(',');

            textSearch = textSearch.map(text => text.trim());
            let textSearchArray = textSearch.map(text => new RegExp(text, "i"));

            const sort = req.query.sort || "event_name";
            const reverse = req.query.reverse == "yes" ? -1 : 1;

            let eventSearch = await EventModel.find({
                $or: [
                    { event_name: { $in: textSearchArray } },
                    { category: { $in: textSearchArray } },
                    { sub_category: { $in: textSearchArray } },
                    { district: { $in: textSearchArray } },
                    { place_info: { $in: textSearchArray } },
                    { trip_details: { $in: textSearchArray } },
                    { during: { $in: textSearchArray } },
                    { required_equipment: { $in: textSearchArray } }
                ]
            })
                .populate({ path: "user_id", model: "users" })
                .sort({ [sort]: reverse })
                .limit(perPage)
                .skip((page - 1) * perPage);

            res.json(eventSearch);

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "There was an error, please try again later", err });
        }
    },


    addEvent: async (req, res) => {
        let validBody = eventValid(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details)
        }
        try {
            let event = new EventModel(req.body);
            const userId = req.tokenData._id;
            event.user_id = userId
            await event.save();
            const eventId = event._id;

            await UserModel.findByIdAndUpdate(
                userId,
                { $push: { my_created_events: eventId } },
                { new: true }
            );

            res.json(event);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
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

    addJoinRequest: async (req, res) => {
        try {
            let eventId = req.params.eventId
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const joinRequests = event.join_requests.includes(userId);

            if (joinRequests) {
                return res.status(400).json({ msg: 'Cannot send  join request twice' });
            }

            event.join_requests.push(userId);
            await event.save();

            res.json({ msg: 'Join request added successfully' });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    removeJoinRequest: async (req, res) => {
        try {
            let eventId = req.params.eventId
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const joinRequests = event.join_requests.includes(userId);

            if (!joinRequests) {
                return res.status(404).json({ msg: 'Join request not found' });
            }

            event.join_requests = event.join_requests.filter(id => id.toString() !== userId);
            await event.save();
            res.json({ msg: 'Join request removed successfully' });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },

    addParticipant: async (req, res) => {
        try {
            let eventId = req.params.eventId;
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const participants = event.participants.some(participant => participant.user_id.toString() === userId);

            if (participants) {
                return res.status(400).json({ msg: 'User is already a participant' });
            }

            const newParticipant = {
                user_id: userId,
                rank: 0,
            };

            event.participants.push(newParticipant);
            await event.save();

            await UserModel.findByIdAndUpdate(
                userId,
                { $push: { my_join_events: eventId } },
                { new: true }
            );

            res.json({ msg: 'User added as a participant successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'err', err });
        }
    },


    removeParticipant: async (req, res) => {
        try {
            let eventId = req.params.eventId;
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const participantIndex = event.participants.findIndex(participant => participant.user_id.toString() === userId);

            if (participantIndex === -1) {
                return res.status(400).json({ msg: 'User is not a participant' });
            }

            event.participants.splice(participantIndex, 1);

            await event.save();
            res.json({ msg: 'Participant removed successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'err', err });
        }
    },


    rank: async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const userId = req.tokenData._id;
            const newRank = req.body.newRank;
    
            if (newRank < 0 || newRank > 5) {
                return res.status(400).json({ msg: 'Invalid rank value' });
            }
    
            const updatedEvent = await EventModel.findOneAndUpdate(
                { _id: eventId, 'participants.user_id': userId },
                { $set: { 'participants.$[i].reank': newRank } },
                {
                    arrayFilters: [{ 'i.user_id': userId }],
                    new: true
                }

            );
    
            if (!updatedEvent) {
                return res.status(404).json({ msg: 'Event not found or user not a participant' });
            }
    
            res.json({ msg: 'User rank updated in the event successfully', event: updatedEvent });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error', err });
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

            await UserModel.findByIdAndUpdate(
                userId,
                { $pull: { my_join_events: eventId } },
                { new: true }
            );

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