const express = require("express");
const router = express.Router();
const {auth, authAdmin} = require("../middlewares/auth")
const { userController } = require("../controllers/userController");


//shows that the router works
router.get("/", userController.routGet)
router.get("/checkToken",auth, userController.checkToken)
// returns user's information by token
router.get("/myInfo", auth, userController.myInfo)
// return any user's details
router.get("/userInfo/:userId", auth, userController.userInfo)
//get all users
router.get("/usersList",auth, userController.usersList)
// returns the number of users
router.get("/count", auth, userController.countUsers)
//sign-up
router.post("/", userController.signUp)
//log-in
router.post("/login", userController.login)
//change role to user/admin
router.patch("/changeRole/:userID", authAdmin, userController.changeRole);
////change active to true/false
router.patch("/changeActive/:userID", authAdmin, userController.changeActive)
//delete user
router.delete("/:delId", userController.deleteUser)

module.exports = router;