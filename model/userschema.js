//include mongoose
const mongoose = require("mongoose");
//include isEmail from validator module
const {isEmail} = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//create userSchema
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        minlength:[3, "Username cannot be less than 3 characters."],
        maxlength:[255, "Username cannot be more than 255 characters."],
        required:[true, "Please specify the username."],
        validate:{
            validator:function(value){
                return isNaN(value);
            },
            message:"Please enter the valid username."
        }
    },
    email:{
        type:String,
        required:[true, "Please specify the email."],
        maxlength:[255, "Email cannot be more than 255 characters."],
        validate:{
            isAsync:true,
            validator:function(value, callback){
                mongoose.model("User", userSchema).countDocuments({}, (err,count)=>{
                    if(count>0){
                        mongoose.model("User", userSchema).find({email:value}, (err,res)=>{
                            callback(res.length==0);
                        })
                    }else callback(true);
                }) 
            },
            message:"Email already exists."
        } 
    },
    password:{
        type:String,
        minlength:[6, "Password should be atleast 6 characters long."],
        maxlength:1024,
        required:[true, "Please specify the password."]
    }
});

//hash the password before saving to db
userSchema.pre("save", async function (next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//create a function to create a jwt token
async function createToken(id){
    return await jwt.sign({id:id}, process.env.JWTSECRETKEY);
};

//Additional validation for email 
userSchema.path("email").validate(value =>{
    return isEmail(value);
}, "Please enter valid email");

//find the user for the given Id
userSchema.statics.findUserById = async function (id){
    try{
        const user = await this.findById(id);
        return user;
    }catch(err){
        console.log(err);
    }
}

//find the user by email_id
userSchema.statics.findUserByEmail = async function(email){
    try{
        const user = await this.findOne({email:email});
        return user;
    }catch(err){
        console.log(err);
    }
}
//create user model out of userschema
const User = mongoose.model("User", userSchema);

module.exports = {
    User, createToken
}
