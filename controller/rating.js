const Recipie = require('../model/recipieschema');

module.exports = async (req, res) => {
  //check if the user seeing the webpage is logged in
  if (!res.locals.authenticated) {
    return res.redirect(
      301,
      '/recipie?id=' + req.query.id + '&loginerror=true'
    );
  }
  var setRecipie = '';
  var updatedRecipie = '';
  var rating = parseInt(req.body.rating);
  //upload the ratings to the recipie schema
  try {
    setRecipie = await Recipie.findOneAndUpdate(
      { _id: req.query.id, 'ratings.userId': res.locals.user._id },
      { $set: { 'ratings.$.rating': rating } },
      { new: true }
    );

    if (!setRecipie) {
      updatedRecipie = await Recipie.findOneAndUpdate(
        { _id: req.query.id },
        { $push: { ratings: { userId: res.locals.user._id, rating: rating } } },
        { new: true }
      );
    }

    if (updatedRecipie || setRecipie) {
      const avgratingupdate = await Recipie.aggregate([
        {$set : {avgrating : {$avg : '$ratings.rating'}}}
      ])
      if(avgratingupdate)
      avgratingupdate.forEach(async (item)=>{
        if(item._id == req.query.id){
          const average = parseFloat(item.avgrating);
          const finalAverageUpdate = await Recipie.findOneAndUpdate(
            { _id: req.query.id },
            { $set: { 'avgrating': average } },
          )
        }
      })
      return res.redirect('/recipie?id=' + req.query.id);
    }
  } catch (err) {
    console.log(err);
  }
};
