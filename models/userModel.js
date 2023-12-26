const mongoose = require("mongoose");
const Joi = require("joi")
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")

let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
  date_created: {
    type: Date,
    default: () => Date.now() + (3 * 60 * 60 * 1000)
  },
  age: Number,
  district_address: String,
  about: String,
  profile_image: {
    type: String,
    default: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
  },
  background_image: String,
  nick_name: {
    type: String,
    default: function () {
      // 'this' refers to the document being created
      return this.name ? `${this.name.replace(/\s/g, '_')}` : null;
    }
  },
  active: {
    type: Boolean, default: true
  },
  role: {
    type: String, default: "user"
  },
  events_i_liked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events"
    }
  ],
  my_join_events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events"
    }
  ],
  my_created_events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events"
    }
  ]

})

exports.UserModel = mongoose.model("users", userSchema);


