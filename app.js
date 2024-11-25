const express = require('express');
const { engine } = require('express-handlebars');

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

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
