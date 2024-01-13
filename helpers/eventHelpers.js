const { UserModel } = require("../models/userModel");
const ical = require('ical-generator');
// const { config } = require('../config/secret');

// Check if the user has access to the event
// export const belongsToUser = async (userId, eventId) => {
//     try {
//         const user = await UserModel.findById(userId).exec();

//         if (!user) {
//             return false;
//         }

//         return user.my_created_events.includes(eventId);

//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }


exports.createICalEvent = () => {
    console.log("hi")
    const cal = ical({ domain: "mytestwebsite.com", name: 'My test calendar event' });
    cal.domain("mytestwebsite.com");
    cal.createEvent({
        start: [2024, 1, 9, 10, 0],
        end: [2024, 1, 9, 12, 0],      
        summary: 'Event Description',        
        description: 'Event Description',
        location: 'Event Description',    
        url: 'Event Description',                 
        // organizer: {              
        //     name: "Trip With Me",
        //     email: config.email
        // },
    });
    return cal;
}
// const { createEvent } = require('ics')

// const ICAL = require('ical.js');
// const { createEvent } = require('ics');

// exports.createICalEvent = () => {
//     const event = {
//         start: [2024, 1, 9, 10, 0],
//         end: [2024, 1, 9, 12, 0],
//         title: 'Event Summary',
//         description: 'Event Description',
//         location: 'Event Location',
//         organizer: { email: 'your-email@gmail.com' },
//         attendees: [{ email: 'recipient@gmail.com' }],
//     };

//     return new Promise((resolve, reject) => {
//         createEvent(event, (error, value) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(value);
//             }
//         });
//     });
// }
