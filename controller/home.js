const Recipie = require("../model/recipieschema")

module.exports = async (req, res) =>{

    const toprecipies = await Recipie.find().limit(3).sort({'avgrating':-1});
    toprecipie1 = toprecipies[0];
    toprecipie2 = toprecipies[1];
    toprecipie3 = toprecipies[2];
    return res.render("home", {home:true, toprecipie1, toprecipie2, toprecipie3});
}