'use strict';

const SERVER_URL = 'http://localhost:3001';

function getJSON(httpResponsePromise) {
    return new Promise((resolve, reject) => {
        httpResponsePromise
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then(json => resolve(json))
                        .catch(err => reject({ error: `Cannot parse server response ok-catch:\n${err}` }))
                } else {
                    response.json()
                        .then(obj => reject(obj))
                        .catch(err => reject({ error: `Cannot parse server response !ok-catch:\n${err}` }))
                }
            })
            .catch(err =>
                reject({ error: `Cannot communicate (${err})` })
            )
    });
}

const getTickets = async () => {
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
    .catch((err) => { throw err; });
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

const logout = async () => {
    return getJSON(
        fetch(SERVER_URL + '/api/sessions/current', {
            method: 'DELETE',
            credentials: 'include'
        })
    );
}

async function getAuthToken() {
    return getJSON(
        fetch(SERVER_URL + '/api/auth-token', {
            credentials: 'include'
        })
    );
}

function getStats(authToken, tickets) {
    return getJSON(
        fetch(`http://localhost:3002/api/tickets-stats`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"tickets": tickets})
        })
    );
}

const api = {
    getTickets, addTicket, openTicket, closeTicket, changeCategory, deleteTicket,
    getBlocks, addBlock, deleteBlock,
    login, info, logout, getAuthToken, getStats
}

export default api;