const Recipie = require("../model/recipieschema");

module.exports = async (req, res) => {

    if (!res.locals.authenticated) return res.render("home", { home: true, homewarning: "Invalid request" });

    var section = req.query.section;
    var id = req.query.id;
    var value = req.body[section];
    if(section=="recipieImage")
    var imageValue = req.file.buffer;

    if (value || imageValue) {

        var sectionObj = {};
        sectionObj[section] = value;
        if(imageValue) 
        sectionObj[section] = imageValue;

        //for the given id find and update
        const updatedRecipe = await Recipie.findByIdAndUpdate(id, sectionObj, { new: true });
        if (updatedRecipe) {
            return res.render("update", { recipeSection: value, section, id, success: "Successfully updated" });
        } 
    }
    return res.render("update", { recipeSection: value, section, id, warning: "Failed to update" });
}