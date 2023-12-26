
const { config } = require("../config/secret")
const { EventModel } = require("../models/eventModel");
const { UserModel } = require("../models/userModel");
const { eventValid } = require("../validations/eventValidations")


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
                .find({ "price.free": true })
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
                "price.adult": { $gte: minPrice, $lte: maxPrice }
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


    searchByCategory : async (req, res) => {
        let perPage = req.query.perPage || 3;
        let page = req.query.page || 1;
        let sort = req.query.sort || "date_created";
        let reverse = req.query.reverse == "yes" ? 1 : -1;
        try {
            let queryS = req.query.search;
            let searchReg = new RegExp(queryS, "i")
            let eventSearch = await EventModel
                .find({ category : searchReg })
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
            console.log(queryS)
            let categories = queryS.split(',');
            categories = categories.map(category => category.trim());
            let categoryRegexArray = categories.map(category => new RegExp(category, "i"));
            let eventSearch = await EventModel
                .find({ sub_category: { $in: categoryRegexArray } })
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


}