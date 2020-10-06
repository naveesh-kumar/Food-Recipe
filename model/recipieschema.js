//include mongoose
const mongoose = require("mongoose");
const Comment = require("./commentschema");

//create recipieschema 
const recipieschema = new mongoose.Schema({
    recipie:{
        type:String,
        required:[true, "Please specify the name of the recipie."]
    },
    description:{
        type:String,
        required:[true, "Please specify the description of the recipie."],
        maxlength:[200, "Description cannot be greater than 200 characters."]
    },
    ingredients:{
        type:String,
        required:[true, "Please specify the ingredients required for the recipie."],
        get:function(value){
            var ingredientsArray = value.split(",");
            ingredientsArray.map((item, index)=>{
                ingredientsArray[index] = item.trim();
            })
            return [ingredientsArray, value];
        }
    },
    category:{
        type:String,
        required:[true, "Please specify the category of the recipie."]
    },
    procedure:{
        type:String,
        required:[true, "Please specify the procedure for the recipie."],
        maxlength:[2500, "Procedure cannot be greater than 2500 characters."],
        get:function(value){
            var procedureArray = value.split(".");
            procedureArray.map((item, index)=>{
                procedureArray[index] = item.trim();
                if(procedureArray[index]==""){
                    procedureArray.splice(index,1);
                }
            })
            return [procedureArray, value];
        }
    },
    recipieImage:{
        type:Buffer,
        required:[true, "Please upload the image of the recipie"],
        //to convert buffer to base64
        get:function (value) {
            if(value)
            return value.toString('base64');
        }
    },
    uploadedBy:{
        type:String
    },
    timestamp:{
        type:Date,
        default:Date.now(),
        get:function(value){
            return [value.toString().slice(4,15), value];
        }
    },
    recipieComment:[{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}],
    ratings:{
        type:Array
    },
    avgrating :{
        type:Number
    }
});


recipieschema.statics.findRecipies = async function(options, limit, startIndex, sortoptions){
    try{
        const recipies = await this.find(options).limit(limit).skip(startIndex).sort(sortoptions);
        return recipies;
        
    }catch(err){
        console.log(err);
    }
}

//get recipie by id
recipieschema.statics.findRecipieById = async function(id){
    try{
        const recipie = await this.findById(id).populate({path:"recipieComment", populate:{path:"recipieComment"}});
        return recipie;
    }catch(err){
        console.log(err);
    }
}


//get recipe by recipe name
recipieschema.statics.findRecipeByName = async function(recipe, limit, startIndex){
    try{
        const recipies = await this.find({$or :[{recipie:new RegExp(recipe,"i")}, {ingredients:new RegExp(recipe,"i")}]}).limit(limit).skip(startIndex);
        return recipies;
    }catch(err){
        console.log(err);
    }
}

//get recipe by user name
recipieschema.statics.findRecipeByUsername = async function(username){
    try{
        const recipies = await this.find({uploadedBy:username});
        return recipies;
    }catch(err){
        console.log(err);
    }
}

//create recipie model
const Recipie = mongoose.model("Recipie", recipieschema);

module.exports=Recipie;