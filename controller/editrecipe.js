const Recipie = require("../model/recipieschema");

module.exports = async (req, res)=>{
    if(!res.locals.authenticated) return res.render("home", {home:true, homewarning:"Invalid Request"});

    const id = req.query.id;
    const section = req.query.section;
    //for the given id collect all the recipe information from database
    const recipe = await Recipie.findById(id).select(section);
    if(recipe){
        var recipeSection = recipe[section];
        if(section=="ingredients" || section == "procedure"){
            recipeSection = recipe[section][1];
        }
        res.render("update", {recipeSection, section, id});
    }

}