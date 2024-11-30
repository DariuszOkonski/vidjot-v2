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

require('./models/Idea');
const Idea = mongoose.model('ideas');

const app = express();

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

app.get('/ideas', (req, res) => {
  Idea.find({})
    .lean()
    .sort({ date: 'desc' })
    .then((ideas) => {
      res.render('ideas/index', { ideas: ideas });
    });
});

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({ _id: req.params.id })
    .lean()
    .then((idea) => {
      res.render('ideas/edit', { idea });
    });
});

app.post('/ideas', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    };
    new Idea(newUser).save().then((idea) => {
      req.flash('success_msg', 'Video Idea added');
      res.redirect(`/ideas`);
    });
  }
});

app.put('/ideas/:id', (req, res) => {
  Idea.findOne({ _id: req.params.id }).then((idea) => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then((idea) => {
      req.flash('success_msg', 'Video idea updated');
      res.redirect('/ideas');
    });
  });
});

app.delete('/ideas/:id', (req, res) => {
  Idea.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Video Idea removed');
    res.redirect('/ideas');
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
