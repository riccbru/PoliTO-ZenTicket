import '../App.css';
import api from '../api.js'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginButton, LogoutButton } from './AuthN';
import { Button, Container, Navbar, Nav, Form } from 'react-bootstrap';

const Navigation = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    return (
        <Navbar style={{ color: '#fefeff', backgroundColor: '#143859' }} expand="lg">
            <Container fluid>
                <Navbar.Brand style={{ color: '#fefeff' }}>
                    <i className="bi bi-ticket-detailed"> ZenTicket</i>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        {loggedIn ? (
                            <>
                                <Nav.Text style={{ color: '#fefeff' }}>{user}</Nav.Text>
                                <LogoutButton logout={api.logout} />
                            </>
                        ) : (
                            <Button variant="outline-light" onClick={() => navigate('/login')}>
                                <i className="bi bi-box-arrow-in-left"></i>
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export { Navigation };