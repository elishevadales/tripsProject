const { EventModel } = require("../../models/eventModel");

exports.searchEventController = {

    searchByName: async (req, res) => {
        let perPage = req.query.perPage || 3;
        let page = req.query.page || 1;
        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);
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
        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);
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
        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

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
        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

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
        const sort = req.query.sort || "date_created";;
        const reverse = sort === "date_created" ? -1 : (req.query.reverse == "yes" ? -1 : 1);

        try {
            const queryS = req.query.search || "";
            const searchReg = new RegExp(queryS, "i");
            let textSearch = queryS.split(',');

            textSearch = textSearch.map(text => text.trim());
            let textSearchArray = textSearch.map(text => new RegExp(text, "i"));

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

}