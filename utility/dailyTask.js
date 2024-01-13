
const { EventModel } = require('../models/eventModel');
const moment = require('moment')
const { UserModel } = require("../models/userModel");
const { sendEmailInvite } = require("./transporter")
const createICalEvent = require('../helpers/eventHelpers')

exports.updateEvents = async () => {
    try {
        // Find events with date_and_time set and active is true
        const eventsToUpdate = await EventModel.find({
            date_and_time: { $lte: new Date() },
            active: true,
        });

        // Update active to false for each event found
        await Promise.all(
            eventsToUpdate.map(async (event) => {
                event.active = false;
                await event.save();
            })
        );

        console.log('Events updated successfully');
    } catch (error) {
        console.error('Error updating events:', error);
    }
}


exports.emailRemainderForTomorrowEvents = async () => {
    try {
        const tomorrowEvents = await EventModel.find({
            active: true,
            date_and_time: {
                $gte: moment().startOf('day').add(1, 'days').toDate(), // Start of tomorrow
                $lt: moment().startOf('day').add(2, 'days').toDate(), // Start of the day after tomorrow
            },
        });

        const cal = createICalEvent
        let user
        let participants
        tomorrowEvents.forEach((event) => {
            participants = event.participants
            participants.forEach(async userId => {
                user = await UserModel.findOne({ _id: userId });
                sendEmailInvite(user.email, `Event ${event.event_name} remainder`, cal, event, user.name)
            });
        });

        console.log('Finished send remaind events for tomorrow');
    } catch (error) {
        console.error('Error logging events:', error);
    }
}