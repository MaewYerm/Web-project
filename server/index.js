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
app.use('/setting', require('./routes/setting'));
app.use('/api/setting', require('./routes/setting'));
app.use('/api/user', require('./routes/user'));
app.use('/api/storage', require('./routes/storage'));
app.use('/api/beef-type', require('./routes/beef-type'))
app.use('/api/grade', require('./routes/grade'))
app.use('/api/beef', require('./routes/beef'))
app.use('/api/stock', require('./routes/stock'))
app.use('/api/audit', require('./routes/audit'));


// pages
app.get('/', (req, res) => {
  res.render('login', {
    query: req.query
  });
});

// auth
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

const settingController = require('./controllers/setting.controller');

app.get('/dashboard', requireLogin, (req, res) => {
  settingController.getUsers((err, users) => {
    if (err) {
      console.error(err);
      users = [];
    }

    res.render('dashboard', {
      user: req.session.user,
      users
    });
  });
});



// start server
app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on http://localhost:3000');
});
