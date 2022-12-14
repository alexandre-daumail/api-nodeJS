const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = db.users;
const Operator = db.Sequelize.Op;
dotenv.config();

// Create and Save a new User
exports.register = (req, res) => {
  User.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      groupId: req.body.groupId,
      password: req.body.password
    }
  })
    .then(data => {
      res.status(201).send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error occured while creating the User"
      });
    });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (user) {
    const password_valid = await bcrypt.compare(req.body.password, user.password);
    if (password_valid) {
      token = jwt.sign({ "id": user.id, "email": user.email, "first_name": user.first_name }, process.env.SECRET);
      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({ token: token });
    } else {
      res.status(400).json({ error: "Password Incorrect" });
    }
  } else {
    res.status(404).json({ error: "User does not exist" });
  }
}

exports.profile = async (req, res, next) => {
  try {
    let token = req.headers['cookie'].split("=")[1];
    let decoded = jwt.verify(token, process.env.SECRET);
    let user = await User.findOne({
      where: { id: decoded.id },
      attributes: [
        "email",
        "firstname",
        "lastname",
        "groupId"
      ]      
    });
    if (user === null) {
      res.status(404).json({ 'msg': "User not found" });
    }
    res.status(200).json(user);
    next();
  } catch (err) {
    res.status(401).json({ "msg": "Couldnt Authenticate" });
  }
}

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email ? { email: { [Operator.like]: `%${email}%` } } : null;

  User.findAll({
    where: condition,
    attributes: ['firstname', 'lastname']
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating User with id=${id}`
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Could not delete Tutorial with id=${id}`
      });
    });
};

// Delete all USers from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Users."
      });
    });
};