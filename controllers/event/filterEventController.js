const { EventModel } = require("../../models/eventModel");


exports.filterEventController = {

    parkingFree: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

        try {
            const data = await EventModel
                .find({ parking: true, active: true })
                .populate({
                    path: "user_id",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1, active: 1, role: 1
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
                        active: 1, role: 1
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

    accessibility: async (req, res) => {
        const perPage = Math.min(req.query.perPage, 10) || 99;
        const page = req.query.page || 1;
        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

        try {
            const data = await EventModel
                .find({ accessibility: true, active: true })
                .populate({
                    path: "user_id",
                    model: "users",
                    select: {
                        _id: 1,
                        nick_name: 1,
                        profile_image: 1,
                        background_image: 1,
                        gender: 1, active: 1, role: 1
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
                        active: 1, role: 1
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


    searchMultiple: async (req, res) => {

        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

        try {

            const { name, date_and_time, category, price, parking, accessibility } = req.query;

            // Convert parking and accessibility to boolean
            const parkingBool = parking === 'true' ? true : false;
            const accessibilityBool = accessibility === 'true' ? true : false;
            let parsedDate;

            if (date_and_time && !isNaN(Date.parse(date_and_time))) {
                parsedDate = new Date(date_and_time);
            }

            const data = await EventModel
                .find({
                    $or: [
                        { event_name: new RegExp(name, 'i') },
                        { date_and_time: parsedDate },
                        { category: category.toLowerCase() },
                    ],
                    // parking: parkingBool,
                    accessibility: accessibilityBool,
                })
                .sort({ [sort]: reverse });

            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

}