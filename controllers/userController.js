const { UserModel } = require("../models/userModel");
const { createToken } = require("../auth/token");
const bcrypt = require("bcrypt");
const { config } = require("../config/secret")
const { userValid, loginValid, validUpdateUserInfo } = require("../validations/userValidations")


exports.userController = {

    routGet: (req, res) => {
        res.json({ msg: "users work - trips project" })
    },

    checkToken: async (req, res) => {
        res.json(req.tokenData);
    },

    usersList: async (req, res) => {
        let perPage = Math.min(req.query.perPage, 20) || 99;
        let page = req.query.page || 1;
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? -1 : 1;

        try {
            let data = await UserModel
                .find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    signUp: async (req, res) => {

        let valdiateBody = userValid(req.body);
        if (valdiateBody.error) {
            return res.status(400).json(valdiateBody.error.details)
        }
        try {
            let user = new UserModel(req.body);

            user.password = await bcrypt.hash(user.password, 10)
            await user.save();

            user.password = "***";
            res.status(201).json(user)
        }
        catch (err) {

            if (err.code == 11000) {
                return res.status(400).json({ msg: "Email already in system try login", code: 11000 })
            }
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }

    },



    login: async (req, res) => {
        let valdiateBody = loginValid(req.body);
        if (valdiateBody.error) {
            return res.status(400).json(valdiateBody.error.details)
        }
        try {

            let user = await UserModel.findOne({ email: req.body.email })
            if (!user) {

                return res.status(401).json({ msg: "Password or email is wrong", code: 1 })
            }

            let validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(401).json({ msg: "Password or email is wrong", code: 2 })
            }

            if (user.active == false) {
                return res.status(401).json({ msg: "your account is blocked. Please contact the site administrator", code:3 });
            }

            // create token that includes userID
            let token = createToken(user._id, user.role);
            res.json({ token, role: user.role, active: user.active });
        }
        catch (err) {

            console.log(err)
            res.status(500).json({ msg: "500 err", err, code:500 })
        }
    },


    myInfo: async (req, res) => {
        try {
            let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
            res.json(userInfo);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },

    changeMyInfo: async (req, res) => {
        let validBody = validInfo(req.body);
        if (validBody.error) {
          return res.status(400).json(validBody.error.details);
        }
    
        try {
          let data = await UserModel.updateOne({ _id: req.tokenData._id },
            //  { $set: { "name": req.body.name, "img_url": req.body.img_url} }
            req.body
          );
          res.json(data);
        }
        catch (err) {
          console.log(err)
          res.status(500).json({ msg: "err", err })
        }
      },


      changeMyInfo: async (req, res) => {
        let validBody = validUpdateUserInfo(req.body);
        if (validBody.error) {
          return res.status(400).json(validBody.error.details);
        }
    
        try {
          let data = await UserModel.updateOne({ _id: req.tokenData._id },req.body);
          res.json(data);
        }
        catch (err) {
          console.log(err)
          res.status(500).json({ msg: "err", err })
        }
      },


    userInfo: async (req, res) => {
        try {
            let userId = req.params.userId;
            let userInfo = await UserModel.findOne({ _id: userId }, { password: 0 });
            res.json(userInfo);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    countUsers: async (req, res) => {
        try {
            // Count the number of users where active is true
            let count = await UserModel.countDocuments({ active: true });
            res.json({ count });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },

    changeRole: async (req, res) => {
        if (!req.body.role) {
            return res.status(400).json({ msg: "Need to send role in body" });
        }

        try {
            let userID = req.params.userID
            // cannot change admin to user
            if (userID == config.admin_token) {
                return res.status(401).json({ msg: "You cant change superadmin role" });

            }
            if (req.body.role != "admin" && req.body.role != "user") {
                return res.status(401).json({ msg: "role can be only user/admin" });

            }
            if (userID == req.tokenData._id) {
                return res.status(401).json({ msg: "You cant change your own role" });
            }

            let data = await UserModel.updateOne({ _id: userID }, { role: req.body.role })
            res.json(data);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    changeActive: async (req, res) => {
        if (!req.body.active && req.body.active != false) {
            return res.status(400).json({ msg: "Need to send active in body" });
        }

        try {
            let userID = req.params.userID
            // admin cannot return to false
            if (userID == config.admin_token) {
                return res.status(401).json({ msg: "You cant block superadmin" });

            }
            if (userID == req.tokenData._id) {
                return res.status(401).json({ msg: "You cant change your Active status" });
            }
            let data = await UserModel.updateOne({ _id: userID }, { active: req.body.active })
            res.json(data);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    deleteUser: async (req, res) => {
        try {
            let delId = req.params.delId;

            //lll
            if (delId == config.admin_token) {
                return res.status(401).json({ msg: "You can't delete superAdmin"});

            }
            if (req.tokenData._id == delId) {
                return res.status(401).json({ msg: "You can't delete your own acount" });

            }
    

            let data = await UserModel.deleteOne({ _id: delId });
            res.json(data);

        }

        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err 500", err })
        }

    }
}