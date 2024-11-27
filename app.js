// bootstrap 4.6
const express = require('express');
const { engine } = require('express-handlebars');
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

app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
