const express = require('express');
const bodyParser = require('body-parser');
const db = require('./data/db.js');
const morgan = require('morgan');
const helmet = require('helmet');

const server = express();

server.use(morgan('dev'));
server.use(helmet());
server.use(bodyParser.json());

const port = 5000;

server.get('/', function(req, res) {
  res.send({
    api: 'Running...'
  });
});

// const newUser = {
//   name: 'AJ',
//   bio: 'G'
// };

server.post('/api/users', (req, res) => {
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

server.get('/api/users', (req, res) => {
  db
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/users/:id', (req, res) => {
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

server.delete('/api/users/:id', (req, res) => {
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

server.put('/api/users/:id', (req, res) => {
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
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.listen(port, () => console.log('API listening on port 5000'));
