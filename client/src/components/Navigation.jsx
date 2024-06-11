import '../App.css';
import api from '../api.js'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginButton, LogoutButton } from './AuthN';
import { Button, Container, Navbar, Nav, Form } from 'react-bootstrap';

const NavBar = (props) => {

    return (
        <Navbar className="navbar-padding" style={{ color: '#fefeff', backgroundColor: '#143859' }}>

            <Navbar.Brand className="mx-2" style={{ color: '#fefeff' }}>
                <i className="bi bi-ticket-detailed mx-2" />
                ZenTicket
            </Navbar.Brand>

            <Nav>
                <Navbar.Text className="mx-2 fs-5">
                    {props.user && props.user.name && `${props.user.name}`}
                </Navbar.Text>
                <Form className="mx-2 mt-1">
                    {props.loggedIn ? <LogoutButton logout={props.logout} /> : <LoginButton />}
                </Form>
            </Nav>

        </Navbar>
    );
}


export { NavBar };