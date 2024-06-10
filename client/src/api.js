'use strict';

import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost';

function getJSON(httpResponsePromise) {
    return new Promise((resolve, reject) => {
        httpResponsePromise
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then(json => resolve(json))
                        .catch(err => reject({ error: `Cannot parse server response (${response.ok}, ok-catch)` }))
                } else {
                    response.json()
                        .then(obj => reject(obj))
                        .catch(err => reject({ error: `Cannot parse server response (${response.ok}), !ok-catch` }))
                }
            })
            .catch(err =>
                reject({ error: `Cannot communicate (${err})` })
            )
    });
}

// When fetching a ticket by ID:
//      TypeError: tickets.map is not a function
async function getTickets(tid) {
    return getJSON(tid ?
        fetch(SERVER_URL + `/api/tickets/${tid}`)
        : fetch(SERVER_URL + '/api/tickets')
    ).then(tickets => {
        return tickets.map(t => {
            const ticket = {
                ticket_id: t.ticket_id,
                state: t.state,
                title: t.title,
                author_id: t.author_id,
                category: t.category,
                submission_time: dayjs.unix(t.submission_time).format('DD MMMM YYYY, HH:mm:ss'),
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(ticket)
        })
    );
}

function openTicket(tid) {
    return getJSON(
        fetch(SERVER_URL + `/api/tickets/open/${tid}`, {
            method: 'PUT'
        })
    );
}

function closeTicket(tid) {
    return getJSON(
        fetch(SERVER_URL + `/api/tickets/close/${tid}`, {
            method: 'PUT'
        })
    );
}

async function changeCategory(tid, newcat) {
    return getJSON(
        fetch(SERVER_URL + `/api/tickets/${tid}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"category": newcat})
        })
    );
}

function deleteTicket(tid) {
    return getJSON(
        fetch(SERVER_URL + `/api/tickets/${tid}`, {
            method: 'DELETE'
        })
    );
}

async function getBlocks (tid) {
    return getJSON(tid ?
        fetch(SERVER_URL + `/api/blocks/${tid}`)
        : fetch(SERVER_URL + '/api/blocks')
    ).then(blocks => {
        return blocks.map(b => {
            const block = {
                block_id: b.block_id,
                ticket_id: b.ticket_id,
                author_id: b.author_id,
                creation_time: dayjs.unix(b.creation_time).format('DD MMMM YYYY, HH:mm:ss'),
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(block)
        })
    );
}

function deleteBlock(bid) {
    return getJSON(
        fetch(SERVER_URL + `/api/blocks/${bid}`, {
            method: 'DELETE'
        })
    );   
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
        fetch(SERVER_URL + '/api/sessions/current', {
            credentials: 'include'
        })
    );
}

async function logout() {
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

// const result = await getTickets(6);
// console.log(result);

const api = { getTickets, addTicket, openTicket, closeTicket, changeCategory, deleteTicket, getBlocks, addBlock, deleteBlock, login, info, logout }
export default api;