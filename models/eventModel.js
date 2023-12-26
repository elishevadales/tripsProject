const mongoose = require("mongoose");
const { config } = require("../config/secret")

const priceSchema = new mongoose.Schema({
    adult: Number,
    studentOrSoldier: Number,
    child: Number,
    free: Boolean, // Boolean to indicate if it's free or not  test 

});

let eventSchema = new mongoose.Schema({

    event_name: String,
    category: String,
    parking: String,
    accessibility: Boolean,
    details: String,
    date_and_time: Date,
    during: String,
    open_event: Boolean,
    required_equipment: String,
    active: Boolean,
    price: {
        type: priceSchema,
        default: {
            adult: 0,
            studentSoldier: 0,
            child: 0,
            free: true,
        },
    },
    
    images: [
        {
            type: String, 
        },
    ],

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