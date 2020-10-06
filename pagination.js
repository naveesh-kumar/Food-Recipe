const Recipie = require('./model/recipieschema');
const { User } = require('./model/userschema');

module.exports = async function (req, res) {
  //page number input
  var page = parseInt(req.query.page) || 1;
  var limit = 8;
  //find start and end index
  var startIndex = (page - 1) * limit;
  var lastIndex = page * limit;
  //create an object to store all the results
  var results = {};
  //if start index is greater than 0 show previous page
  if (startIndex > 0) {
    results.previous = {
      prev: page - 1,
    };
  }
  //
  var count = await Recipie.countDocuments({});
  //
  //find the count depending on the request
  if (req.params.category) {
    var categoryoptions = { category: req.params.category };
    if (req.session.user) {
      categoryoptions = {
        $and: [
          { category: req.params.category },
          { uploadedBy: req.session.user },
        ],
      };
    }
    count = await Recipie.countDocuments(categoryoptions);
  }

  if (req.query.recipe) {
    var recipe = req.query.recipe;
    count = await Recipie.countDocuments({
      $or: [
        { recipie: new RegExp(recipe, 'i') },
        { ingredients: new RegExp(recipe, 'i') },
      ],
    });
  }

  if (req.originalUrl == '/myrecipes') {
    count = await Recipie.countDocuments({
      uploadedBy: res.locals.user.username,
    });
  }

  if (req.session.user) {
    count = await Recipie.countDocuments({ uploadedBy: req.session.user });
  } 
    

  //if last index less than count show the next page
  if (lastIndex < count) {
    results.next = {
      next: page + 1,
    };
  }

  //find all users
  try {
    const users = await User.find().sort('username');
    results.users = users;
  } catch (err) {
    console.log(err);
  }

  //total no. of pages
  results.totalpage = [];
  for (var i = 1; i <= Math.ceil(count / limit); i++) {
    results.totalpage.push(i);
  }

  //include current page number
  results.page = page;

  //include user
  results.filter = req.session.user;

  return { results, limit, startIndex };
};
