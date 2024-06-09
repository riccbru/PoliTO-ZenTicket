'use strict';

const cors = require('cors');
const morgan = require('morgan'); 
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const { check, validationResult, oneOf } = require('express-validator');

const userDao = require('./dao-users');
const ticketDao = require('./dao-tickets');

const port = 80;
const maxTitleLength = 30;
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

// init express
const app = new express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
// app.use(passport.authenticate('session'));

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

// activate the server
app.listen(port, 
  () => {
      console.log(`\x1b[42m[*]\x1b[0m \x1b[92mListening on port ${port}\x1b[0m (http://localhost:${port}/api)`);
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
      "<p><a href='/api/tickets'>APIs</p>" +
      "</div>" +
      "</body>" +
      "</html>"
    res.send(text)
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
    check('submission_time').isLength({ min: 10, max: 10 }),
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
      submission_time: req.body.submission_time,
      content: req.body.content
    }
    try {
      const result = await ticketDao.addTicket(ticket);
      res.json(result);
    } catch (err) {
      res.status(503).json({error: `${err}`});
    }
});

app.get('/api/tickets/open/:tid',
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

app.get('/api/tickets/close/:tid',
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
    check('category').isLength({ min: 1, max: 12 })
  ], async (req, res) => {
    const result = await ticketDao.changeCategory(req.body.category, req.params.tid);
    if (result.error)
      return res.status(404).json(result.error);
    return res.json(result);
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

app.get('/api/blocks/:bid',
[check('bid').isInt({min: 1})],
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
    check('creation_time').isLength({ min: 10, max: 10 }),
    check('content').isLength({ min: 10, max: 240 })
  ], async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }
    const block = {
      ticket_id: req.body.ticket_id,
      author_id: req.body.author_id,
      creation_time: req.body.creation_time,
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
      const changes = await ticketDao.deleteBlock(req.params.tid);
      res.status(200).json(changes);
    } catch (err) {
      res.status(503).json({ error: `${err}` });
    }
});