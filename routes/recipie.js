//include express into the recipie
const express = require("express");
const router = express.Router();
const write = require("../controller/write");
const multer = require("multer");
const read = require("../controller/read");
const detailedProcedure = require("../controller/detailRecipie");
const uploadComment = require("../controller/uploadComment");
const rating = require("../controller/rating");
const sessionmiddleware = require("../middleware/session");
const authentication = require("../middleware/authentication");
const editrecipe = require("../controller/editrecipe");
const update = require("../controller/update");

router.use(authentication);

//get request for read recipie page
router.get("/read", sessionmiddleware, read);

//get request for veg/non-veg recipes
router.get("/read/:category", read);

//get request for detailed procedure based on the id
router.get("/recipie", detailedProcedure);

//post request for uploading comments
router.post("/recipie", uploadComment);

//post request for uploading recipies rating
router.post("/recipie/rating", rating);

//get request for write recipie page 
router.get("/write", (req,res)=>{
    if(!res.locals.authenticated){
        return res.render("home",{homewarning:"Please register/login to write recipies", read:true});
    }
    res.render("write",{
        read:true
    });
})

const uploadImage = multer({
    limits:{
        fileSize:400000
    }
});

//post request for write recipie page
router.post("/write",authentication, uploadImage.single("myImage"), write, (err, req, res,next)=>{
    req.body["fileError"]=err.message;
    res.render("write", {body:req.body, read:true})
});

//get request for edit page
router.get("/edit", authentication, editrecipe);

//post request for edit page
router.post("/edit", authentication, uploadImage.single("recipieImage"), update, (err, req, res, next)=>{
    res.render("update", {section:"recipieImage", warning:err.message, recipeSection:req.body["recipieImage"]})
});

module.exports = router;