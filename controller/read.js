const Recipie = require('../model/recipieschema');
const pagination = require('../pagination');
module.exports = async (req, res) => {
  //check if there are any parameters in request
  const category = req.params.category;
  
  //pagination
  var { results, limit, startIndex } = await pagination(req, res);

  //sorting if requested
  var sortingOptions = {};
  if(req.session.sort == 'rating'){
    sortingOptions = {'avgrating':-1}
  }

  if(req.session.sort == 'recent'){
      sortingOptions = {'timestamp':-1}
    }
  
  if (category) {
    //find recipies that are related to the category
    var categoryOptions = { category: req.params.category };
    if (req.session.user) {
      categoryOptions = {
        $and: [
          { category: req.params.category },
          { uploadedBy: req.session.user },
        ],
      };
    }
    const recipies = await Recipie.findRecipies(
      categoryOptions,
      limit,
      startIndex,
      sortingOptions
    );
    if (recipies) {
      results.recipies = recipies;
      res.render('read', { results, read: true, category: category });
    }
    return;
  }
  //find recipies by name
  if (req.query.recipe) {
    //find recipie by name
    const recipies = await Recipie.findRecipeByName(
      req.query.recipe,
      limit,
      startIndex
    );
    if (recipies.length > 0) {
      results.recipies = recipies;
      return res.render('read', { results, read: true, allrecipies: true });
    }
    return res.render('read', {
      warning: 'No recipies related to your search',
      read: true,
    });
  }

  //find all the recipies in the database
  var allrecipiesoptions = {};
  if (req.session.user) {
    allrecipiesoptions = { uploadedBy: req.session.user };
  }
  const recipies = await Recipie.findRecipies(
    allrecipiesoptions,
    limit,
    startIndex,
    sortingOptions
  );

  if (recipies) {
    results.recipies = recipies;
    res.render('read', { results, allrecipies: true });
  }
};
