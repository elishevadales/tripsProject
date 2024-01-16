const { UserModel } = require("../models/userModel");
const { createToken } = require("../auth/token");
const bcrypt = require("bcrypt");
const { config } = require("../config/secret")
const { userValid, loginValid, validUpdateUserInfo, resetPasswordValid } = require("../validations/userValidations")
const { EventModel } = require("../models/eventModel");
const { sendEmailSignUp, sendPasswordResetEmail } = require("../utility/transporter")

exports.userController = {

    routGet: (req, res) => {
        res.json({ msg: "users work - trips project" })
    },

    checkToken: async (req, res) => {
        res.json(req.tokenData);
    },

    resetPassword: async (req, res) => {
        const { token } = req.params;
        const { newPassword } = req.body;

        let valdiateBody = resetPasswordValid(req.body);

        if (valdiateBody.error) {
            return res.status(400).json(valdiateBody.error.details)
        }
        try {
            const user = await UserModel.findOne({ passwordResetToken: token });

            if (!user) {
                return res.status(404).json({ message: 'Invalid or expired token' });
            }

            user.password = newPassword;
            user.passwordResetToken = undefined;
            await user.save();

            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    forgotPassword: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const resetToken = user.generatePasswordResetToken();
            await user.save();

            const link = `${config.client_url}/resetPassword/${resetToken}`
           
            sendPasswordResetEmail(user.email, link);

            res.status(200).json({ message: 'Password reset email sent' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    verify: async (req, res) => {
        const token = req.params.verToken;

        if (!token) {
            return res.status(400).json({ msg: 'Token is missing' });
        }
        try {
            const user = await UserModel.findOne({ verificationToken: token });

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            // Mark the user as verified
            user.verified = true;
            user.verificationToken = undefined;
            await user.save();

            // Redirect to login page or send a response
            res.redirect(`${config.client_url}/login`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
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
            const token = createToken(user._id, user.role)
            user.verificationToken = token
            await user.save();

            const verificationLink = `${config.servrt_url}/users/verify/${token}`
            sendEmailSignUp(user.email, user.name, verificationLink)

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


            if (user.verified === false) {
                return res.status(401).json({ msg: "Not verified", code: 5 });
            }

            if (user.active == false) {
                return res.status(401).json({ msg: "your account is blocked. Please contact the site administrator", code: 3 });
            }

            // create token that includes userID
            let token = createToken(user._id, user.role);
            res.json({ token, role: user.role, active: user.active });
        }
        catch (err) {

            console.log(err)
            res.status(500).json({ msg: "500 err", err, code: 500 })
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
        let validBody = validUpdateUserInfo(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }

        try {
            let data = await UserModel.updateOne({ _id: req.tokenData._id }, req.body);
            res.json(data);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },


    chackJoinRequest: async (req, res) => {
        try {
            let userId = req.tokenData._id;
            let userInfo = await UserModel.findOne({ _id: userId });
            let hasRequests = false;

            for (const eventId of userInfo.my_created_events) {
                let { join_requests, active } = await EventModel.findOne({ _id: eventId });

                if (join_requests.length > 0 && active === true) {
                    hasRequests = true;
                }
            }
            res.json(hasRequests);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },



    getJoinRequest: async (req, res) => {
        try {
            const userId = req.tokenData._id;
            const userInfo = await UserModel.findOne({ _id: userId });

            const events = [];

            for (const eventId of userInfo.my_created_events) {
                const event = await EventModel.findOne({ _id: eventId });

                if (event.join_requests.length > 0) {
                    console.log(event._id.toString())
                    // Get user information for each join request
                    const joinRequests = await UserModel.find({ _id: { $in: event.join_requests } })
                        .select({
                            _id: 1,
                            nick_name: 1,
                            profile_image: 1,
                            about: 1,
                            gender: 1,
                            age: 1,
                            district_address: 1,
                            active: 1,
                            role: 1,
                        });

                    event.join_requests = joinRequests;
                    events.push(event);
                }
            }

            res.json({ status: "success", data: events });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    },




    userInfo: async (req, res) => {
        try {
            let userId = req.params.userId;
            let userInfo = await UserModel.findOne({ _id: userId }, { password: 0 })
                .populate({
                    path: "my_created_events",
                    model: "events",
                    select: {
                        _id: 1,
                        event_name: 1,
                        images: 1,
                        like_list: 1,
                        participants: 1,
                        date_and_time: 1,
                        date_created: 1,
                        active: 1,
                    },
                })
                .populate({
                    path: "my_join_events",
                    model: "events",
                    select: {
                        _id: 1,
                        event_name: 1,
                        images: 1,
                        like_list: 1,
                        participants: 1,
                        date_and_time: 1,
                        date_created: 1,
                        active: 1,
                    },
                })
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
                return res.status(401).json({ msg: "You can't delete superAdmin" });

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