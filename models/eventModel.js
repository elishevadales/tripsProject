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
    address: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    category: {
        type:String,
        required: true
    },
    sub_category: String,
    parking: String,
    district: String,
    coordinates: {
        lat: {
            type: Number
        },
        lon: {
            type: Number
        },
    },
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
            default: ["https://t3.ftcdn.net/jpg/05/63/76/92/360_F_563769202_XvjMvyMO593Wt70Um2OQPJ5CZrTXbT4t.jpg"]
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: []
        }
    ],

})


exports.EventModel = mongoose.model("events", eventSchema);