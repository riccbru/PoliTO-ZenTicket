import dayjs from 'dayjs';
import {useState} from 'react';
import {Alert, Button, Form, Modal, Table} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TicketAdd(props) {

    const navigate = useNavigate();

    const [uid, setUID] = useState(props.uid);
    const [title, setTitle] = useState('');
    const [errMex, setErrMex] = useState('');
    const [modal, setModal] = useState(false);
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const beautyName = (uname) => {
        if (uname) {
          const words = uname.split('_');
          const name = words[0].charAt(0).toUpperCase() + words[0].slice(1);
          const surname = words[1].charAt(0).toUpperCase() + words[1].slice(1);
          return `${name} ${surname}`;
        } else { return null; }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!category || category === 'Category') {
            setErrMex('Choose category');
        } else if (!title) {
            setErrMex('Title is empty');
        } else if (!content) {
            setErrMex('Content is empty');
        } else if (title.length > 90) {
            setErrMex('Title is too long');
        } else if (content.length < 10) {
            setErrMex('Content is too short');
        } else if (content.length > 240) {
            setErrMex('Content is too long');
        } else {
            setModal(true);
        }
    } 

    const handleConfirm = () => {
        const ticket = {
            "author_id": uid,
            "title": title,
            "category": category,
            "content": content,
        }
        props.addTicket(ticket);
        console.log(ticket);
        // navigate("/");
    }

    const handleCancel = () => {
        setModal(false);
    }
    return(
        <>
        <h3 style={{color: '#fefeff'}}>ADD TICKET</h3>
        <p></p>
        {errMex ? <Alert variant='danger' dismissible onClose={() => setErrMex('')}>{errMex}</Alert> : null}
        <Form onSubmit={handleSubmit}>
        <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select style={{width: '200px'}} onChange={e => setCategory(e.target.value)}>
                    <option value='category'>Category</option>
                    <option value='administrative'>Administrative</option>
                    <option value='inquiry'>Inquiry</option>
                    <option value='maintenance'>Maintenance</option>
                    <option value='new feature'>New Feature</option>
                    <option value='payment'>Payment</option>
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control style={{width: '669px'}} type='title' placeholder='Title'
                            onChange={e => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Ticket Content</Form.Label>
                <Form.Control as='textarea' className='add-content' style={{width: '800px'}}
                            type='text' placeholder='Ticket Content' onChange={e => setContent(e.target.value)} />
            </Form.Group>
                <div className='d-flex justify-content-begin'>
                    <Button className='my-button mt-3' type='submit'>ADD TICKET</Button>
                </div>
                <Button className='mt-3' variant='danger' onClick={() => navigate("/")}>CANCEL</Button>
        </Form>

            <Modal show={modal} onHide={handleCancel} backdrop='static' keyboard={false}>
                <Modal.Header style={{color: '#fefeff', backgroundColor: '#002c49'}}>
                    <Modal.Title>Confirm Ticket Info</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{color: '#fefeff', backgroundColor: '#143859'}}>

                    <Table borderless>
                        <thead><tr><th>Category:</th></tr></thead>
                        <tbody><tr><td>{category}</td></tr></tbody>
                    </Table>
                    <Table borderless>
                        <thead><tr><th>Title:</th></tr></thead>
                        <tbody><tr><td>{title}</td></tr></tbody>
                    </Table>
                    <Table borderless>
                        <thead><tr><th>Content:</th></tr></thead>
                        <tbody><tr><td style={{wordBreak: 'break-word'}}>{content}</td></tr></tbody>
                    </Table>
                    <Table borderless>
                        <thead><tr><th>From user:</th></tr></thead>
                        <tbody><tr><td>{beautyName(props.user)}</td></tr></tbody>
                    </Table>
                    <Table borderless>
                        <thead><tr><th>ETA</th></tr></thead>
                        <tbody><tr><td>estimation</td></tr></tbody>
                    </Table>
                    
                </Modal.Body>
                <Modal.Footer style={{ color: '#fefeff', backgroundColor: '#002c49' }}>
                    <Button className='my-button' onClick={handleConfirm}>CONFIRM</Button>
                    <Button variant='danger' onClick={handleCancel}>CANCEL</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { TicketAdd };