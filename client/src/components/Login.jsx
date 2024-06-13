import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card, Col, Row, Container } from 'react-bootstrap';

function LoginForm(props) {

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
        props.login(credentials)
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
                        <h1 className='text-center pb-3' style={{ color: '#fefeff' }}>ZenTicket</h1>
                        <Form onSubmit={handleSubmit}>
                            {errMex ?
                                <Alert dismissible onClose={() => setErrMex('')} variant='danger'>{errMex}</Alert>
                                : null}
                            <Form.Group className='mb-3'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type='username' value={username} placeholder='name_surname' onChange={e => setUsername(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' value={password} placeholder='password' onChange={e => setPassword(e.target.value)}></Form.Control>
                            </Form.Group>
                            <div className='d-flex justify-content-center'>
                                <Button className='my-button mt-3' type='submit'>LOGIN</Button>
                            </div>
                            <p></p>
                            <div className='d-flex justify-content-center'>or</div>
                            <p></p>
                            <div className='d-flex justify-content-center'>
                                <Button variant='warning' type='submit' onClick={() => navigate('/home')}>Proceed unauthenticated</Button>
                            </div>

                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

function LoginButton(props) {
    const navigate = useNavigate();
    return(
        <Button className='my-button' style={{fontSize: '22px'}} onClick={() => navigate("/login")}>
            <i class='bi bi-box-arrow-left mx-1'></i>
        </Button>
    );
}

function LogoutButton(props) {
    return(
        <Button className='my-button' style={{fontSize: '22px'}} onClick={props.logout}>
            <i class='bi bi-box-arrow-right mx-1'></i>
        </Button>
    );
}

export { LoginForm, LoginButton, LogoutButton };