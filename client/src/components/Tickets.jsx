import api from '../api';
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, Form, ProgressBar, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';

function TicketsTable(props) {

    const navigate = useNavigate();

    const { admin, tickets, loggedIn, stats } = props;

    return(
        <Table borderless className='ticket-table' hover>
            <thead>
                <tr>
                    <th className="text-center">
                        <OverlayTrigger placement='top' overlay={<Tooltip id='add'>Add new ticket</Tooltip>}>
                            <Button style={{width: '80px'}} className='my-button' onClick={() => {loggedIn ? navigate('/add') : navigate('/login')}}>
                                <b style={{fontSize: '20px'}}>&#43;</b>
                            </Button>
                        </OverlayTrigger>
                    </th>
                    <th className="text-center"><h4><b>ID</b></h4></th>
                    <th className="text-center"><h4><b>STATUS</b></h4></th>
                    <th colSpan={2}><h4><b>TITLE</b></h4></th>
                    <th><h4><b>AUTHOR</b></h4></th>
                    <OverlayTrigger placement='top' overlay={<Tooltip id='TIME-th'>Time elapsed since ticket submission</Tooltip>}><th className="text-center"><h4><b>TIME</b></h4></th></OverlayTrigger>
                    <th colSpan={2} className="text-center"><h4><b>CATEGORY</b></h4></th>
                    {!admin ? null : <OverlayTrigger placement='top' overlay={<Tooltip id='ETA-th'>Estimated Time of Completion</Tooltip>}><th className="text-center"><h4><b>ETC</b></h4></th></OverlayTrigger>}
                </tr>
            </thead>
            <tbody>
                {tickets.map((ticket, index) => <TicketRow key={index} loggedIn={loggedIn}
                            uid={props.uid} admin={admin} user={props.user}
                            ticketData={ticket} setTickets={props.setTickets}
                            stat={stats[index]} setStats={props.setStats} refresh={props.refresh}
                            addBlock={props.addBlock}
                            update={props.update} setUpdate={props.setUpdate}/>)}
            </tbody>
        </Table>
    );
}

