import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../api';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TicketsTable(props) {

    const navigate = useNavigate();

    const { admin, tickets, loggedIn } = props;

    return(
        <Table borderless className='ticket-table' hover>
            <thead>
                <tr>
                    <th className="text-center">{props.loggedIn ? <><Button className='my-button' onClick={() => navigate("/add")}>&#43;</Button></> : null}</th>
                    <th className="text-center">ID</th>
                    <th className="text-center">Status</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th className="text-center">Submission</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map(ticket => <TicketRow uid={props.uid} admin={props.admin} user={props.user} loggedIn={loggedIn} key={ticket.ticket_id} ticketData={ticket} addBlock={props.addBlock}/>)}
            </tbody>
        </Table>
    );
}

function TicketRow(props) {
    const navigate = useNavigate();
    const {uid, admin, loggedIn, ticketData} = props;
    const [id] = useState(ticketData.ticket_id);
    const [status, setStatus] = useState(ticketData.state);
    const[blocks, setBlocks] = useState([]);
    const [show, setShow] = useState(false);

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

    const beautyCategory = (cat) => {
        // return `${cat.charAt(0).toUpperCase() + cat.slice(1)}`; (Inquiry)
        return `${cat.toUpperCase()}`;
    }

    const beautyName = (username) => {
        const words = username.split('_');
        const name = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        const surname = words[1].charAt(0).toUpperCase() + words[1].slice(1);
        return `${name} ${surname}`;
    }

    const beautyDate = (date) => {
        const sub_date = dayjs.unix(date).format('on D MMMM YYYY [at] HH:mm:ss');
        return sub_date;
    }

    const handleClick = () => {
        setShow(!show);
    }

    const changeState = (event) => {
        event.stopPropagation();
        if (status) {
            api.closeTicket(id)
                .then(result => { setStatus(result[0].state); })
                .catch();

        } else {
            api.openTicket(id)
                .then(result => { setStatus(result[0].state); })
                .catch();
        }
    }

    useEffect(() => {
        if (loggedIn && show) {
            api.getBlocks(id)
                .then(blocks => {
                    setBlocks(blocks);
                })
                .catch(e => { console.log(e) });
        }
    }, [loggedIn, show, id]);

    return(
        <>
            <tr className='clickable-row' onClick={handleClick}>
                <td className="text-center">{(admin || (ticketData.author_id === uid && status)) ? <Button variant='warning' style={{color: '#fefeff'}} onClick={changeState}>{status ? <b>CLOSE</b> : <b>OPEN</b>}</Button> : null}</td>
                <td className="text-center">
                    <Button className='my-button'>{'#' + id}</Button>
                </td>
                <td className="text-center">
                    {status ?
                    <Badge bg="danger">OPEN</Badge>
                    : <Badge bg="success">CLOSED</Badge>}
                </td>
                <td><b>{ticketData.title}</b></td>
                <td>{ticketData.ticket_author_username && beautyName(ticketData.ticket_author_username)}</td>
                <td>{beautyCategory(ticketData.category)}</td>
                <td className="text-center"><Button className='my-button-info'>{timeElapsed(ticketData.submission_time)}</Button></td>
            </tr>
            {show && loggedIn && <TicketContentRow uid={uid} tid={id} status={status} loggedIn={loggedIn}
                    ticket_title={ticketData.title} ticket_author={ticketData.ticket_author_username}
                    ticket_date={ticketData.submission_time} ticket_content={ticketData.content}
                    blocks={blocks} addBlock={props.addBlock}/> }
        </>
    );
}

function TicketContentRow(props) {

    const { uid, tid, status, ticket_title, ticket_author, ticket_date, ticket_content, blocks } = props;
    const [newblockcontent, setNewBlockContent] = useState(null);

    const beautyAuthor = (author) => {
        const words = author.split('_');
        const name = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        const surname = words[1].charAt(0).toUpperCase() + words[1].slice(1);
        return `${name} ${surname}`;
    }

    const beautyDate = (date) => {
        const sub_date = dayjs.unix(date).format('on D MMMM YYYY [at] HH:mm:ss');
        return sub_date;
    }

    const handleClick = (event) => {
        event.preventDefault();
        console.log('works!');
        console.log(`TICKET_ID (key) = ${tid}`);
        const block = {
            "ticket_id": tid,
            "author_id": uid,
            "content": newblockcontent
        }
        props.addBlock(block);
        console.log(block);

    }

    return(
        <>
            <tr>
                <td></td>
                <td colSpan={2}>
                    <Card border='info' style={{ color: '#fefeff', backgroundColor: '#143859' }}>
                        <Card.Body>{ticket_author && beautyAuthor(ticket_author)}</Card.Body>
                        <Card.Body style={{color: '#6c757d'}}>{ticket_date && beautyDate(ticket_date)}</Card.Body>
                    </Card>
                </td>
                <td colSpan={4} className='ticket-content'>
                    <Card border='info' style={{ color: '#fefeff', backgroundColor: '#143859' }}>
                        <Card.Title className='mx-3 mt-3'><b>{ticket_title}</b></Card.Title>
                        <Card.Body>{ticket_content}</Card.Body>
                    </Card>
                </td>
            </tr>
            {blocks.map((block, index) => (
                <tr key={index}>
                        <BlockContentRow author={block.author_username} date={block.creation_time} content={block.content} />
                </tr>
            ))}
            {!status ? null
                : <tr>
                    <td></td>
                    <td colspan={6}>
                        <Form>
                            <Form.Group>
                                <Form.Control as='textarea' placeholder='Insert answer...' onChange={e => setNewBlockContent(e.target.value)} />
                            </Form.Group>
                            <Form.Group>
                                <div className='text-end'>
                                    <Button className='my-button' onClick={handleClick}>POST</Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </td>
                </tr>}
        </>
    );
}

function BlockContentRow({ author, date, content }) {

    const beautyAuthor = (author) => {
        const words = author.split('_');
        const name = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        const surname = words[1].charAt(0).toUpperCase() + words[1].slice(1);
        return `${name} ${surname}`;
    }

    const beautyDate = (date) => {
        const sub_date = dayjs.unix(date).format('on D MMMM YYYY [at] HH:mm:ss');
        return sub_date;
    }

    return(
        <>
                <td></td>
                <td colSpan={2}>
                    <Card border='dark' style={{ color: '#fefeff', backgroundColor: '#002c49' }}>
                        <Card.Body>{author && beautyAuthor(author)}</Card.Body>
                        <Card.Body style={{color: '#6c757d'}}>{date && beautyDate(date)}</Card.Body>
                    </Card>
                </td>
                <td colSpan={4} className='ticket-content'>
                    <Card border='dark' style={{ color: '#fefeff', backgroundColor: '#002c49' }}>
                        <Card.Body>{content}</Card.Body>
                    </Card>
                </td>
        </>
    );
}


export default TicketsTable;
