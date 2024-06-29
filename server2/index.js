"use strict";

const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const { expressjwt: jwt } = require("express-jwt");
const { body, validationResult } = require("express-validator");

const app = new express();

const port = 3002;
const jwtSecret = "qTX6walIEr47p7iXtTgLxDTXJRZYDC9egFjGLIn0rRiahB4T24T4d5f59CtyQmH8";
const jwtOptions = {
  secret: jwtSecret,
  algorithms: ["HS256"],
};
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));
app.use(jwt(jwtOptions));

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
        errors: [
          { param: "Server", msg: "Authorization error", path: err.code },
        ],
      });
  } else {
    next();
  }
});

app.listen(port,
  () => {
  console.log(
    `\x1b[42m[*]\x1b[0m \x1b[92mListening on port ${port}\x1b[0m (http://localhost:${port}/api)`
  );
});

/***************/
/** FUNCTIONS **/
/***************/

function len(text) {
  const mod = Array.from(text).filter((c) => c !== " " || c !== "\n");
  return mod.length;
}

function getRandom(min, max) {
  const random = Math.random();
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random * (max - min + 1)) + min;
}

function getEstimation(title, category) {
  const t = len(title);
  const c = len(category);
  const sum = t + c;
  const random = getRandom(10, 240);
  return 10 * sum + random;
}

function getStats(tickets, bool) {
  const stats = [];
  for (const t of tickets) {
    const stat = {};
    if (t.ticket_id) {
      stat.ticket_id = t.ticket_id;
    }
    const estimation = getEstimation(t.title, t.category);
    const days = estimation / 24;
    if (t.state) {
      if (bool) {
        const hours = estimation % 24;
        stat.estimation = `${Math.floor(days)}d ${hours}h`;
      } else {
        stat.estimation = `${Math.round(days)}d`;
      }
    } else { stat.estimation = '0'; }
    stats.push(stat);
  }
  return stats;
}

app.post('/api/tickets-stats',
  (req, res) => {
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      errList.push(...err.errors.map((e) => e.msg));
      return res.status(400).json({ errors: errList });
    }

    const isAdmin = req.auth.access;
    const tickets = req.body.tickets;

    const stats = getStats(tickets, isAdmin);

    res.status(200).json(stats);
  }
);
