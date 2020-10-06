//include user module
const {User, createToken} = require("../model/userschema");
const errorHandler = require("../error");
const jwt = require("jsonwebtoken");
//middleware function for signup
module.exports = async function(req, res){
    //create user document from User module
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    });

    //save the user model to database
    try{
        const savedUser = await user.save();
        const token = await createToken(savedUser._id);
        //set token to the cookie
        res.cookie("x-jwt-token", token,{httpOnly:true});
        res.redirect("/");
    }catch(err){
        if(err.name == "ValidationError"){
            errorHandler(err, req.body);
            res.render("loginOrsignup",{body:req.body, title:"register", signup:true});
        }else{
            console.log(err);
        }
    }
}
