"use strict";

const db = require("./db");
const dayjs = require("dayjs");

const returnTicket = (ticket) => {
  const t = {};
  t.ticket_id = ticket.ticket_id;
  t.state = ticket.state;
  t.title = ticket.title;
  t.author_id = ticket.author_id;
  t.ticket_author_username = ticket.ticket_author_username;
  t.category = ticket.category;
  t.submission_time = ticket.submission_time;
  t.content = ticket.content;
  return t;
};

const returnBlock = (block) => {
  const b = {};
  b.block_id = block.block_id;
  b.ticket_id = block.ticket_id;
  b.author_id = block.author_id;
  b.author = block.block_author_username;
  b.creation_time = block.creation_time;
  b.content = block.content;

  return b;
};

/*** TICKETS ***/

exports.getTickets = (ticket_id) => {
  return new Promise((resolve, reject) => {
    if (!ticket_id) {
      const sql =
        "SELECT tickets.*, ticket_author.username AS ticket_author_username FROM tickets LEFT JOIN users AS ticket_author ON tickets.author_id = ticket_author.user_id ORDER BY tickets.submission_time DESC";
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        const tickets = rows.map((t) => returnTicket(t));
        resolve(tickets);
      });
    } else {
      const sql =
        "SELECT tickets.*, ticket_author.username AS ticket_author_username FROM tickets LEFT JOIN users AS ticket_author ON tickets.author_id = ticket_author.user_id WHERE tickets.ticket_id = ? ORDER BY tickets.submission_time DESC";
      db.all(sql, [ticket_id], (err, rows) => {
        if (err) reject(err);
        if (!rows.length) reject("Not Found");
        const tickets = rows.map((t) => returnTicket(t));
        resolve(tickets);
      });
    }
  });
};

exports.openTicket = (ticket_id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE tickets SET state = 1 WHERE ticket_id = ? AND state = 0";
    db.run(sql, [ticket_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(exports.getTickets(ticket_id));
      }
    });
  });
};

exports.closeTicket = (ticket_id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE tickets SET state = 0 WHERE ticket_id = ? AND state = 1";
    db.run(sql, [ticket_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(exports.getTickets(ticket_id));
      }
    });
  });
};

exports.changeCategory = (new_cat, ticket_id) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE tickets SET category = ? WHERE ticket_id = ?";
    db.run(sql, [new_cat, ticket_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(exports.getTickets());
      }
    });
  });
};

exports.deleteTicket = (ticket_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM tickets WHERE ticket_id = ?";
    db.run(sql, [ticket_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

exports.addTicket = (ticket) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO tickets (title, author_id, category, submission_time, content) VALUES (?, ?, ?, ?, ?)";
    db.run(
      sql,
      [
        ticket.title,
        ticket.author_id,
        ticket.category,
        ticket.submission_time,
        ticket.content,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(exports.getTickets(this.lastID));
        }
      }
    );
  });
};

/*** BLOCKS ***/

exports.getBlocks = (ticket_id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT blocks.*, block_author.username AS block_author_username FROM blocks LEFT JOIN users AS block_author ON blocks.author_id = block_author.user_id WHERE blocks.ticket_id = ? ORDER BY blocks.creation_time ASC";
    db.all(sql, [ticket_id], (err, rows) => {
      if (err) reject(err);
      const blocks = rows.map((b) => returnBlock(b));
      resolve(blocks);
    });
  });
};

exports.addBlock = (block) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT state FROM tickets WHERE ticket_id = ?",
      [block.ticket_id],
      (err, row) => {
        if (err) reject(err);
        if (!row) reject("Ticket not found");
        else if (row.state) {
          const sql =
            "INSERT INTO blocks (ticket_id, author_id, creation_time, content) VALUES (?, ?, ?, ?)";
          db.run(
            sql,
            [
              block.ticket_id,
              block.author_id,
              block.creation_time,
              block.content,
            ],
            function (err) {
              if (err) reject(err);
              resolve(exports.getBlocks(block.ticket_id));
            }
          );
        } else {
            reject("Ticket closed");
        }
      }
    );
  });
};

exports.deleteBlock = (block_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM blocks WHERE block_id = ?";
    db.run(sql, [block_id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};
