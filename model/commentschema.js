//require mongoose model
const mongoose = require("mongoose");

//create comment schema
const commentschema = new mongoose.Schema({
    commentBody:String,
    commentedBy:String,
    commentedAt:{
        type:Date, 
        default:Date.now(),
        get:function(value){
            var date = new Date(value);
            return date.getDate()+"/"+(date.getMonth()+1) +"/" +date.getFullYear();
        }
    }
});

//export comment model
module.exports = mongoose.model("Comment", commentschema);