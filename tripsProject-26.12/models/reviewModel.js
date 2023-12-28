const mongoose = require("mongoose");
const { config } = require("../config/secret")

const reviewSchema = new mongoose.Schema({
    rate:{
        type: Number,
        min:1,
        max:5,
        required:true
    },
    comment:String,
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "events" 
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
    

});
exports.ReviewModel = mongoose.model("reviews", reviewSchema);