const { MessageModel } = require("../models/messageModel");

exports.messagesController = {
    routGet: (req, res) => {
        res.json({ msg: "Messages route works - trips project" });
    },

    byEventId: async (req, res) => {
        const eventId = req.params.eventId; 

        let perPage = req.query.perPage || 3;
        let page = req.query.page || 1;
        let sort = req.query.sort || "timestamp";
        let reverse = req.query.reverse == "yes" ? 1 : -1;

        try {
            const data = await MessageModel
                .find({ event_id: eventId })
                .populate({ path: "user_id", model: "users", select: { _id: 1, nick_name: 1, profile_image: 1 } })
                .sort({ [sort]: reverse })
                .limit(perPage)
                .skip((page - 1) * perPage);

            res.json({ messages: data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Internal server error", err });
        }
    },
};
