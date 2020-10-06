const Recipie = require('../model/recipieschema');
const pagination = require('../pagination');
module.exports = async (req, res) => {
  if(!res.locals.authenticated) return res.render("home", {home:true, homewarning:"Invalid Request"});

  var { results, limit, startIndex } = await pagination(req, res);
  var allrecipiesoptions = { uploadedBy: res.locals.user.username };
  var sortingOptions = { timestamp: 1 };

  const recipies = await Recipie.findRecipies(
    allrecipiesoptions,
    limit,
    startIndex,
    sortingOptions
  );

  if (recipies) {
    results.recipies = recipies;
    return res.render('myrecipie', { results });
  }
};
