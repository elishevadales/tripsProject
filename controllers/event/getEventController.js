const { EventModel } = require("../../models/eventModel");


exports.getEventController = {

    // Get all the active events 
    activeEventList: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "event_name";
        const reverse = req.query.reverse == "yes" ? -1 : 1;

        try {
            const data = await EventModel
                .find({ active: true })
                .populate({ path: "user_id", model: "users" })
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
                .populate({ path: "user_id", model: "users" })
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

    //get event by id
    eventById: async (req, res) => {
        try {
            let eventId = req.params.eventId;
            let eventInfo = await EventModel
            .findOne({ _id: eventId })
            .populate({ path: "user_id", model: "users" });
            res.json(eventInfo);
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
                .populate({ path: "user_id", model: "users" })
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

}