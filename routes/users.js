const express = require("express");
const bcrypt = require("bcrypt");
const {UserModel,userValid,loginValid} = require("../models/userModel")
const router = express.Router();

//get all users
router.get("/",async(req,res) => {
  let perPage = Math.min(req.query.perPage,20) || 99;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await UserModel
    .find({})
    .limit(perPage)
    .skip((page - 1)*perPage)
    .sort({[sort]:reverse})
    res.json(data)
  }
  catch (err){
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})


//sign-up
router.post("/", async(req,res) => {

  let valdiateBody = userValid(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }
  try{
    let user = new UserModel(req.body);
    // הצפנה חד כיוונית לסיסמא ככה 
    // שלא תשמר על המסד כמו שהיא ויהיה ניתן בקלות
    // לגנוב אותה
    user.password = await bcrypt.hash(user.password, 10)
    await user.save();
    // כדי להציג לצד לקוח סיסמא אנונימית
    // האקרים יכולים לעשות פעולה שמחזירה אחורה ולבדוק מה הנתונים שנשלחו דרך הצד לקוח
    user.password = "*********";
    res.status(201).json(user)
  }
  catch(err){
    // בודק אם השגיאה זה אימייל שקיים כבר במערכת
    // דורש בקומפס להוסיף אינדקס יוניקי
    if(err.code == 11000){
      return res.status(400).json({msg:"Email already in system try login",code:11000})
    }
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
  
  })


  //log-in
  router.post("/login", async(req,res) => {
    let valdiateBody = loginValid(req.body);
    if(valdiateBody.error){
      return res.status(400).json(valdiateBody.error.details)
    }
    try{
      // לבדוק אם המייל שנשלח בכלל יש רשומה של משתמש שלו
      let user = await UserModel.findOne({email:req.body.email})
      if(!user){
        // שגיאת אבטחה שנשלחה מצד לקוח
        return res.status(401).json({msg:"User and password not match code 1 "})
      }
      // בדיקה הסימא אם מה שנמצא בבאדי מתאים לסיסמא המוצפנת במסד
      let validPassword = await bcrypt.compare(req.body.password, user.password);
      if(!validPassword){
        return res.status(401).json({msg:"User and password not match code 2"})
      }
      // בשיעור הבא נדאג לשלוח טוקן למשתמש שיעזור לזהות אותו 
      // לאחר מכן לראוטרים מסויימים
      res.json({msg:"Success, Need to send to client the token"});
    }
    catch(err){
      
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })

//delete user
router.delete("/:delId", async(req,res) => {

    let delId = req.params.delId;
    let data = await UserModel.deleteOne({_id:delId});
    res.json(data);

  })

module.exports = router;