const User = require('../models/user.model');

exports.getUsers = (req, res) => {
  res.json(User.getAll());
};

exports.createUser = (req, res) => {
  User.create(req.body);
  res.status(201).json({ message: 'User added' });
};
