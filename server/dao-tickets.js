'use strict';

const db = require('./db');
const dayjs = require('dayjs');

const returnTicket = (ticket) => {
    const t = {};
    t.ticket_id = ticket.ticket_id;
    t.state = ticket.state;
    t.title = ticket.title;
    t.author_id = ticket.author_id;
    t.category = ticket.category;
    t.submission_time = ticket.submission_time;
    t.content = ticket.content;
    return t;
}

const returnBlock = (block) => {
    const b = {};
    b.block_id = block.block_id;
    b.ticket_id = block.ticket_id;
    b.author_id = block.author_id;
    b.creation_time = block.creation_time;
    b.content = block.content;
    return b;
}

exports.getAllTickets = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tickets';
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            const tickets = rows.map(t => returnTicket(t));
            resolve(tickets); 
        });
    });
}

exports.getTicket = (ticket_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tickets WHERE ticket_id = ?';
        db.get(sql, [ticket_id], (err, row) => {
            if (err) reject(err);
            if (row == undefined) {
                resolve({error: 'Ticket not found'});
            } else {
                resolve(returnTicket(row));
            }
        });
    });
}

exports.openTicket = (ticket_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tickets SET state = 1 WHERE ticket_id = ? AND state = 0';
        db.run(sql, [ticket_id], function (err) {
            if (err) { reject(err); }
            else {
                resolve(exports.getTicket(ticket_id));
            }
        });
    });
}

exports.closeTicket = (ticket_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tickets SET state = 0 WHERE ticket_id = ? AND state = 1';
        db.run(sql, [ticket_id], function (err) {
            if (err) { reject(err); }
            else {
                resolve(exports.getTicket(ticket_id));
            }
        });
    });
}

exports.changeCategory = (new_cat, ticket_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tickets SET category = ? WHERE ticket_id = ?';
        db.run(sql, [new_cat, ticket_id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(exports.getTicket(ticket_id));
            }
        });
    });
}

exports.deleteTicket = (ticket_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM tickets WHERE ticket_id = ?';
        db.run(sql, [ticket_id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

exports.addTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tickets (state, title, author_id, category, submission_time, content) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(sql, [ticket.state, ticket.title, ticket.author_id, ticket.category, ticket.submission_time, ticket.content],
            function (err) {
                if (err) { reject(err); }
                else {
                    resolve(exports.getTicket(this.lastID));
                }
            });
    });
}

exports.getAllBlocks = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM blocks';
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            const blocks = rows.map(b => returnBlock(b));
            resolve(blocks);
        });
    });
}

exports.getBlocks = (ticket_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM blocks WHERE ticket_id = ?';
        db.all(sql, [ticket_id], (err, rows) => {
            if (err) reject(err);
            const blocks = rows.map(b => returnBlock(b));
            resolve(blocks); 
        });
    });
}

exports.addBlock = (block) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO blocks (ticket_id, author_id, creation_time, content) VALUES (?, ?, ?, ?)';
        db.run(sql, [block.ticket_id, block.author_id, block.creation_time, block.content],
            function (err) {
                if (err) reject(err);
                resolve(exports.getBlocks(block.ticket_id));
            });
    });
}

exports.deleteBlock = (block_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM blocks WHERE block_id = ?';
        db.run(sql, [block_id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