function TicketRow(props) {

    const {loggedIn, uid, admin, user, ticketData, stat, update, setUpdate} = props;
    const id = ticketData.ticket_id
    const [show, setShow] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const status = ticketData.state;

    const timeElapsed = (timestamp) => {
        // 'DD MMMM YYYY, HH:mm:ss'
        const now = dayjs().unix();
        const secElapsed = now - timestamp;
    
        const seconds = secElapsed % 60;
        const minutes = Math.floor((secElapsed % 3600) / 60);
        const hours = Math.floor((secElapsed % 86400) / 3600);
        const days = Math.floor(secElapsed / 86400);

        let out = '';
        if (days > 0) {
            out = `${days}d ${hours}h`;
        } else if (hours > 0) {
            out = `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            out = `${minutes}m ${seconds}s`;
        } else {
            out = `${seconds}s`;
        }
        return out;
    }

    const beautyCategory = (cat) => {
        return `${cat.toUpperCase()}`;
    }

    const beautyName = (uname) => {
        if (uname) {
            let out = '';
            const words = uname.split('_');
            words.map(e => {
                out += e.charAt(0).toUpperCase() + e.slice(1) + ' ';
            })
            return out;
        } else { return null; }
    }

    const handleClick = (event) => {
        event.stopPropagation();
        setShow(!show);
    }

    const changeState = (event) => {
        event.stopPropagation();
        setShow(true);
        if (status) {
            api.closeTicket(id)
                .then(result => {
                    props.setTickets((prev) => {
                        return prev.map((ticket) => {
                            if (ticket.ticket_id === id) {
                                return {...ticket, state: result[0].state};
                            }
                            return ticket;
                        });
                    });
                })
                .catch();

        } else {
            api.openTicket(id)
                .then(result => {
                    props.setTickets((prev) => {
                        return prev.map((ticket) => {
                            if (ticket.ticket_id === id) {
                                return {...ticket, state: result[0].state};
                            }
                            return ticket;
                        });
                    });
                })
                .catch();
        }
    }

    const pgvalue = (eta) => {
      const days = parseInt(eta.substring(0, eta.indexOf("d")));
      const hours = parseInt(
        eta.substring(eta.indexOf("d") + 2, eta.indexOf("h"))
      );
      const tot = 24 * days + hours;
      const elapsed = dayjs().unix() - ticketData.submission_time;
      const diff = Math.floor(elapsed / 3600);
      if (diff < tot) {
        return (diff / tot) * 100;
      } else {
        return 101;
      }
    };

    const variantFun = (eta) => {
      const pg = pgvalue(eta);
      let out = "";
      if (status) { pg < 100 ? out = 'warning' : out = 'danger' }
      else { out = "success"; }
      return out;
    };

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
                <td className="text-center">
                    {(admin || (status && ticketData.author_id === uid)) ?
                        <OverlayTrigger placement='bottom' overlay={<Tooltip id="checkbox-tooltip">{status ? 'Close ticket' : 'Re-open ticket'}</Tooltip>}>
                            <Form.Check style={{fontSize: '20px'}} className='mt-2' checked={!status} onChange={changeState}></Form.Check>
                        </OverlayTrigger>
                        : null}
                </td>
                <td className="text-center">
                    <Button style={{width: '70px', fontSize: '18px'}} className='my-button'><b>{'#' + id}</b></Button>
                </td>
                <td className="text-center">
                    {status ?
                    <b style={{color: '#ffc108'}}><h5>OPEN</h5></b>
                    : <b style={{color: '#808080'}}><h5>CLOSED</h5></b>}
                </td>
                <td colSpan={2}><b>{ticketData.title}</b></td>
                <td>{ticketData.ticket_author_username && beautyName(ticketData.ticket_author_username)}</td>
                <td className="text-center"><Button className='my-button-info'><b>{timeElapsed(ticketData.submission_time)}</b></Button></td>
                <td colSpan={2} className="text-center">
                    {!admin ? beautyCategory(ticketData.category)
                    : <CategoryDropdown tid={id} show={show} setShow={setShow} setTickets={props.setTickets} title={ticketData.title} category={ticketData.category} refresh={props.refresh}/>}
                </td>
                {!admin ? null
                : <td className='text-center'>{admin && status ? <Badge pill style={{fontSize: '17px'}} variant='info'>{stat?.estimation}</Badge> : null}
                {admin && status ?
                    <OverlayTrigger placement='bottom' overlay={<Tooltip id='progressbar'>{pgvalue(String(stat?.estimation)) < 100 ? Math.round(pgvalue(String(stat?.estimation))) + '%' : 'ETA delayed'}</Tooltip>}>
                        <ProgressBar animated variant={variantFun(String(stat?.estimation))} className='mt-2' now={status ? pgvalue(String(stat?.estimation)) : 100} />
                    </OverlayTrigger>
                : null}
                </td>} 
                {!admin ? <td></td> : null}
            </tr>
            {show && loggedIn && <TicketContentRow uid={uid} user={user} tid={id} status={status} loggedIn={loggedIn}
                    key={ticketData.ticket_id}
                    ticket_title={ticketData.title} ticket_author={ticketData.ticket_author_username}
                    ticket_date={ticketData.submission_time} ticket_content={ticketData.content}
                    blocks={blocks} addBlock={props.addBlock}
                    setUpdate={setUpdate}/>}
        </>
    );
}

function CategoryDropdown({ tid, setShow, category, refresh }) {

    const [currentCategory, setCurrentCategory] = useState(category);

    useEffect(() => {
        setCurrentCategory(category);
        setShow(false);
    }, [currentCategory]);

    const handleChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const newCategory = event.target.value;
        api.changeCategory(tid, newCategory)
            .then(() => {
                setShow(false);
                setCurrentCategory(newCategory);
                refresh();
            })
            .catch(err => console.log(err));
    }

    return(
        <OverlayTrigger placement='bottom' overlay={<Tooltip id='category'>Category change dropdown</Tooltip>}>
            <Form.Select style={{width: '230px'}} className='my-button text-center' title={currentCategory} onChange={handleChange}>
            <option key={1} value={currentCategory}>{currentCategory.toUpperCase()}</option>
            {['administrative', 'inquiry', 'maintenance', 'new feature', 'payment'].filter( c => currentCategory !== c).map((cat, index) => <option key={index} value={cat}>{cat.toUpperCase()}</option>)}
        </Form.Select>
        </OverlayTrigger>
    );
}

function TicketContentRow(props) {

    const { uid, tid, status, ticket_title, ticket_author, ticket_date, ticket_content, blocks, addBlock, setUpdate } = props;
    
    const formRef = useRef(null);
    const [errMex, setErrMex] = useState('');
    const [newblockcontent, setNewBlockContent] = useState(null);

    const beautyAuthor = (uname) => {
        if (uname) {
            let out = '';
            const words = uname.split('_');
            words.map(e => {
                out += e.charAt(0).toUpperCase() + e.slice(1) + ' ';
            })
            return out;
        } else { return null; }
    }

    const beautyDate = (date) => {
        const sub_date = dayjs.unix(date).format('dddd DD MMMM YYYY, HH:mm:ss');
        return sub_date;
    }

    useEffect(() => {
        setUpdate(true);
        
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!newblockcontent) {
            setErrMex('Answer cannot be empty...');
        } else if (newblockcontent.length < 1) {
            setErrMex('Answer is too short (min 1 char)');
        } else if (newblockcontent.length > 240){
            setErrMex('Answer is too long (max 240 chars)');
        } else {
            const block = {
                "ticket_id": tid,
                "author_id": uid,
                "content": newblockcontent
            }
            addBlock(block);
            formRef.current.reset();
            setUpdate(false);
        }
    }

    return(
        <>
            <tr>
                <td></td>
                <td colSpan={2}>
                    <Card border='info' style={{ color: '#fefeff', backgroundColor: '#143859' }}>
                        <Card.Body><b>{ticket_author && beautyAuthor(ticket_author)}</b></Card.Body>
                        <Card.Body style={{color: '#6c757d'}}><b>{ticket_date && beautyDate(ticket_date)}</b></Card.Body>
                    </Card>
                </td>
                <td colSpan={6} className='ticket-content'>
                    <Card border='info' style={{ color: '#fefeff', backgroundColor: '#143859' }}>
                        <Card.Title className='mx-3 mt-3'><b>{ticket_title}</b></Card.Title>
                        <Card.Body>{ticket_content?.split('\n').map((e, index) => (
                            <React.Fragment key={index}>
                                {e}<br />
                            </React.Fragment>
                        ))}</Card.Body>
                    </Card>
                </td>
                <td></td>
            </tr>
            {blocks.map((block, index) => (
                <tr key={index}>
                        <BlockContentRow author={block.author_username} date={block.creation_time} content={block.content} />
                </tr>
            ))}
            {(!status) ? null
                : <tr>
                    <td colSpan={3}></td>
                    <td colSpan={6}>
                        <Form ref={formRef} onSubmit={handleSubmit}>
                        {errMex ? <Alert variant='danger'>{errMex}</Alert> : null}
                            <Form.Group>
                                <Form.Floating className='mb-3'>
                                <Form.Control id='floatingAnswer' as='textarea' placeholder='Insert answer...' onChange={e => {setNewBlockContent(e.target.value); setErrMex('');}} />
                                    <label style={{color: '#808080'}} htmlFor='floatingAnswer'>Insert answer...</label>
                                </Form.Floating>
                            </Form.Group>
                        <Form.Group>
                            <div className='text-center mx-3 mt-3'>
                                <Button type='submit' style={{width: '100px', backgroundColor: '#7f4af6'}}><b>POST</b></Button>
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

    const beautyAuthor = (uname) => {
        if (uname) {
            let out = '';
            const words = uname.split('_');
            words.map(e => {
                out += e.charAt(0).toUpperCase() + e.slice(1) + ' ';
            })
            return out;
        } else { return null; }
    }

    const beautyDate = (date) => {
        const sub_date = dayjs.unix(date).format('dddd DD MMMM YYYY, HH:mm:ss');
        return sub_date;
    }

    return(
        <>
                <td></td>
                <td colSpan={2}>
                    <Card style={{ color: '#fefeff', border: '#002c49', backgroundColor: '#002c49' }}>
                        <Card.Body><b>{author && beautyAuthor(author)}</b></Card.Body>
                        <Card.Body style={{color: '#6c757d'}}><b>{date && beautyDate(date)}</b></Card.Body>
                    </Card>
                </td>
                <td colSpan={6} className='ticket-content'>
                    <Card style={{ color: '#fefeff', border: '#002c49', backgroundColor: '#002c49' }}>
                        <Card.Body>
                        {content?.split('\n').map((e, index) => (
                            <React.Fragment key={index}>
                                {e}<br />
                            </React.Fragment>
                        ))}
                        </Card.Body>
                    </Card>
                </td>
                <td></td>
        </>
    );
}


export default TicketsTable;
