const { EventModel } = require("../../models/eventModel");
const { UserModel } = require("../../models/userModel");
// const { getIcalObjectInstance } = require('../../helpers/eventHelpers')
const { sendEmailInvite } = require("../../utility/transporter")
const createICalEvent = require('../../helpers/eventHelpers')

exports.participantController = {

    addParticipant: async (req, res) => {
        try {
            let eventId = req.params.eventId;
            let userToAdd = req.params.userId;
            let userId = req.tokenData._id;

            const event = await EventModel.findById(eventId);
            
            if (!event.open_event && !(req.tokenData.role == "admin" ||event.user_id == userId )) {
                return res.status(403).json({ msg: "Permission denied" });
            }

            if (!event) {
                return res.status(404).json({ msg: 'Event not found' });
            }

            const participants = event.participants.includes(userToAdd);

            if (participants) {
                return res.status(400).json({ msg: 'User is already a participant' });
            }

           

            const user = await UserModel.findByIdAndUpdate(
                userToAdd,
                { $push: { my_join_events: eventId } },
                { new: true }
            );

            // const cal = eventHelpers.getIcalObjectInstance(event.date_and_time, Date(), event.trip_details, event.place_info, event.place_info, event.place_info)
            // sendemail(user.email,`Invite for ${event.event_name}`, cal)
            const cal = createICalEvent
            sendEmailInvite(user.email,`Invite for ${event.event_name}`, cal, event, user.name)

            event.participants.push(userToAdd);
            await event.save();

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

