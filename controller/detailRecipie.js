//include Recipie model
const Recipie = require('../model/recipieschema');

module.exports = async (req, res) => {
  //for the given id get the full recipie details from database
  const recipie = await Recipie.findRecipieById(req.query.id);
 
  var ratingCount={};
  var onestar = 0;
  var twostar = 0;
  var threestar = 0;
  var fourstar = 0;
  var fivestar = 0;

  var recipies = '';
  if (recipie) {
    //find all the recipies uploaded by the user
    recipies = await Recipie.findRecipeByUsername(recipie.uploadedBy);
    //for the given recipe id find the number of ratings
    var ratings = recipie['ratings'];
    if (ratings) {
      ratings.forEach((item) => {
        switch (item['rating']) {
          case 1:
            onestar++;
            break;
          case 2:
            twostar++;
            break;
          case 3:
            threestar++;
            break;
          case 4:
            fourstar++;
            break;
          case 5:
            fivestar++;
            break;
        }
      });
      ratingCount = {onestar, twostar, threestar, fourstar, fivestar};
    }
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
    return res.render('detailedRecipie', { recipies, recipie, ratingCount});
  }
};
