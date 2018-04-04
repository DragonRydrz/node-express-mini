const express = require('express');

const router = express.Router();

const db = require('../data/db.js');

router.post('/', (req, res) => {
  console.log(req.body);
  const { name, bio } = req.body;
  const newUser = {
    name,
    bio
  };

  if (!name || !bio) {
    res.status(400).json({
      error: 'Name and Bio are required.'
    });
  }

  db
    .insert(newUser)
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/', (req, res) => {
  db
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/:id', (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  db
    .findById(id)
    .then(user => {
      res.json(user[0]);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db
    .findById(id)
    .then(user => {
      const deletedUser = user;
      db
        .remove(id)
        .then(user => {
          res.json(deletedUser[0]);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  const user = {
    name,
    bio
  };

  db
    .update(id, user)
    .then(count => {
      if (count > 0) {
        db
          .findById(id)
          .then(user => {
            res.json(user[0]);
          })
          .catch(error => {
            res.status(500).json(error);
          });
      } else {
        res.status(404).json({
          message: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
