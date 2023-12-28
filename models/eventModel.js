const mongoose = require("mongoose");
const { config } = require("../config/secret")

const participantsSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    reank:  {
        type: Number,
        default: 0
    },
});


const priceSchema = new mongoose.Schema({
    adult: Number,
    studentOrSoldier: Number,
    child: Number,
    free: Boolean, // Boolean to indicate if it's free or not  test 

});

let eventSchema = new mongoose.Schema({

    event_name: String,
    category: String,
    sub_category: String,
    parking: String,
    district: String,
    date_created: {
        type: Date,
        default: Date.now,
    },
    accessibility: {
        type: Boolean,
        default: false
    },
    place_info: String,
    trip_details: String,
    date_and_time: {
        type: Date,
        validate: {
            validator: function (value) {
                return !this.date_created || value > this.date_created;
            },
            message: "date_and_time must be after date_created",
        },
        required: true,
    },
    during: String,
    open_event: Boolean,
    required_equipment: String,
    active: {
        type: Boolean, default: true
    },
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

    like_list: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: []
        }
    ],

    join_requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: []
        }
    ],
    participants: [
        {
            type: participantsSchema,

        }
    ]



})

exports.EventModel = mongoose.model("events", eventSchema);