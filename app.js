// include core/3rd party/custom modules into the app.js
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const home = require('./controller/home');
const recipieRouter = require('./routes/recipie');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const session = require("express-session");
const authentication = require('./middleware/authentication')

//initiate express
const app = express();
const PORT = process.env.PORT;

//connect to mongo db
mongoose.connect(
  process.env.DB_CONNECT_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err)
      return console.log(
        "Couldn't connect to the express-mongoose database",
        err
      );
    console.log('Connected to express-mongoose database');
  }
);

//creating your own handlebars
const myHbs = exphbs.create({
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    equal: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    notequal: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.inverse(this) : options.fn(this);
    },
  },
});
//configure exphbs
app.engine('hbs', myHbs.engine);
//set view engine
app.set('view engine', 'hbs');

//get the inputs in the json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//use cookie parser
app.use(cookieParser());
//use static files
app.use(express.static('public'));
//register partials
hbs.registerPartials(__dirname + '/views/partials');
app.use(session({
  secret:process.env.SESSIONSECRETKEY,
  resave:false,
  saveUninitialized:false,
}));

app.use(userRouter);
app.use(recipieRouter);

app.get('/', (req,res,next)=>{
  req.session.user=null;
  req.session.sort =null;
  next();
},authentication,home);

//listen to the port
app.listen(PORT, (err) => {
  if (err) return console.log(`couldn't connect to the PORT ${PORT}`);
  console.log(`Connected to the localhost PORT ${PORT}`);
});
