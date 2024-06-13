'use strict';

const db = require('./db');
const crypto = require('crypto');

exports.getUser = (uid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE user_id = ?';
        db.get(sql, [uid], (err, row) => {
            if (err) reject(err);
            if (row === undefined) {
                resolve({error: 'User not found'});
            } else {
                const user = {
                    id: row.user_id,
                    admin: row.admin,
                    username: row.username
                }
                resolve(user);
            }
        });
    });
}

exports.checkUser = (uname, passwd) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [uname], (err, row) => {
            if (err) { 
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                const user = {
                    id: row.user_id,
                    admin: row.admin,
                    username: row.username
                }
                crypto.scrypt(passwd, row.salt, 32, function (err, hash) {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hash)) {
                        resolve(false);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    });
}