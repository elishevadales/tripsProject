const {UserModel} = require("../models/userModel");
const createToken = require("../auth/token")


exports.userController = {
    usersList :async (req, res) => {
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
      }
}