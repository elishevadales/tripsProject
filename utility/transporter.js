const nodemailer = require('nodemailer');
const { config } = require('../config/secret');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: config.email,
        pass: config.email_pass
    },
});

exports.sendEmailInvite = async (sendto, subject, calendarObj = null, event, name) => {
    const fs = require('fs');
    let htmlContent = fs.readFileSync('utility/invite.html', 'utf8');
    htmlContent = htmlContent.replace('%EVENT_NAME%', event.event_name);
    htmlContent = htmlContent.replace('%CLIENT_URL%', config.client_url);
    htmlContent = htmlContent.replace('%USER_NAME%', name);
    htmlContent = htmlContent.replace('%EVENT_INFO%', event.trip_details ? event.trip_details : "");
    htmlContent = htmlContent.replace('%EVENT_LOCATION%', event.place_info);
    htmlContent = htmlContent.replace('%IMAGE_URL%', event.images[0]);
    htmlContent = htmlContent.replace('%EVENT_DATE%', new Date(event?.date_and_time).toLocaleDateString('en-GB'));
    htmlContent = htmlContent.replace('%EVENT_TIME%', new Date(event?.date_and_time).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    }));
    mailOptions = {
        from:config.email,
        to: sendto,
        subject: subject,
        html: htmlContent,
        attachments: [
            {
                filename: 'invite.ics',
                content: calendarObj.toString(),
                encoding: 'base64',
            },
        ],
    }
    if (calendarObj) {
        let alternatives = {
            "Content-Type": "text/calendar",
            "method": "REQUEST",
            "content": Buffer.from(calendarObj.toString()),  // Updated this line
            "component": "VEVENT",
            "Content-Class": "urn:content-classes:calendarmessage"
        };

        mailOptions['alternatives'] = alternatives;
        mailOptions['alternatives']['contentType'] = 'text/calendar';
        mailOptions['alternatives']['content'] = Buffer.from(calendarObj.toString());  // Updated this line
    }
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: ", response);
        }
    })
}
exports.sendPasswordResetEmail= async (sendto, tokenUrl) => {
    const fs = require('fs');
    console.log("tokenUrl",tokenUrl)
    let htmlContent = fs.readFileSync('utility/resetPassword.html', 'utf8');
    htmlContent = htmlContent.replace('%VERIFICATION_LINK%', tokenUrl);
    mailOptions = {
        from:'Trip With Me 🗝️ <foo@blurdybloop.com>',
        to: sendto,
        subject: "איפוס סיסמא",
        html: htmlContent,
    }

    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: ", response);
        }
    }) 
}

exports.sendEmailSignUp = async (sendto, name, tokenUrl) => {
    const fs = require('fs');
    let htmlContent = fs.readFileSync('utility/signUp.html', 'utf8');
    htmlContent = htmlContent.replace('%VERIFICATION_LINK%', tokenUrl);
    htmlContent = htmlContent.replace('%USER_NAME%', name);

    const mailOptions = {
        from: 'Trip With Me 👥 <foo@blurdybloop.com>',
        to: sendto,
        subject: "אישור הרשמה",
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};
