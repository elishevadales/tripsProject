const mongoose = require("mongoose");
const { config } = require("../config/secret")


let eventSchema = new mongoose.Schema({
    event_name: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    likes_list: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],

    join_requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ]



})

exports.EventModel = mongoose.model("events", eventSchema);