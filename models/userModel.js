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
    default: "https://firebasestorage.googleapis.com/v0/b/tripsproject-de869.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=c9b52448-9c6e-4d7a-9743-5b5115767781"
  },
  background_image: {
    type: String,
    default: "https://images.pexels.com/photos/2668314/pexels-photo-2668314.jpeg"
  },
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
  favorite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      default: []
    }
  ],
  my_join_events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      default: []
    }
  ],
  my_created_events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      default: []
    }
  ]

})

exports.UserModel = mongoose.model("users", userSchema);


