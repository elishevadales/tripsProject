const { EventModel } = require("../../models/eventModel");


exports.filterEventController = {

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

}