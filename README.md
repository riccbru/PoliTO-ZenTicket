[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Y8bW3OQP)
# Exam #1: "Ticketing System"
## Student: s323563 Riccardo Bruno

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- GET `/api/tickets`
  - No request parameters
  - Returns a list of Tickets in JSON format
- GET `/api/tickets/:tid`
  - Request parameters `tid` ("ticket id")
  - Returns Ticket with id = tid in JSON format
- POST `/api/tickets`
  - No request parameters
  - Request body: JSON with state, title, author_id, category, submission_time and content
  - Returns the new Ticket in JSON format
- GET `/api/tickets/open/:tid`
  - Request parameters: ticket id
  - Returns the Ticket in JSON format
- GET `/api/tickets/close/:tid`
  - Request parameters: ticket id
  - Returns the Ticket in JSON format 
- PUT `/api/tickets/:tid`
  - Request parameters tid in URL and JSON body with category key
  - Returns the new Ticket in JSON format
- DELETE `/api/tickets/:tid`
  - Request parameters tid in URL
  - Returns the number of DB changes (1 if deletion, else 0)
- GET `/api/blocks`
  - No request parameters
  - Returns a list of Blocks in JSON format
- GET `/api/blocks/:bid`
  - Request parameters `bid` ("block id")
  - Returns Ticket with id = bid in JSON format
- POST `/api/blocks`
  - Body request: JSON with ticket_id, author_id, creation_time, content
  - Returns the new Block in JSON format
- DELETE `/api/blocks/:bid`
  - Request parameters bid in URL
  - Returns the number of DB changes (1 if deletion, else 0)

## API Server2

- GET `/api/something`
  - request parameters
  - response body content


## Database Tables

- Table `users` - contains user_id, admin, username, hash, salt
- Table `tickets` - contains ticket_id, state, title, author_id (FK users.user_id), category, submission_time, content
- Table `blocks` - contains block_id, ticket_id (FK tickets), author_id (FK users.user_id), creation_time, content

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

- username, password (plus any other requested info which depends on the text)
- username, password (plus any other requested info which depends on the text)

