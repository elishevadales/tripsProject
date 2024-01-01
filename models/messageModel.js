const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events"
    },
    text: String,
    img_url: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});




exports.MessageModel = mongoose.model("messages", messageSchema);