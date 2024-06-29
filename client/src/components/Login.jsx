import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card, Col, OverlayTrigger, Tooltip, Row } from 'react-bootstrap';

function LoginForm(props) {

    const {login} = props;

    const navigate = useNavigate();
        
    const [errMex, setErrMex] = useState('');
    const [username, setUsername] = useState('enrico_masala');
    const [password, setPassword] = useState('passwd');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };
  
      if (!username) {
        setErrMex('Username cannot be empty');
      } else if (!password) {
        setErrMex('Password cannot be empty');
      } else {
        login(credentials)
          .then( () => navigate( "/" ) )
          .catch((err) => { 
            setErrMex(err.error); 
          });
      }
    };

    return (
        <Row className='justify-content-center align-items-center' style={{ height: '75vh' }}>
            <Col xs={12} md={6} lg={4}>
                <Card style={{ color: '#fefeff', backgroundColor: '#143859' }}>
                    <Card.Body>
                        <div className='justify-content-center'>
                            <h1 className='text-center pb-3' style={{ color: '#fefeff' }}>
                                <img alt='' src='../brand.png' width='45' height='45' className='mx-3'/>
                                ZenTicket
                            </h1>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            {errMex ?
                                <Alert onClose={() => setErrMex('')} variant='danger'>{errMex}</Alert>
                                : null}
                            <Form.Group className='mb-3'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type='username' value={username} placeholder='name_surname' onChange={e => { setUsername(e.target.value); setErrMex(''); }}></Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' value={password} placeholder='password' onChange={e => { setPassword(e.target.value); setErrMex(''); }}></Form.Control>
                            </Form.Group>

                            <div className='d-flex justify-content-center'>
                                <Button className='my-button mt-3' type='submit'>LOGIN</Button>
                            </div>
                            <p></p>
                            <div className='d-flex justify-content-center'>or</div>
                            <p></p>
                            <div className='d-flex justify-content-center'>
                                <Button style={{ color: '#fefeff', backgroundColor: '#7f4af6' }} type='submit' onClick={() => navigate('/')}>Proceed unauthenticated</Button>
                            </div>

                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

function LoginButton() {
    const navigate = useNavigate();
    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id='login'>LOGIN</Tooltip>}>
        <Button className="my-button" style={{ fontSize: "22px" }} onClick={() => navigate("/login")}>
          <i className="bi bi-box-arrow-left mx-1"></i>
        </Button>
      </OverlayTrigger>
    );
}

function LogoutButton(props) {
    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="logout">LOGOUT</Tooltip>}>
        <Button className="my-button" style={{ fontSize: "22px" }} onClick={props.logout}>
          <i className="bi bi-box-arrow-right mx-1"></i>
        </Button>
      </OverlayTrigger>
    );
}

export { LoginForm, LoginButton, LogoutButton };