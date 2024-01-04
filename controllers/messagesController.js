const { MessageModel } = require("../models/messageModel");
const { messageValid } = require("../validations/messageValidation");
const { EventModel } = require("../models/eventModel");

exports.messagesController = {
    routGet: (req, res) => {
        res.json({ msg: "Messages route works - trips project" });
    },

    sedMessage: async (req, res) => {
        try {
            const validBody = messageValid(req.body);
            let eventId = req.params.eventId
            let userId = "6595434dcd091a41e651074f"//req.tokenData._id;

            if (validBody.error) {
                return res.status(400).json(validBody.error.details);
            }
            const newMessage = new MessageModel(req.body);
            newMessage.event_id = eventId
            newMessage.user_id = userId
            await newMessage.save();
            res.json(newMessage);
        } catch (err) {
            console.error(err);
        }
    },

    byEventId: async (req, res) => {
        const eventId = req.params.eventId;

        let perPage = req.query.perPage || 1000;
        let page = req.query.page || 1;
        let sort = req.query.sort || "time_stamp";
        let reverse = req.query.reverse == "yes" ? 1 : -1;

        try {
            const data = await MessageModel
                .find({ event_id: eventId })
                .populate({ path: "user_id", model: "users", select: { _id: 1, nick_name: 1, profile_image: 1 } })
                .sort({ [sort]: -1 })
                .limit(perPage)
                .skip((page - 1) * perPage);

            res.json({ messages: data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Internal server error", err });
        }
    },
};
