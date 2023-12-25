const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel")
const { userValid, loginValid } = require("../validations/userValidations")
const router = express.Router();
const {auth, authAdmin} = require("../middlewares/auth")
const {createToken} = require("../auth/token")
const { userController } = require("../controllers/userController");


//get all users
router.get("/usersList",auth, userController.usersList)

//sign-up
router.post("/", async (req, res) => {

  let valdiateBody = userValid(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    let user = new UserModel(req.body);

    user.password = await bcrypt.hash(user.password, 10)
    await user.save();

    user.password = "*********";
    res.status(201).json(user)
  }
  catch (err) {

    if (err.code == 11000) {
      return res.status(400).json({ msg: "Email already in system try login", code: 11000 })
    }
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})


//log-in
router.post("/login", async (req, res) => {
  let valdiateBody = loginValid(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {

    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {

      return res.status(401).json({ msg: "Password or email is worng ,code:1" })
    }

    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Password or email is worng ,code:2" })
    }

    if (user.active == false) {
      return res.status(401).json({ msg: "your account is blocked. Please contact the site administrator" });
    }

    // create token that includes userID
    let token = createToken(user._id, user.role);
    res.json({ token, role: user.role, active: user.active });
  }
  catch (err) {

    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

//delete user
router.delete("/:delId", async (req, res) => {

  let delId = req.params.delId;
  let data = await UserModel.deleteOne({ _id: delId });
  res.json(data);

})

module.exports = router;