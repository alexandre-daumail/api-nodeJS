const db = require('../models');
const Group = db.groups;
const User = db.users;

// Create and Save a new Group
exports.create = (req, res) => {
  // Save Group in the database
  Group.create(req.body.name)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error occured while creating the Group"
      });
    });

};

// Retrieve all Groups from the database.
exports.findAllGroups = (req, res) => {
  Group.findAll({
    attributes: ["name"]
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

// List Groups with users collections
exports.findAllGroupsUsers = (req, res) => {
  Group.findAll({
    attributes: ["name"],
    include: {
      model: User,
      attributes: [
        "firstname",
        "lastname"
      ]
    }
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

// Find a single Group with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Group.findByPk(id, { include: ["users"] })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Group with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving Group with id=${id}.`
      });
    });
};

// Update a Group by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Group.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Group was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Group with id=${id}. Maybe Group was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Group with id=${id}`
      });
    });
};

// Delete a Group with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Group.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Group was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Group with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Could not delete Tutorial with id=${id}`
      });
    });
};

// Delete all Groups from the database.
exports.deleteAll = (req, res) => {
  Group.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Groups were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Groups."
      });
    });
};

// Get the users for a given group
exports.findTutorialById = (tutorialId) => {
  return Tutorial.findByPk(tutorialId, { include: ["comments"] })
    .then((tutorial) => {
      return tutorial;
    })
    .catch((err) => {
      console.log(">> Error while finding tutorial: ", err);
    });
};