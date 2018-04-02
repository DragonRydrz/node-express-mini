const express = require('express');
const bodyParser = require('body-parser');
const db = require('./data/db.js');

const server = express();

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
  const user = req.body;
  // if (!user.name || user.bio) {
  //   res.status(400).json({ error: 'Name and Bio are required.' });
  // }
  db
    .insert(user)
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
    .remove(id)
    .then(user => {
      res.json(user[0]);
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
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.listen(port, () => console.log('API listening on port 5000'));
