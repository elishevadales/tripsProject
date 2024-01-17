const mongoose = require("mongoose");
const Joi = require("joi")
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")
const crypto = require('crypto');

let userSchema = new mongoose.Schema({
  name: String,
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  passwordResetToken: String,
  passwordResetExpires: Date,
  email: String,
  password: String,
  gender: String,
  date_created: {
    type: Date,
    default: () => Date.now() + (3 * 60 * 60 * 1000)
  },
  birth_date: {
    type: Date,
    default: () => Date.now() + (3 * 60 * 60 * 1000)
  },
  age: {
    type: Number,
    default: function () {
      const birthDate = new Date(this.birth_date);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
        return age - 1;
      }

      return age;
    }
  },
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

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.passwordResetToken = resetToken
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
  return resetToken;
};


exports.UserModel = mongoose.model("users", userSchema);


