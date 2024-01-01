const { EventModel } = require("../../models/eventModel");
const { UserModel } = require("../../models/userModel");


exports.participantController = {

    addParticipant: async (req, res) => {
        try {
            let eventId = req.params.eventId;
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const participants = event.participants.includes(userId);

            if (participants) {
                return res.status(400).json({ msg: 'User is already a participant' });
            }

            event.participants.push(userId);
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

            const participants = event.participants.includes(userId);

            if (!participants) {
                return res.status(400).json({ msg: 'User is not a participant' });
            }
    
            event.participants = event.participants.filter(id => id.toString() !== userId);

            await event.save();
            res.json({ msg: 'Participant removed successfully' });

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'err', err });
        }
    }
}

