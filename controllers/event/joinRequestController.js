const { EventModel } = require("../../models/eventModel");

exports.joinRequestController = {

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
            let userToRemove = req.params.userToRemove
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const joinRequests = event.join_requests.includes(userToRemove);

            if (!joinRequests) {
                return res.status(404).json({ msg: 'Join request not found' });
            }

            event.join_requests = event.join_requests.filter(id => id.toString() !== userToRemove);
            await event.save();
            res.json({ msg: 'Join request removed successfully' });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },

}