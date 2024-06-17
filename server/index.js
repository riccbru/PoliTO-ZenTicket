'use strict';

const cors = require('cors');
const dayjs = require('dayjs');
const morgan = require('morgan'); 
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const jsonwebtoken = require('jsonwebtoken');
const LocalStrategy = require('passport-local');
const { check, validationResult, oneOf } = require('express-validator');

const userDao = require('./dao-users');
const ticketDao = require('./dao-tickets');

const app = new express();

const port = 3001;
const expireTime = 10;
const maxTitleLength = 30;
const jwtSecret = 'qTX6walIEr47p7iXtTgLxDTXJRZYDC9egFjGLIn0rRiahB4T24T4d5f59CtyQmH8';
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
const sessionOptions = {
  secret: "WEBAPP24{mys3cr3t!!}",
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

const isAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  } else {
    return res.status(503).json({error: "Forbidden"});
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

app.get('/api/tickets/',
  (req, res) => {
    ticketDao.getTickets(req.params.tid)
      .then(tickets => {
        if (req.isAuthenticated()) {
          res.json(tickets);
        } else {
          const allowed = tickets.map(({ content, ...rest }) => rest);
          res.json(allowed);
        }
      })
      .catch((err) => res.status(500).json(err));
});

app.get('/api/tickets/:tid',
  [check('tid').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }
    try {
      const result = await ticketDao.getTickets(req.params.tid);
      if (result.error) { res.status(404).json(result); }
      if (!req.isAuthenticated()) {
        const allowed = result.map(({ content, ...rest }) => rest);
        res.json(allowed);
      } else {
        const rendered = result.map(t => {
          t.content.replce(/\n/g, '<br>');
        });
        res.json(rendered);
      }
    } catch (err) {
      res.status(500).send({error: err});
    }
});

app.post('/api/tickets', isLoggedIn,
  [
    check('title').isLength({ min: 1, max: maxTitleLength }),
    check('author_id').isInt({ min: 1 }),
    check('category').isIn(['administrative', 'inquiry', 'maintenance', 'new feature', 'payment']),
    check('content').isLength({ min: 10, max: 240 })
  ], async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }
    const bodyID = req.body.author_id;
    const uid = req.user.id;
    if (bodyID === uid) {
      const ticket = {
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
        res.status(503).json({ error: err });
      }
    } else {
      res.status(403).json({error: "Forbidden"});
    }
});

app.patch('/api/tickets/open/:tid', isAdmin,
  [check('tid').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }
    if (req.user.admin) {
      try {
        const result = await ticketDao.openTicket(req.params.tid);
        if (result.error)
          res.status(404).json(result);
        else
          res.json(result);
      } catch (err) {
        res.status(500).send();
      }
    } else {
      res.status(403).json({error: "Forbidden"});
    }
});

app.patch('/api/tickets/close/:tid', isLoggedIn,
  [check('tid').isInt({ min: 1 })],
  async (req, res) => {

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }
    ticketDao.getTickets(req.params.tid)
      .then(tickets => {
        const authorID = tickets[0].author_id;
        if (req.user.admin || req.user.id === authorID) {
          ticketDao.closeTicket(req.params.tid)
            .then(result => {res.json(result)})
            .catch((err) => res.status(500).json(err));
        } else {
          res.status(401).json({ error: "Unauthorized" });
        }
      })
      .catch((err) => res.status(500).json(err));
});

app.patch('/api/tickets/:tid', isAdmin,
  [
    check('tid').isInt({ min: 1 }),
    check('category').isIn(['administrative', 'inquiry', 'maintenance', 'new feature', 'payment'])
  ], async (req, res) => {
    if (req.user.admin) {
      const result = await ticketDao.changeCategory(req.body.category, req.params.tid);
      if (result.error) {
        return res.status(404).json(result.error);
      } else {
        return res.json(result);
      }
    } else {
      res.status(403).json({error: "Forbidden"});
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

app.get('/api/blocks/:tid', isLoggedIn,
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
      else {
        // if (req.isAuthenticated()) {
          res.json(result);
        // } else { res.status(401).json({error: 'Not authorized'}) }
      }
        // res.json(result);
    } catch (err) {
      res.status(500).send();
    }
});

app.post('/api/blocks', isLoggedIn,
  [
    check('ticket_id').isInt({ min: 1 }),
    check('author_id').isInt({ min: 1 }),
    check('content').isLength({ min: 10, max: 240 })
  ], async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors);
    }

    if (req.body.author_id === req.user.id) {
      // console.log(req.body.ticket_id);
      const result = await ticketDao.getTickets(req.body.tid);
      if (result.length === 0) {console.log("captured");}
      // console.log(result);
  
      if (result.error) { res.status(404).json(result); }

      const block = {
        ticket_id: req.body.ticket_id,
        author_id: req.body.author_id,
        creation_time: dayjs().unix(),
        content: req.body.content
      }
      // console.log(block);
      try {
        const result = await ticketDao.addBlock(block);
        res.json(result);
      } catch (err) {
        return res.status(503).json({ error: `${err}` });
      }
    } else {return res.status(403).json({error: "Forbidden"})}
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
/*** AuthN APIs ***/
/******************/

// app.get('/api/users/:uid',
//   [check('uid').isInt({ min: 1 })],
//   async (req, res) => {
//     const errors = validationResult(req).formatWith(errorFormatter);
//     if (!errors.isEmpty()) {
//       return res.status(422).json( errors.errors );
//     }
//     try {
//       const result = await userDao.getUser(req.params.uid);
//       if (result.error) {
//         res.status(404).json(result);
//       } else {
//         res.json(result);
//       }
//     } catch (err) {
//       res.status(500).send();
//     }
// });

app.post('/api/sessions',
  function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
      if (!user) {
        return res.status(401).json({ error: info });
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

/******************/
/*** TOKEN APIs ***/
/******************/

app.get('/api/auth-token', isLoggedIn,
  (req, res) => {
    const authLevel = req.user.admin;

    const payloadToSign = { access: authLevel, userID: req.user.id };
    const jwtToken = jsonwebtoken.sign(payloadToSign, jwtSecret, { expiresIn: expireTime });

    res.json({
      authLevel: authLevel,
      token: jwtToken,
    });
});