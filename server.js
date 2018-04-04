const express = require('express');
const bodyParser = require('body-parser');
const db = require('./data/db.js');
// const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('./users/userRouter.js');

const server = express();

// custom middleware
function logger(req, res, next) {
  // next points to the next middware
  console.log(`Requesting: ${req.url}`);
  //res.send('done');

  next();
}

server.use(logger);
// server.use(morgan('dev'));
server.use(helmet());
server.use(cors());
server.use(bodyParser.json());

server.use('/api/users', userRouter);

server.get('/', function(req, res) {
  res.send({
    api: 'Running...'
  });
});

const port = 5000;

server.listen(port, () => console.log('API listening on port 5000'));
