module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Retrieve all Users
  router.get("/", users.findAll);

  router.get("/profile", users.profile)

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // Delete all Users
  router.delete("/", users.deleteAll);

  app.use('/api/users', router);
};