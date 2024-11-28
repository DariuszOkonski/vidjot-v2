// bootstrap 4.6
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
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
app.use(methodOverride('_method'));

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
      res.redirect(`/ideas`);
    });
  }
});

app.put('/ideas/:id', (req, res) => {
  Idea.findOne({ _id: req.params.id }).then((idea) => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then((idea) => {
      res.redirect('/ideas');
    });
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
