const {User, createToken} = require("../model/userschema");
const bcrypt = require("bcrypt");


module.exports =  async (req,res)=>{
    try{
        //check if the email entered is available in the data base
        const user = await User.findUserByEmail(req.body.email);
        //if user is present check the password is matching
        if(user){
            const pwdmatch = await bcrypt.compare(req.body.password, user.password);
            if(pwdmatch){
            //create a jwt token
            const token = await createToken(user._id);
            //store the token in the cookie
            res.cookie("x-jwt-token",token,{httpOnly:true});
            //redirect to home page
            res.redirect("/");
            return;
        }else throw new Error("Invalid username or password");
    }else throw new Error("Invalid username or password");
    }catch(err){
        req.body["passwordValidationError"] = err.message;
        res.render("loginOrsignup",{body:req.body, title:"login", login:true});
    }

}