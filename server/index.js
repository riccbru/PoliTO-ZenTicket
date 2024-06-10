'use strict';

const cors = require('cors');
const dayjs = require('dayjs');
const morgan = require('morgan'); 
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const { check, validationResult, oneOf } = require('express-validator');

const userDao = require('./dao-users');
const ticketDao = require('./dao-tickets');

const app = new express();

const port = 80;
const maxTitleLength = 30;
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
const sessionOptions = {
  secret: "shhhhh... it's a secret! - change it for the exam!",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: app.get('env') === 'production' ? true : false },
};

// INIT express
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(passport.authenticate('session'));

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
  return res.status(401).json({error: 'Not authorized'});
  }
}

// activate the server
app.listen(port, 
  () => {
      console.log(`\x1b[42m[*]\x1b[0m \x1b[92mListening on port ${port}\x1b[0m (http://localhost:${port}/api)`);
});

/****************/
/*** passport ***/
/****************/

passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.checkUser(username, password);
  if (!user) {
    return callback(null, false, 'Incorrect username or password');
  } else {
    return callback(null, user);
  }
}));

passport.serializeUser(function (user, callback) {
  callback(null, user);
});

passport.deserializeUser(function (user, callback) {
  return callback(null, user);
});

/********************/
/*** Tickets APIs ***/
/********************/

app.get('/', 
  (req, res) => {
    const text = "<html>" +
      "<head>" +
      "<style>" +
      ".center {" +
      "  text-align: center;" + 
      "}" +
      "</style>" +
      "</head>" +
      "<body>" +
      "<div class='center'>" +
      "<p><a href='/api'>APIs</p>" +
      "</div>" +
      "</body>" +
      "</html>"
    res.send(text)
});

app.get('/api',
  (req, res) => {
    const text = "<html>" +
    "<head>" +
    "<style>" +
    ".center {" +
    "  text-align: center;" + 
    "}" +
    "</style>" +
    "</head>" +
    "<body>" +
    "<div class='center'>" +
    "<p><a href='/api/tickets'>/api/tickets</p>" +
    "<p><a href='/api/blocks'>/api/blocks</p>" +
    "</div>" +
    "</body>" +
    "</html>"
    res.send(text);
});

app.get('/api/tickets', 
  (req, res) => {
    ticketDao.getAllTickets()
      .then(tickets => res.json(tickets))
      .catch((err) => res.status(500).json(err));
});

app.get('/api/tickets/:tid',
[check('tid').isInt({min: 1})],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors );
    }
    try {
      const result = await ticketDao.getTicket(req.params.tid);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).send();
    }
});

app.post('/api/tickets',
  [
    check('state').isBoolean(),
    check('title').isLength({ min: 1, max: maxTitleLength }),
    check('author_id').isInt({ min: 1 }),
    check('category').isLength({ min: 1, max: 12 }),
    check('content').isLength({ min: 10, max: 240 })
  ], async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }
    const ticket = {
      state: req.body.state,
      title: req.body.title,
      author_id: req.body.author_id,
      category: req.body.category,
      submission_time: dayjs().unix(),
      content: req.body.content
    }
    try {
      const result = await ticketDao.addTicket(ticket);
      res.json(result);
    } catch (err) {
      res.status(503).json({error: `${err}`});
    }
});

app.put('/api/tickets/open/:tid',
  [check('tid').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }
    try {
      const result = await ticketDao.openTicket(req.params.tid);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).send();
    }
});

app.put('/api/tickets/close/:tid',
  [check('tid').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }
    try {
      const result = await ticketDao.closeTicket(req.params.tid);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).send();
    }
});

app.put('/api/tickets/:tid',
  [
    check('tid').isInt({ min: 1 }),
    check('category').isIn(['administrative', 'inquiry', 'maintenance', 'new feature', 'payment'])
  ], async (req, res) => {
    const result = await ticketDao.changeCategory(req.body.category, req.params.tid);
    if (result.error) {
      return res.status(404).json(result.error);
    } else {
      return res.json(result);
    }
});

app.delete('/api/tickets/:tid',
  [check('tid').isInt({ min: 1 })],
  async (req, res) => {
    try {
      const changes = await ticketDao.deleteTicket(req.params.tid);
      res.status(200).json(changes);
    } catch (err) {
      res.status(503).json({ error: `${err}` });
    }
});

app.get('/api/blocks',
  (req, res) => {
    ticketDao.getAllBlocks()
      .then(blocks => res.json(blocks))
      .catch((err) => res.status(500).json(err))
  }
);

app.get('/api/blocks/:tid',
[check('tid').isInt({min: 1})],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors );
    }
    try {
      const result = await ticketDao.getBlocks(req.params.tid);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).send();
    }
});

app.post('/api/blocks',
  [
    check('ticket_id').isInt({ min: 1 }),
    check('author_id').isInt({ min: 1 }),
    check('content').isLength({ min: 10, max: 240 })
  ], async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }
    const block = {
      ticket_id: req.body.ticket_id,
      author_id: req.body.author_id,
      creation_time: dayjs().unix(),
      content: req.body.content
    }
    try {
      const result = await ticketDao.addBlock(block);
      res.json(result);
    } catch (err) {
      return res.status(503).json({ error: `${err}` });
    }
});

app.delete('/api/blocks/:bid',
  [check('bid').isInt({ min: 1 })],
  async (req, res) => {
    try {
      const changes = await ticketDao.deleteBlock(req.params.bid);
      res.status(200).json(changes);
    } catch (err) {
      res.status(503).json({ error: `${err}` });
    }
});

/******************/
/*** Users APIs ***/
/******************/

app.post('/api/sessions',
  function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          return res.status(401).json({ error: info});
        }
        req.login(user, (err) => {
          if (err)
            return next(err);
          return res.json(req.user);
        });
    })(req, res, next);
});

app.get('/api/sessions/current',
  (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    } else {
      res.status(401).json({ error: 'No active session' });
    }
});

app.delete('/api/sessions/current',
  (req, res) => {
    req.logout(() => {
      res.status(200).json({});
    });
});