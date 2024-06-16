'use strict';

import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost';

const timeElapsed = (timestamp) => {
    // 'DD MMMM YYYY, HH:mm:ss'
    const now = dayjs().unix();
    const secElapsed = now - timestamp;

    const seconds = secElapsed % 60;
    const minutes = Math.floor((secElapsed % 3600) / 60);
    const hours = Math.floor((secElapsed % 86400) / 3600);
    const days = Math.floor(secElapsed / 86400);

    if (days > 0) {
        return `${days}d ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

function getJSON(httpResponsePromise) {
    return new Promise((resolve, reject) => {
        httpResponsePromise
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then(json => resolve(json))
                        .catch(err => reject({ error: `Cannot parse server response ok-catch` }))
                } else {
                    response.json()
                        .then(obj => reject(obj))
                        .catch(err => reject({ error: `Cannot parse server response !ok-catch` }))
                }
            })
            .catch(err =>
                reject({ error: `Cannot communicate (${err})` })
            )
    });
}

const getTickets = async (tid) => {
    return getJSON(fetch(SERVER_URL + '/api/tickets', {credentials: 'include'}))
        .then(tickets => {
            return tickets.map(t => {
                const ticket = {
                    ticket_id: t.ticket_id,
                    state: t.state,
                    title: t.title,
                    author_id: t.author_id,
                    ticket_author_username: t.ticket_author_username,
                    category: t.category,
                    submission_time: t.submission_time,
                    content: t.content
                }
                return ticket;
            })
    })
    .catch((err) => { console.log(err) });
}

function addTicket(ticket) {
    return getJSON(
        fetch(SERVER_URL + '/api/tickets', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(ticket)
        })
    );
}

function openTicket(tid) {
    return getJSON(
        fetch(SERVER_URL + `/api/tickets/open/${tid}`, {
            method: 'PATCH',
            credentials: 'include'
        })
    );
}

function closeTicket(tid) {
    return getJSON(
        fetch(SERVER_URL + `/api/tickets/close/${tid}`, {
            method: 'PATCH',
            credentials: 'include'
        })
    );
}

async function changeCategory(tid, newcat) {
    return getJSON(
        fetch(SERVER_URL + `/api/tickets/${tid}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"category": newcat})
        })
    );
}

function deleteTicket(tid) {
    return getJSON(
        fetch(SERVER_URL + `/api/tickets/${tid}`, {
            method: 'DELETE',
            credentials: 'include'
        })
    );
}

const getBlocks = async (tid) => {
    return getJSON(
        fetch(SERVER_URL + `/api/blocks/${tid}`, { credentials: 'include' })
    ).then(blocks => {
        return blocks.map(b => {
            const block = {
                block_id: b.block_id,
                ticket_id: b.ticket_id,
                author_id: b.author_id,
                author_username: b.author,
                creation_time: b.creation_time,
                content: b.content
            }
            return block;
        })
    })
    .catch((err) => { console.log(err) });
}

function addBlock(block) {
    return getJSON(
        fetch(SERVER_URL + '/api/blocks', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(block)
        })
    );
}

function deleteBlock(bid) {
    return getJSON(
        fetch(SERVER_URL + `/api/blocks/${bid}`, {
            method: 'DELETE',
            credentials: 'include'
        })
    );   
}

function getUser(uid) {
    return getJSON(
        fetch(SERVER_URL + `/api/users/${uid}`, {credentials: 'include'})
    ).then(res => {
        const user = {
            id: res.id,
            admin: res.admin,
            username: res.username
        }
        return user;
    })
    .catch(err => { console.log(err) });
}

async function login(credentials) {
    return getJSON(
        fetch(SERVER_URL + '/api/sessions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(credentials)
        })
    );
}

async function info() {
    return getJSON(
        fetch(SERVER_URL + '/api/sessions/current', { credentials: 'include' })
    );
}

const logout = async () => {
    return getJSON(
        fetch(SERVER_URL + '/api/sessions/current', {
            method: 'DELETE',
            credentials: 'include'
        })
    );
}

// const ticket = {
//     state: 0,
//     title: "title",
//     author_id: 1,
//     category: "inquiry",
//     content: "this is a test!\nquesta è una prova!\nproviamo?"
// }

// const block = {
//     ticket_id: 15,
//     author_id: 2,
//     content: "proviamo anche il blocco!let's try the block too!"
// }

// const result = await getTickets();
// const result = await getBlocks(3);
// const result = await getUser(1);
// console.log(result);

const api = { getTickets, addTicket, openTicket, closeTicket, changeCategory, deleteTicket, getBlocks, addBlock, deleteBlock, login, info, logout }
export default api;