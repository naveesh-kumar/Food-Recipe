//include Recipie model
const Recipie = require('../model/recipieschema');

module.exports = async (req, res) => {
  //for the given id get the full recipie details from database
  const recipie = await Recipie.findRecipieById(req.query.id);
  var recipies = '';
  if (recipie) {
    //find all the recipies uploaded by the user
    recipies = await Recipie.findRecipeByUsername(recipie.uploadedBy);
  }
  if (req.query.loginerror) {
    return res.render('detailedRecipie', {
      recipie,
      recipies,
      warning: 'Please register/login to write comments',
    });
  }
  if (req.query.error) {
    return res.render('detailedRecipie', {
      recipie,
      recipies,
      warning: 'Please fill the comment',
    });
  }
  if (recipies) {
    return res.render('detailedRecipie', { recipies, recipie });
  }
};
