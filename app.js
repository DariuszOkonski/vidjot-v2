// bootstrap 4.6
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');

// db connection
mongoose.connect('mongodb://127.0.0.1:27017/vidjot-dev');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB connected...');
});
// ====================

const app = express();

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// hbs middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express session
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

//global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

// use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
