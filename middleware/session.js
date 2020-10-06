module.exports = (req, res, next) => {
  if (req.query.user) {
    req.session.user = req.query.user;
    req.session.save();
  }

  if (req.query.sort) {
    req.session.sort = req.query.sort;
  }


  if (req.query.alluser) {
    req.session.user = null;
    req.session.sort =null;

  }
  next();
};
