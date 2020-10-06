//include Comment model
const Comment = require("../model/commentschema");
const Recipie = require("../model/recipieschema");

module.exports = async (req, res)=>{
    //check if the user seeing the webpage is logged in
    if(!res.locals.authenticated){
        return res.redirect('/recipie?id='+req.query.id + '&loginerror=true');
    }
    if(!req.body.comment){
        return res.redirect('/recipie?id='+req.query.id + '&error=true');
    }
    
    //create a comment document and save it in db
    const comment = new Comment({
        commentBody:req.body.comment,
        commentedBy:res.locals.user
    })
    //save the comment in the database
    const commentDoc = await comment.save();
    //check if the comment is saved in database if so update the recipie schema
    if(commentDoc){
        //update recipieComment in recipieschema
        const updatedRecipie = await Recipie.findByIdAndUpdate(req.query.id, {$push :{recipieComment:commentDoc._id}}, {new:true});
        if(updatedRecipie)
        return res.redirect('/recipie?id='+req.query.id);
    }
}