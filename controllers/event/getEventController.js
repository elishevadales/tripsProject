const { EventModel } = require("../../models/eventModel");


exports.getEventController = {

    // Get all the active events 
    activeEventList: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

        try {
            const data = await EventModel
                .find({ active: true })
                .populate({
                    path: "user_id", model: "users", select: {
                        _id: 1, nick_name: 1, profile_image: 1, background_image
                            : 1, gender: 1
                    }
                })
                .populate({
                    path: "user_id",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,active:1, role:1
                    },
                })
                .populate({
                    path: "participants",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,
                        active:1, role:1
                    },
                })
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
        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

        try {
            const data = await EventModel
                .find({})
                .populate({
                    path: "user_id",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,active:1, role:1, age:1
                    },
                })
                .populate({
                    path: "participants",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,
                        active:1, role:1, age:1
                    },
                })
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


    EventListLight: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "date_created";
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

        try {
            const data = await EventModel
                .find({})
                .select("event_name images address coordinates category date_and_time active _id") // Select only the fields you need
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
                .lean(); // Optional: Use lean() to get plain JavaScript objects instead of Mongoose documents

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },

    //get event by id
    eventById: async (req, res) => {
        try {
            let eventId = req.params.eventId;
            let eventInfo = await EventModel
                .findOne({ _id: eventId })
                .populate({
                    path: "user_id",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,active:1, role:1, age:1
                    },
                })
                .populate({
                    path: "join_requests",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,
                        active:1, role:1, age:1
                    },
                })
                .populate({
                    path: "participants",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,
                        active:1, role:1, age:1
                    },
                });
    
            res.json(eventInfo);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    

    eventFree: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "date_created";
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

        try {
            const data = await EventModel
                .find({ "price.free": true, active: true })
                .populate({
                    path: "user_id",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,active:1, role:1
                    },
                })
                .populate({
                    path: "participants",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,
                        active:1, role:1
                    },
                })
                .populate({
                    path: "join_requests",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1,
                        active:1, role:1
                    },
                })
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