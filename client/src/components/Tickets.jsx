import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Form, Table } from 'react-bootstrap';

function TicketsTable(props) {

    const navigate = useNavigate();

    const { admin, tickets, loggedIn } = props;

    return(
        <Table borderless className='ticket-table' hover>
            <thead>
                <tr>
                    <th className="text-center"><Button className='my-button' onClick={() => {if (loggedIn) {navigate("/add")} else {navigate("/login")}}}>&#43;</Button></th>
                    <th className="text-center">ID</th>
                    <th className="text-center">Status</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th className="text-center">Submission</th>
                    <th>ETA</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map(ticket => <TicketRow loggedIn={loggedIn}
                            uid={props.uid} admin={admin} user={props.user}
                            key={ticket.ticket_id} ticketData={ticket} addBlock={props.addBlock}
                            update={props.update} setUpdate={props.setUpdate}/>)}
            </tbody>
        </Table>
    );
}

function TicketRow(props) {
    // const navigate = useNavigate();
    const {loggedIn, uid, admin, user, ticketData, update, setUpdate} = props;
    const [id] = useState(ticketData.ticket_id);
    const [status, setStatus] = useState(ticketData.state);
    const [blocks, setBlocks] = useState([]);
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
        setUpdate(true);
    }, []);

    useEffect(() => {
        if (loggedIn && show && update) {
            api.getBlocks(id)
                .then(blocks => {
                    setBlocks(blocks);
                    setUpdate(false);
                })
                .catch(e => { console.log(e) });
        }
    }, [loggedIn, show, update]);

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
                <td>{!admin ? beautyCategory(ticketData.category) : <CategoryDropdown tid={id} category={ticketData.category} />}</td>
                <td className="text-center"><Button className='my-button-info'>{timeElapsed(ticketData.submission_time)}</Button></td>
                <td>TODO estimation</td>
            </tr>
            {show && loggedIn && <TicketContentRow uid={uid} user={user} tid={id} status={status} loggedIn={loggedIn}
                    key={ticketData.ticket_id}
                    ticket_title={ticketData.title} ticket_author={ticketData.ticket_author_username}
                    ticket_date={ticketData.submission_time} ticket_content={ticketData.content}
                    blocks={blocks} addBlock={props.addBlock}
                    update={update} setUpdate={setUpdate}/> }
        </>
    );
}

function CategoryDropdown({tid, category}) {
    const [currentCategory, setCurrentCategory] = useState(category);

    useEffect(() => {
        setCurrentCategory(category);
      }, [currentCategory]);

    const handleChange = (event) => {
        event.preventDefault();
        const newCategory = event.target.value;
        api.changeCategory(tid, newCategory)
            .then(() => {
                setCurrentCategory(newCategory);
            })
            .catch(err => console.log(err));
    }

    return(
        <Form.Select style={{width: '180px'}} className='my-button' title={currentCategory} onChange={handleChange}>
            <option value={currentCategory}>{currentCategory.toUpperCase()}</option>
            {['administrative', 'inquiry', 'maintenance', 'new feature', 'payment'].filter( c => currentCategory !== c).map(cat => <option value={cat}>{cat.toUpperCase()}</option>)}
        </Form.Select>
    );
}

function TicketContentRow(props) {

    const { uid, user, tid, status, ticket_title, ticket_author, ticket_date, ticket_content, blocks, addBlock, update, setUpdate } = props;
    
    const navigate = useNavigate();
    const formRef = useRef(null);
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

    useEffect(() => {
        setUpdate(true);
        
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const block = {
            "ticket_id": tid,
            "author_id": uid,
            "content": newblockcontent
        }
        addBlock(block);
        formRef.current.reset();
        setUpdate(false);
        // navigate("/");
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
                <td></td>
            </tr>
            {blocks.map((block, index) => (
                <tr key={index}>
                        <BlockContentRow author={block.author_username} date={block.creation_time} content={block.content} />
                </tr>
            ))}
            {(!status || (user === ticket_author && blocks.length === 0)) ? null
                : <tr>
                    <td></td>

                    <td colSpan={6}>
                        <Form ref={formRef} onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Control as='textarea' placeholder='Insert answer...' onChange={e => setNewBlockContent(e.target.value)} />
                            </Form.Group>
                        <Form.Group>
                            <div className='text-center mx-3 mt-3'>
                                <Button type='submit' className='my-button'>POST</Button>
                            </div>
                        </Form.Group>
                    </Form>
                </td>
                <td></td>
                </tr>
                }
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
                <td></td>
        </>
    );
}


export default TicketsTable;
