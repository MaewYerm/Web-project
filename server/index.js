const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session
app.use(session({
  secret: 'beef-secret',
  resave: false,
  saveUninitialized: false
}));

// static files
app.use(express.static(path.resolve(__dirname, 'static')));

// view engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

// routes
app.use('/user', require('./routes/user'));
app.use('/beef', require('./routes/beef'));
app.use('/storage', require('./routes/storage'));
app.use('/audit', require('./routes/audit'));

// pages
app.get('/', (req, res) => {
  res.render('login');
});

// auth
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

app.get('/dashboard-staff', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.render('dashboard-staff');
});

// start server
app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on http://localhost:3000');
});
