//include express into user.js
const express = require("express");
const signup = require("../controller/signup");
const login = require("../controller/login");
const logout = require("../controller/logout");
const authentication = require("../middleware/authentication");
const myrecipes = require("../controller/myrecipes");

//create user router
const router = express.Router();

//get request for login page
router.get("/login",(req, res)=>{
    res.render("loginOrsignup", {
        title:"login",
        login:true
    });
});

//post request for login page
router.post("/login",login);

//get request for signup page
router.get("/signup",(req, res)=>{
    res.render("loginOrsignup", {
        title:"register",
        signup:true
    });
});

//post request for signup page
router.post("/signup",signup);


//get request for logout
router.get("/logout",authentication, logout);

//get request for myrecipes
router.get("/myrecipes",authentication, myrecipes);

module.exports = router;