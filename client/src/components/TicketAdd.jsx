import api from '../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';

function TicketAdd(props) {

    const navigate = useNavigate();

    const [uid, setUID] = useState(props.uid);
    const [title, setTitle] = useState('');
    const [errMex, setErrMex] = useState('');
    const [modal, setModal] = useState(false);
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [estimation, setEstimation] = useState([]);

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
        if (!category || category === 'category') {
            setErrMex('Choose category');
        } else if (!title) {
            setErrMex('Title is empty');
        } else if (!content) {
            setErrMex('Content is empty');
        } else if (title.length > 60) {
            setErrMex('Title is too long');
        } else if (content.length < 1) {
            setErrMex('Content is too short');
        } else if (content.length > 240) {
            setErrMex('Content is too long');
        } else {
            setModal(true);
            const input = [{"title": title, "category": category, "state": 1}];
            api.getStats(props.authToken, input)
                .then(res => {
                    setEstimation(res[0].estimation);
                })
                .catch(err => {
                    api.getAuthToken()
                        .then(t => {
                            api.getStats(t.token, input)
                                .then(r => {
                                    setEstimation(r[0].estimation);
                                })
                                .catch(() => {});
                        })
                        .catch(() => {});
                });
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
    }

    const handleCancel = () => {
        setModal(false);
    }
    
    return(
        <>
        <h3 style={{color: '#fefeff'}}>ADD NEW TICKET</h3>
        <p></p>
        {errMex ? <Alert variant='danger' onClose={() => setErrMex('')}>{errMex}</Alert> : null}
        <Form onSubmit={handleSubmit}>
        <Form.Group>
                <Form.Label className='mt-3' style={{color: '#fefeff'}}>CATEGORY</Form.Label>
                <Form.Select style={{width: '200px'}} onChange={e => { setCategory(e.target.value); setErrMex(''); }}>
                    <option value='category'>Category</option>
                    <option value='administrative'>Administrative</option>
                    <option value='inquiry'>Inquiry</option>
                    <option value='maintenance'>Maintenance</option>
                    <option value='new feature'>New Feature</option>
                    <option value='payment'>Payment</option>
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label className='mt-3' style={{color: '#fefeff'}}>TITLE</Form.Label>
                <Form.Control style={{width: '669px'}} type='title' placeholder='Title'
                            onChange={e => {setTitle(e.target.value); setErrMex('');}} />
            </Form.Group>
            <Form.Group>
                <Form.Label className='mt-3' style={{color: '#fefeff'}}>TICKET CONTENT</Form.Label>
                <Form.Control as='textarea' className='add-content' style={{width: '800px'}}
                            type='text' placeholder='Ticket Content' onChange={e => { setContent(e.target.value); setErrMex(''); }} />
            </Form.Group>
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <div className='d-flex align-items-center'>
                    <Button className='my-button mt-3' type='submit'><b>ADD TICKET</b></Button>
                </div>
                <div className='d-flex align-items-center'></div>
                    <Button className='mt-3' variant='danger' onClick={() => navigate("/")}><b>CANCEL</b></Button>
                </div>
        </Form>

            <Modal show={modal} onHide={handleCancel} backdrop='static' keyboard={false}>
                <Modal.Header style={{color: '#fefeff', backgroundColor: '#002c49'}}>
                    <Modal.Title>Confirm Ticket Info</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{color: '#fefeff', backgroundColor: '#143859'}}>

                    <Table borderless>
                        <thead><tr><th>Category:</th></tr></thead>
                        <tbody><tr><td>{category.toUpperCase()}</td></tr></tbody>
                    </Table>
                    <Table borderless>
                        <thead><tr><th>Title:</th></tr></thead>
                        <tbody><tr><td style={{wordBreak: 'break-word'}}>{title.charAt(0).toUpperCase() + title.slice(1)}</td></tr></tbody>
                    </Table>
                    <Table borderless>
                        <thead><tr><th>Content:</th></tr></thead>
                        <tbody><tr><td style={{wordBreak: 'break-word', whiteSpace: 'pre-line'}}>{content.charAt(0).toUpperCase() + content.slice(1)}</td></tr></tbody>
                    </Table>
                    <Table borderless>
                        <thead><tr><th>User:</th></tr></thead>
                        <tbody><tr><td>{beautyName(props.user)}</td></tr></tbody>
                    </Table>
                    <Table borderless>
                        <OverlayTrigger placement='left' overlay={<Tooltip id='ETA-modal'>Estimated Time of Arrival</Tooltip>}>
                            <thead><tr><th>ETA:</th></tr></thead>
                        </OverlayTrigger>
                        <tbody><tr><td>{estimation}</td></tr></tbody>
                    </Table>
                    
                </Modal.Body>
                <Modal.Footer style={{ color: '#fefeff', backgroundColor: '#002c49' }}>
                    <div className='w-100 d-flex justify-content-between align-items-center py-2'>
                    <div className='d-flex align-items-center'>
                    <Button variant='danger' onClick={handleCancel}><b>CANCEL</b></Button>
                    </div>
                    <div className='d-flex align-items-center'>
                    <Button className='my-button' onClick={handleConfirm}><b>CONFIRM</b></Button>
                    </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { TicketAdd };