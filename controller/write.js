//import Recipie mode
const Recipie = require("../model/recipieschema");
require("dotenv").config();
const errorHandler = require("../error");

module.exports = async (req, res)=>{
    try{
        //create Recipie instancee
        const recipie = new Recipie({
            recipie:req.body.recipie,
            description:req.body.description,
            ingredients:req.body.ingredients,
            category:req.body.category,
            procedure:req.body.procedure,
            recipieImage: req.file.buffer,
            uploadedBy:res.locals.user.username
        });
        //save the recipie in the databas
        const savedRecipie = await recipie.save();
        res.render("success",{name:res.locals.user.username, recipie: recipie.recipie, read:true});
    }catch(err){
        if(err.name == "ValidationError"){
            errorHandler(err, req.body);
            res.render("write", {body:req.body, read:true});
        }else{
            if(err.name == "TypeError"){
                res.render("write", {warning:"Kindly fill all the fields", read:true});
            }
        }
    }
}